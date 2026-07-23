import { DBControlPanelPrimaryActions } from '@db-ux/react-core-components';
import { useTranslation } from '@template/i18n';

const PrimaryActions = () => {
	const { t } = useTranslation();

	return (
		<DBControlPanelPrimaryActions>
			{/* <Search /> */}
			<a
				className="db-button"
				href={`mailto:db-ux-designsystem@deutschebahn.com`}
				data-variant="brand"
				data-wrap="false"
			>
				{t('shell.contactUs')}
			</a>
		</DBControlPanelPrimaryActions>
	);
};

export default PrimaryActions;
