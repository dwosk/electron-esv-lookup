import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

const TitleBar = () => {
  const [useDefault, toggle] = useState(true);
  const handleClick = message => {
    ipcRenderer.send(`app:${message}`);
    if (message === 'maximize' || message === 'restore') {
      toggle(!useDefault);
    }
  }
  let windowIcon;
  if (useDefault) {
    windowIcon = <button className="ui-btn maximize" onClick={() => { handleClick('maximize'); }}>
        			     <svg viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
        		     </button>
  } else {
    windowIcon = <button className="ui-btn restore" onClick={() => { handleClick('restore'); }}>
                   <svg viewBox="0 0 492 492"><path d="M114.279,0v114.274H0v378.034h378.039V378.029h114.269V0H114.279z M358.346,472.615H19.692V133.966h338.654V472.615zM472.615,358.337h-94.577V114.274H133.971V19.692h338.644V358.337z"/></svg>
                 </button>
  }
  return (
    <div className="ui-titlebar">
    	<div className="ui-titlecontrols">
    		<button className="ui-btn minimize" onClick={() => { handleClick('minimize'); }}>
    			<svg x="0px" y="0px" viewBox="0 0 10.2 1"><rect x="0" y="50%" width="10.2" height="1" /></svg>
    		</button>
        {windowIcon}
        <button className="ui-btn close" onClick={() => { handleClick('quit'); }}>
    			<svg viewBox="0 0 10 10"><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" /></svg>
    		</button>
    	</div>
    </div>
  );
};

export default TitleBar;
