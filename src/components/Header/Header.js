import React, { useState, useRef, useEffect } from 'react';
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
import { version } from '../../../package.json';

const useOutsideAlerter = (ref, callback) => {
  // Alert if clicked on outside of element
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(false);
      }
    }

    useEffect(() => {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    });
}

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

  const toggleCallback = () => {
    toggleRightPanel(false);
    toggleSwitcher(false);
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, toggleCallback);

  return (
    <div ref={wrapperRef}>
    <Header aria-label="Carbon Tutorial">
      <SkipToContent />
      <HeaderName style={{WebkitAppRegion: "no-drag"}} element={Link} to="/" prefix="ESV">
        Lookup
      </HeaderName>
      <HeaderNavigation aria-label="Carbon Tutorial">
        {/*<HeaderMenuItem element={Link} to="/recent">Recent</HeaderMenuItem>*/}
      </HeaderNavigation>
      <HeaderGlobalBar className="headerButtons">
        <NotificationAction />
        <HeaderGlobalAction style={{WebkitAppRegion: "no-drag"}} aria-label="Settings" isActive={rightPanel}  onClick={() => {
          toggleSwitcher(false);
          toggleRightPanel(!rightPanel);
        }}>
          <Settings20 />
        </HeaderGlobalAction>
        <HeaderGlobalAction style={{WebkitAppRegion: "no-drag"}} aria-label="App Switcher" isActive={switcher} onClick={() => {
          toggleRightPanel(false);
          toggleSwitcher(!switcher);
        }}>
          <AppSwitcher20 />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
      <HeaderPanel aria-label="Header Panel" expanded={rightPanel}>
        <span className="dividerLabel">Verses</span>
        <SwitcherDivider className="divider"/>
        <ToggleItem setting="api.includeHeadings" id="headings" labelText="Include headings" />
        <ToggleItem setting="api.includeVerseNumbers" id="numbers" labelText="Include verse numbers" />
        {/** <ToggleItem id="audio" setting="includeAudio" labelText="Include audio" /> */}
        <ToggleItem id="footnotes" setting="api.includeFootnotes" labelText="Include footnotes" />
        <ToggleItem id="references" setting="api.includeReferences" labelText="Include reference" />
        <span className="dividerLabel">Copy</span>
        <SwitcherDivider className="divider"/>
        <ToggleItem id="autoCopy" setting="copy.auto" labelText="Auto add to clipboard" />
      </HeaderPanel>
      <HeaderPanel aria-label="Switcher Panel" expanded={switcher}>
        <Switcher role="menu" aria-label="Switcher Container">
          <SwitcherItem aria-label="Link 1" href="#" onClick={() => {toggleAbout(true)}}>
            About
          </SwitcherItem>
          <SwitcherDivider />
        </Switcher>
      </HeaderPanel>
      <Modal open={about} passiveModal modalHeading="ESV Lookup" modalLabel="About" onRequestClose={() => {toggleAbout(false)}}>
        <h4>Version {version}</h4>
        <h4>Author - David Wosk</h4>
        <h4>Copyright - All Rights Reserved</h4>
        <article style={{paddingTop: "1em"}}>Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. You may not copy or download more than 500 consecutive verses of the ESV Bible or more than one half of any book of the ESV Bible.</article>
      </Modal>
    </Header>
</div>
  )
}

export default LookupHeader;
