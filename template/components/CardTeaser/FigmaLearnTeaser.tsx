import CardTeaser from './CardTeaser';

interface FigmaLearnTeaserProps {
	componentName: string;
}

const FigmaLearnTeaser = ({ componentName }: FigmaLearnTeaserProps) => {
	return (
		<CardTeaser
			title="Figma Learn"
			description={`Find Figma-specific workarounds and tips for using the ${componentName} component in your designs.`}
			url="/documentation/learn/figma"
			image="/assets/teasers/figma.png"
			imageAlt=""
		/>
	);
};

export default FigmaLearnTeaser;
