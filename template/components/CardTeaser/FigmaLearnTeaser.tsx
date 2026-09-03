import CardTeaser from './CardTeaser';

interface FigmaLearnTeaserProps {
	componentName: string;
	locale?: 'en' | 'de';
	anchor?: string;
}

const FigmaLearnTeaser = ({ componentName, locale, anchor }: FigmaLearnTeaserProps) => {
	const isDE =
		locale === 'de' ||
		(typeof window !== 'undefined' && window.location.pathname.startsWith('/de/'));

	const figmaLearnUrl = isDE
		? '/de/dokumentation/lernen/figma'
		: '/documentation/learn/figma';

	return (
		<CardTeaser
			title="Figma Learn"
			description={
				isDE
					? `Figma-spezifische Workarounds und Tipps zur Verwendung der ${componentName}-Komponente in deinen Designs.`
					: `Find Figma-specific workarounds and tips for using the ${componentName} component in your designs.`
			}
			url={`${figmaLearnUrl}${anchor ? `#${anchor}` : ''}`}
			image="/assets/teasers/figma.png"
			imageAlt=""
		/>
	);
};

export default FigmaLearnTeaser;
