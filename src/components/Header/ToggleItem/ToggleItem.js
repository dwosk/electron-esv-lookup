import React, { useState } from 'react';
import ToggleSmall from 'carbon-components-react/lib/components/ToggleSmall';
import Settings from '../../../helpers/settings';

const ToggleItem = (props) => {
  const setting = props.setting;
  const [enabled, toggle] = useState(
    Settings.get(`${setting}`)
  );

  return (
    <ToggleSmall
      className="toggleLabel"
      toggled={enabled}
      id={props.id}
      labelText={props.labelText}
      aria-label=""
      onToggle={() => {
        Settings.set(`${setting}`, !enabled);
        toggle(!enabled);
      }}
    />
  );
};

export default ToggleItem;
