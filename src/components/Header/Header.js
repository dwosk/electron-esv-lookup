import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  SkipToContent,
  Switcher,
  SwitcherItem,
  SwitcherDivider
} from 'carbon-components-react/lib/components/UIShell';
import Modal from 'carbon-components-react/lib/components/Modal';
import ToggleItem from './ToggleItem';
import NotificationAction from './NotificationAction';
import Settings20 from '@carbon/icons-react/lib/settings/20';
import AppSwitcher20 from '@carbon/icons-react/lib/app-switcher/20';

const LookupHeader = () => {
  const [rightPanel, toggleRightPanel] = useState(
    false
  );
  const [switcher, toggleSwitcher] = useState(
    false
  );
  const [about, toggleAbout] = useState(
    false
  );

  return (
    <Header aria-label="Carbon Tutorial">
      <SkipToContent />
      <HeaderName element={Link} to="/" prefix="ESV">
        Lookup
      </HeaderName>
      <HeaderNavigation aria-label="Carbon Tutorial">
        <HeaderMenuItem element={Link} to="/recent">Recent</HeaderMenuItem>
      </HeaderNavigation>
      <HeaderGlobalBar>
        <NotificationAction />
        <HeaderGlobalAction aria-label="Settings" isActive={rightPanel}>
          <Settings20 onClick={() => {
            toggleSwitcher(false);
            toggleRightPanel(!rightPanel);
          }}/>
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="App Switcher" isActive={switcher}>
          <AppSwitcher20 onClick={() => {
            toggleRightPanel(false);
            toggleSwitcher(!switcher);
          }}/>
        </HeaderGlobalAction>
      </HeaderGlobalBar>
      <HeaderPanel aria-label="Header Panel" expanded={rightPanel}>
        <ToggleItem setting="includeHeadings" id="headings" labelText="Include headings" />
        <ToggleItem setting="includeVerseNumbers" id="numbers" labelText="Include verse numbers" />
        {/** <ToggleItem id="audio" setting="includeAudio" labelText="Include audio" /> */}
        <ToggleItem id="footnotes" setting="includeFootnotes" labelText="Include footnotes" />
        <ToggleItem id="references" setting="includeReferences" labelText="Include reference" />
      </HeaderPanel>
      <HeaderPanel aria-label="Switcher Panel" expanded={switcher}>
        <Switcher role="menu" aria-label="Switcher Container">
          <SwitcherItem aria-label="Link 1" href="#" onClick={() => {toggleAbout(true)}}>
            About
          </SwitcherItem>
          <SwitcherDivider />
        </Switcher>
      </HeaderPanel>
      <Modal open={about} passiveModal modalHeading="About" modalLabel="ESV Lookup" onRequestClose={() => {toggleAbout(false)}}>
        <h4>Author - David Wosk</h4>
        <h4>Copyright - All Rights Reserved</h4>

        <article style={{paddingTop: "1em"}}>Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. You may not copy or download more than 500 consecutive verses of the ESV Bible or more than one half of any book of the ESV Bible.</article>
      </Modal>
    </Header>
  )
}

export default LookupHeader;
