import { DBControlPanelPrimaryActions } from "@db-ux/react-core-components";
import { appConfig } from "@root/app.config.ts";
import { Search } from "@template/layouts/default/shell/search";

const PrimaryActions = () => (
  <DBControlPanelPrimaryActions>
    { <Search /> }
    <a className="db-button" href={`mailto:db-ux-designsystem@deutschebahn.com`} data-variant="brand">
      Contact Us
    </a>
  </DBControlPanelPrimaryActions>
);

export default PrimaryActions;
