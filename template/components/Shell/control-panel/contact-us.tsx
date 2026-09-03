import { useTranslation } from '@template/i18n';

/**
 * Contact button linking to the design system mailbox.
 *
 * Content only - the caller wraps this in the actions slot that matches the
 * intended position. On desktop it sits in Actions 2 on the right, on mobile in
 * Actions 2 as the first item of the drawer footer.
 */
const ContactUs = () => {
	const { t } = useTranslation();

	return (
		<a
			className="db-button"
			href="mailto:db-ux-designsystem@deutschebahn.com"
			data-variant="brand"
			data-wrap="false"
		>
			{t('shell.contactUs')}
		</a>
	);
};

export default ContactUs;
