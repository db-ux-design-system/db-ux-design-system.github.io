import { DBControlPanelSecondaryActions, DBButton } from '@db-ux/react-core-components';

const DemoSecondaryActions = () => (
	<DBControlPanelSecondaryActions>
		<DBButton variant="filled" iconLeading="person" type="button">
			Anmelden
		</DBButton>
	</DBControlPanelSecondaryActions>
);

export default DemoSecondaryActions;
