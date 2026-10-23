import { type CSSProperties } from 'react';
import { DBControlPanelBrand } from '@db-ux/react-core-components';
import { useTheme } from '@template/context/theme-context';

const DemoBrand = () => {
	const { logo, logoSvg } = useTheme();

	// The link wraps the whole brand so logo and application name are one click
	// target. Core v6 resets the link styling via `a:has(.db-control-panel-brand)`,
	// so the name is not underlined. The logo itself is rendered by the brand's
	// `::before` from `--db-logo-url`, which we point at the current theme's SVG.
	const logoStyle = logoSvg
		? ({ '--db-logo-url': `url('${logoSvg}')` } as CSSProperties)
		: undefined;

	return (
		<a href="#" aria-label={logo} style={logoStyle}>
			<DBControlPanelBrand>{logo}</DBControlPanelBrand>
		</a>
	);
};

export default DemoBrand;
