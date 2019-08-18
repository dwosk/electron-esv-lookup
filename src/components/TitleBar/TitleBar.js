import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

const handleClose = () => {
  ipcRenderer.send('app:quit');
}

const TitleBar = () => {
  return (
    <div class="ui-titlebar">
    	<div class="ui-titlecontrols">
    		<button class="ui-btn minimize">
    			<svg x="0px" y="0px" viewBox="0 0 10.2 1"><rect x="0" y="50%" width="10.2" height="1" /></svg>
    		</button><button class="ui-btn maximize">
    			<svg viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
    		</button><button class="ui-btn close" onClick={handleClose}>
    			<svg viewBox="0 0 10 10"><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" /></svg>
    		</button>
    	</div>
    </div>
  );
};

export default TitleBar;

// <div class="titlebar-controls">
//     <div class="titlebar-minimize">
//         <svg x="0px" y="0px" viewBox="0 0 10 1">
//             <rect fill="#000000" width="10" height="1"></rect>
//         </svg>
//     </div>
//     <div class="titlebar-resize">
//         <svg class="fullscreen-svg" x="0px" y="0px" viewBox="0 0 10 10">
//             <path fill="#000000" d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z "/>
//         </svg>
//         <svg class="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10">
//             <mask id="Mask">
//                 <rect fill="#FFFFFF" width="10" height="10"></rect>
//                 <path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z"/>
//                 <path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z"/>
//             </mask>
//             <path fill="#000000" d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)"/>
//         </svg>
//     </div>
//     <div class="titlebar-close">
//         <svg x="0px" y="0px" viewBox="0 0 10 10">
//             <polygon fill="#000000" points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"></polygon>
//         </svg>
//     </div>
// </div>
