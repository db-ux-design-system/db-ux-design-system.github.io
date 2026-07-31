import CardTeaser from './CardTeaser';
import { useLanguage } from '@template/context/language-context';

interface FigmaLearnTeaserProps {
	componentName: string;
}

const FigmaLearnTeaser = ({ componentName }: FigmaLearnTeaserProps) => {
	const { language } = useLanguage();
	const isDE = language === 'de';

	return (
		<CardTeaser
			title="Figma Learn"
			description={
				isDE
					? `Figma-spezifische Workarounds und Tipps zur Verwendung der ${componentName}-Komponente in deinen Designs.`
					: `Find Figma-specific workarounds and tips for using the ${componentName} component in your designs.`
			}
			url={isDE ? '/de/dokumentation/lernen/figma' : '/documentation/learn/figma'}
			image="/assets/teasers/figma.png"
			imageAlt=""
		/>
	);
};

export default FigmaLearnTeaser;
