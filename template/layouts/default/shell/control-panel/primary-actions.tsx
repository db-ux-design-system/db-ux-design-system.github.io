import { DBControlPanelPrimaryActions } from '@db-ux/react-core-components';
import { appConfig } from '@root/app.config.ts';
import ColorModeSwitch from '@template/components/color-mode-switch/ColorModeSwitch.tsx';

const PrimaryActions = () => (
  <DBControlPanelPrimaryActions>
    <ColorModeSwitch />
    {/* <Search /> */}
    <a
      className="db-button"
      href={`${appConfig.basePath}resources/documentation/getting-started`}
      data-variant="brand"
    >
      Start now
    </a>
  </DBControlPanelPrimaryActions>
);

export default PrimaryActions;
