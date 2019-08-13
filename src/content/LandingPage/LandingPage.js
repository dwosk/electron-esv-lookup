import React, { Component } from 'react';
import { clipboard } from 'electron';
import TextInput from 'carbon-components-react/lib/components/TextInput';
import Button from 'carbon-components-react/lib/components/Button';
import InlineLoading from 'carbon-components-react/lib/components/InlineLoading';
import OverflowMenu from 'carbon-components-react/lib/components/OverflowMenu';
import OverflowMenuItem from 'carbon-components-react/lib/components/OverflowMenuItem';
import RadioButton from 'carbon-components-react/lib/components/RadioButton';
import { getPassage, Settings } from '../../helpers';

let notificationQueue = [];
class LandingPage extends Component {
  constructor() {
    super();
    this.state = {
      submitting: false,
      success: false,
      apiType: Settings.get('api.endpoint')
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        if (document.getElementById('submitBtn')) {
          document.getElementById('submitBtn').click();
        }
      }
    });
  }

  clearInput() {
    document.getElementById('reference').value = '';
  }

  getInput() {
    return document.getElementById('reference').value;
  }

  insertHtml(html) {
    let passageEl = document.getElementById('result');
    passageEl.innerHTML = html;
  }

  insertSearchResults(resultsArr, input) {
    let passageEl = document.getElementById('result');
    passageEl.innerHTML = '';
    resultsArr.forEach((reference) => {
      let referenceNode = `<h3>${reference.reference}</h3>`;
      let markUpContent = reference.content.replace(input, `<strong>${input}</strong>`);
      let contentNode = `<div style="padding-bottom: 1em">${markUpContent}</div>`
      passageEl.innerHTML += referenceNode + contentNode;
    })
  }

  async handleSubmit() {
    let input = await this.getInput();
    if (!input) {
      return;
    }

    this.setState({
      submitting: true
    });

    let result = await getPassage(input);
    if (result) {
      /** Search API returns array and is not HTML */
      if (result instanceof Array) {
        this.insertSearchResults(result, input);
      } else {
        this.insertHtml(result);
        /** Add passage to clipboard */
        clipboard.writeHTML(result);
        this.sendNotification(input);
      }

      this.setState({ submitting: false, success: true });
    }

    /** Reset state after an additional 1.5 seconds  */
    setTimeout(() => this.setState({ success: false, submitting: false }), 1500);
  }

  sendNotification(body) {
    if (!Settings.get('notifications.enabled')) {
      return;
    }

    /** Only show one notification at a time */
    if (notificationQueue.length === 0) {
      let myNotification = new Notification('Success!', {
        body: `Copied to clipboard: ${body}`,
        silent: true
      })
      notificationQueue.push(myNotification);

      /** Dismiss notification after 3s */
      /** Windows - app must be pinned to Start */
      new Promise(function(resolve) {
        setTimeout(() => {
          myNotification.close()
          notificationQueue.pop();
          resolve()
        }, 4000);
      });
    }
  }

  render() {
    const { submitting, success, apiType } = this.state;
    const handleSubmit = this.handleSubmit.bind(this);
    let props = {
      [Settings.get('api.endpoint') === 0 ? 'checked' : 'foo']: true,
    }

    return (
      <>
        <div id="inputRow">
        <TextInput id="reference" labelText="Reference" placeholder="Ex: John 1:12,15-17"/>
        <OverflowMenu>
          <h1 id="overflowTitle">Type</h1>
          <RadioButton
            value="html"
            id="html-option"
            name="toolbar-radio"
            labelText="HTML"
            checked={apiType === 0}
            onClick={() => {
              Settings.set('api.endpoint', 0);
              this.setState({apiType: 0});
            }}
          />
          <RadioButton
            value="search"
            id="search-option"
            name="toolbar-radio"
            labelText="Search"
            checked={apiType === 1}
            onClick={() => {
              Settings.set('api.endpoint', 1);
              this.setState({apiType: 1});
            }}
          />
        </OverflowMenu>
        </div>
        <div id="buttons">
        <Button kind="secondary" size="small" disabled={submitting || success} onClick={() => {this.clearInput()}}>
          Cancel
        </Button>
        {submitting || success ? (
          <InlineLoading
            success={success}
            description="Retrieving..."
          />
        ) : (
          <Button id="submitBtn" size="small" onClick={handleSubmit}>Enter</Button>
        )}
        </div>
        <article id="result"></article>
      </>
    );
  }
}

export default LandingPage;
