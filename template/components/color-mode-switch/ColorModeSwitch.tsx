import { DBButton, DBTooltip } from '@db-ux/react-core-components';
import { useColorMode } from '@template/context/color-mode-context.tsx';
import { useTranslation } from '@template/i18n';

const ColorModeSwitch = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const { t } = useTranslation();
	const isDark = colorMode === 'dark';

	return (
		<DBButton
			type="button"
			variant="ghost"
			// Show the mode it switches to: a moon in light mode, a sun in dark mode.
			icon={isDark ? 'sun' : 'moon'}
			noText
			aria-pressed={isDark}
			className="color-mode-switch"
			onClick={toggleColorMode}
		>
			{t('shell.colorModeToggle')}
			<DBTooltip>{t('shell.colorModeToggle')}</DBTooltip>
		</DBButton>
	);
};

export default ColorModeSwitch;
