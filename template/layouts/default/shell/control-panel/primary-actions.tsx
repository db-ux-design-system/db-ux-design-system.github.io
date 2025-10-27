import { DBControlPanelPrimaryActions } from "@db-ux/react-core-components";
import { appConfig } from "@root/app.config.ts";
import { Search } from "@template/layouts/default/shell/search";

const PrimaryActions = () => (
  <DBControlPanelPrimaryActions>
    { <Search /> }
    <a className="db-button" href={`${appConfig.basePath}resources/documentation/getting-started`} data-variant="brand">
      Start now
    </a>
  </DBControlPanelPrimaryActions>
);

export default PrimaryActions;
