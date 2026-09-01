import { DBControlPanelActions1 } from '@db-ux/react-core-components';
import { useTranslation } from '@template/i18n';

const PrimaryActions = () => {
	const { t } = useTranslation();

	return (
		<DBControlPanelActions1>
			{/* <Search /> */}
			<a
				className="db-button"
				href={`mailto:db-ux-designsystem@deutschebahn.com`}
				data-variant="brand"
				data-wrap="false"
			>
				{t('shell.contactUs')}
			</a>
		</DBControlPanelActions1>
	);
};

export default PrimaryActions;
