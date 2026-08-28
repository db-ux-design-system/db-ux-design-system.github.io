import { slug } from 'github-slugger';
import CardTeaser from './CardTeaser';

interface FigmaLearnTeaserProps {
	componentName: string;
	locale?: 'en' | 'de';
	/**
	 * Overrides the fragment derived from `componentName`. Needed when several
	 * components share one section on the Figma Learn page, for example the Shell
	 * and Control Panel subcomponents pointing at "Control Panel & Shell".
	 */
	anchor?: string;
}

const FigmaLearnTeaser = ({ componentName, locale, anchor }: FigmaLearnTeaserProps) => {
	const isDE =
		locale === 'de' ||
		(typeof window !== 'undefined' && window.location.pathname.startsWith('/de/'));
	// Use the same slugger Astro applies to markdown headings, so the fragment
	// always matches the generated heading id on the Figma Learn page.
	const fragment = anchor ?? slug(componentName.trim());
	const figmaLearnPath = isDE ? '/de/dokumentation/lernen/figma' : '/documentation/learn/figma';

	return (
		<CardTeaser
			title="Figma Learn"
			description={
				isDE
					? `Figma-spezifische Workarounds und Tipps zur Verwendung der ${componentName}-Komponente in deinen Designs.`
					: `Find Figma-specific workarounds and tips for using the ${componentName} component in your designs.`
			}
			url={`${figmaLearnPath}#${fragment}`}
			image="/assets/teasers/figma.png"
			imageAlt=""
		/>
	);
};

export default FigmaLearnTeaser;
