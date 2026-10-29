import type { ReactElement } from 'react';
import { DBTabItem, DBTabList, DBTabPanel, DBTabs } from '@db-ux/react-core-components';

/*
 * Framework switcher for the usage docs of a component.
 *
 * The panels arrive as HTML, rendered at build time from the core-web
 * Markdown (including Shiki highlighting).
 *
 * Mounted in the browser by framework-tabs-init.ts: DBTabs sets the
 * selection, the tab/panel ARIA links and the keyboard handling from script.
 */

export interface FrameworkPanel {
	label: string;
	/** Trusted HTML, rendered at build time from the docs snapshot. */
	html: string;
}

interface Props {
	/** Accessible name of the tab list. */
	label: string;
	panels: FrameworkPanel[];
	/** Language of the panel content, set when it differs from the page. */
	contentLang?: string;
}

const FrameworkTabs = ({ label, panels, contentLang }: Props): ReactElement => (
	<DBTabs label={label} className="component-code-framework-tabs">
		<DBTabList>
			{panels.map((panel) => (
				<DBTabItem key={panel.label}>{panel.label}</DBTabItem>
			))}
		</DBTabList>
		{panels.map((panel) => (
			<DBTabPanel key={panel.label}>
				<div lang={contentLang} dangerouslySetInnerHTML={{ __html: panel.html }} />
			</DBTabPanel>
		))}
	</DBTabs>
);

export default FrameworkTabs;
