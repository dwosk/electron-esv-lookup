import React, { useState } from 'react';
import {
  HeaderGlobalAction,
} from 'carbon-components-react/lib/components/UIShell';
import Notification20 from '@carbon/icons-react/lib/notification/20';
import NotificationOff20 from '@carbon/icons-react/lib/notification--off/20';
import { Settings } from '../../../helpers';



const NotificationAction = (props) => {
  const [enabled, toggle] = useState(
    Settings.get('notifications.enabled')
  );

  const notification = enabled ? <Notification20 /> : <NotificationOff20 />;
  return (
    <HeaderGlobalAction
      aria-label="Notifications"
      onClick={
        () => {
          Settings.set('notifications.enabled', !enabled);
          toggle(!enabled)
        }
      }
    >
      {notification}
    </HeaderGlobalAction>
  );
};

export default NotificationAction;
