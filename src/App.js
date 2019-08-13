import React, { Component } from 'react';
import './app.scss';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import Header from './components/Header';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './content/LandingPage';
import RecentPage from './content/RecentPage';

class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Content>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/recent" component={RecentPage} />
          </Switch>
        </Content>
      </>
    );
  }
}

export default App
