import { DBSwitch, DBTooltip } from '@db-ux/react-core-components';
import { useColorMode } from '@template/context/color-mode-context.tsx';
import { useTranslation } from '@template/i18n';

const ColorModeSwitch = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const { t } = useTranslation();
	const isDark = colorMode === 'dark';

	return (
		<DBSwitch
			label={t('shell.colorModeToggle')}
			checked={isDark}
			visualAid
			icon="sun"
			iconTrailing="moon"
			showLabel={false}
			onChange={toggleColorMode}
		>
			<DBTooltip>{t('shell.colorModeToggle')}</DBTooltip>
			{t('shell.colorModeToggle')}
		</DBSwitch>
	);
};

export default ColorModeSwitch;
