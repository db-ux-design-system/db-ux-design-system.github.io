import { DBControlPanelSecondaryActions, DBButton } from '@db-ux/react-core-components';

const DemoSecondaryActions = () => (
	<DBControlPanelSecondaryActions>
		<DBButton variant="ghost" iconLeading="magnifying_glass" noText></DBButton>
		<DBButton variant="ghost" iconLeading="question_mark_circle" noText></DBButton>
		<DBButton variant="ghost" iconLeading="wrench" noText></DBButton>
	</DBControlPanelSecondaryActions>
);

export default DemoSecondaryActions;
