import { DBControlPanelSecondaryActions, DBButton, DBTooltip } from '@db-ux/react-core-components';

const DemoSecondaryActions = () => (
	<DBControlPanelSecondaryActions>
		<DBButton variant="ghost" iconLeading="magnifying_glass" noText type="button">
			<DBTooltip>Describe action</DBTooltip>
		</DBButton>
		<DBButton variant="ghost" iconLeading="question_mark_circle" noText type="button">
			<DBTooltip>Describe action</DBTooltip>
		</DBButton>
		<DBButton variant="ghost" iconLeading="wrench" noText type="button">
			<DBTooltip>Describe action</DBTooltip>
		</DBButton>
	</DBControlPanelSecondaryActions>
);

export default DemoSecondaryActions;
