import React, { Component } from 'react';
import { clipboard, remote } from 'electron';
import TextInput from 'carbon-components-react/lib/components/TextInput';
import Button from 'carbon-components-react/lib/components/Button';
import InlineLoading from 'carbon-components-react/lib/components/InlineLoading';
import OverflowMenu from 'carbon-components-react/lib/components/OverflowMenu';
import OverflowMenuItem from 'carbon-components-react/lib/components/OverflowMenuItem';
import RadioButton from 'carbon-components-react/lib/components/RadioButton';
import Mp320 from '@carbon/icons-react/lib/MP3/20';
// import Delete16 from '@carbon/icons-react/lib/delete/16';
// import Popup20 from '@carbon/icons-react/lib/popup/20';
import { getPassage, NotificationManager, Settings } from '../../helpers';
import autocomplete from 'autocompleter';
import { BOOKS } from '../../helpers/books';

const shell = remote.shell;

let notificationQueue = [];
class LandingPage extends Component {
  constructor() {
    super();
    this.state = {
      submitting: false,
      submittingMp3: false,
      success: false,
      apiType: Settings.get('api.endpoint')
    };
  }

  componentDidMount() {
    let recentlyAutoCompleted = false;

    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        if (recentlyAutoCompleted) {
          return;
        }

        if (document.getElementById('submitBtn')) {
          document.getElementById('submitBtn').click();
        }
      }
    });

    const allowedChars = new RegExp(/^[a-zA-Z0-9\s]+$/);
    function charsAllowed(value) {
      return allowedChars.test(value);
    };

    autocomplete({
      input: document.getElementById("reference"),
      minLength: 1,
      fetch: (text, callback) => {
        if (this.state.apiType === 1) {
          return;
        }

        var match = text.toLowerCase();
        callback(BOOKS.filter(function(n) { return n.label.toLowerCase().indexOf(match) !== -1; }));
      },
      onSelect: function(item) {
          // Set text box value based on selection
          recentlyAutoCompleted = true;
          /** Reset after 1 second */
          setTimeout(() => {
            recentlyAutoCompleted = false;
          }, 1000);
          var textBox = document.getElementById("reference");
          textBox.value = item.value;
          textBox.focus();
      },
      render: (item, value) => {
        var itemElement = document.createElement("div");
        if (charsAllowed(value)) {
          var regex = new RegExp(value, 'gi');
          var inner = item.label.replace(regex, function(match) { return "<strong>" + match + "</strong>" });
          itemElement.innerHTML = inner;
        } else {
          itemElement.textContent = item.label;
        }
        return itemElement;
      },
       customize: (input, inputRect, container, maxHeight) => {
          if (maxHeight < 100) {
              container.style.top = "";
              container.style.bottom = (window.innerHeight - inputRect.bottom + input.offsetHeight) + "px";
              container.style.maxHeight = "200px";
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
    this.clearResult();
    let passageEl = document.getElementById('htmlResult');
    passageEl.innerHTML = html;
  }

  insertSearchResults(resultsArr, input) {
    this.clearResult();
    let passageEl = document.getElementById('searchResult');
    passageEl.innerHTML = '';
    resultsArr.forEach((reference) => {
      let referenceNode = `<h3>${reference.reference}</h3>`;
      let markUpContent = reference.content.replace(input, `<strong>${input}</strong>`);
      let contentNode = `<div style="padding-bottom: 1em">${markUpContent}</div>`
      passageEl.innerHTML += referenceNode + contentNode;
    })
  }

  clearResult() {
    let htmlEl = document.getElementById('htmlResult');
    if (htmlEl) {
      htmlEl.innerHTML = '';
    }

    let searchEl = document.getElementById('searchResult');
    if (searchEl) {
      searchEl.innerHTML = '';
    }
  }

  handleDeleteButton() {
    this.clearResult();
  }

  async handleMp3() {
    let input = await this.getInput();
    if (!input) {
      return;
    }

    this.setState({ submittingMp3: true });
    let result = await getPassage(input, { mp3: true });
    console.log('mp3 downloaded:', result);
    if (result && result.path) {
      NotificationManager.create('MP3 ready 🎉', result.path, (event) => {
        shell.showItemInFolder(result.path);
      });
    } else {
      NotificationManager.create('MP3 failed to download 😢', 'File size might be too big.');
    }

    this.setState({ submittingMp3: false});
  }

  async handleSubmit() {
    let input = await this.getInput();
    if (!input) {
      return;
    }

    this.setState({
      submitting: true
    });

    // todo: parse first and put some logic in component
    let result = await getPassage(input);
    if (result) {
      /** Search API returns array and is not HTML */
      if (result instanceof Array) {
        this.insertSearchResults(result, input);
      } else {
        this.insertHtml(result);
        if (Settings.get('copy.auto')) {
          /** Add passage to clipboard */
          clipboard.writeHTML(result);
          NotificationManager.create('Ready to Go!', `Copied ${input}`)
        }
      }

      this.setState({ submitting: false, success: true });
    }

    /** Reset state after an additional 1.5 seconds  */
    setTimeout(() => this.setState({ success: false, submitting: false }), 1500);
  }

  render() {
    const { submitting, success, apiType, submittingMp3 } = this.state;
    const handleSubmit = this.handleSubmit.bind(this);
    let props = {
      [Settings.get('api.endpoint') === 0 ? 'checked' : 'foo']: true,
    }
    let resultEl = document.getElementById('htmlResult');
    let resultButtons;
    if (resultEl && resultEl.innerHTML !== "") {
      // <div className="verseButtonContainer">
      //   <Popup20 className="verseButton"/>
      // </div>
      // <div className="verseButtonContainer" onClick={() => this.handleDeleteButton()}>
      //   <Delete16 className="verseButton delete"/>
      // </div>
      resultButtons = <>
                        <div className="verseButtonContainer" onClick={() => {this.handleMp3()}}>
                          <Mp320 className="verseButton"/>
                        </div>
                      </>
    }

    return (
      <>
        <div id="inputRow">
        <TextInput id="reference" labelText="Reference" placeholder="Ex: John 1:12,15-17"/>
        <OverflowMenu>
          <h1 id="overflowTitle">Lookup Type</h1>
          <RadioButton
            value="html"
            id="html-option"
            name="toolbar-radio"
            labelText="Reference"
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
        {/* {resultButtons} */}
        { submittingMp3 ? (
          <InlineLoading className='resultButtonsLoading'/>
        ) : (
          resultButtons
        )}
        <article id="htmlResult" className="result"></article>
        <article id="searchResult" classNamet="result"></article>
      </>
    );
  }
}

export default LandingPage;
