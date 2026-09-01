import { DBControlPanelActions2 } from '@db-ux/react-core-components';
import { useTranslation } from '@template/i18n';

const Actions2 = () => {
	const { t } = useTranslation();

	return (
		<DBControlPanelActions2>
			{/* <Search /> */}
			<a
				className="db-button"
				href={`mailto:db-ux-designsystem@deutschebahn.com`}
				data-variant="brand"
				data-wrap="false"
			>
				{t('shell.contactUs')}
			</a>
		</DBControlPanelActions2>
	);
};

export default Actions2;
