import { DBControlPanelActions2, DBButton } from '@db-ux/react-core-components';

const DemoSecondaryActions = () => (
	<DBControlPanelActions2>
		<DBButton variant="filled" iconLeading="person" type="button">
			Anmelden
		</DBButton>
	</DBControlPanelActions2>
);

export default DemoSecondaryActions;
