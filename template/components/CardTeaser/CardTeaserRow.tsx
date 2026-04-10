import CardTeaser from './CardTeaser';
import './CardTeaserRow.css';

interface TeaserItem {
	title: string;
	description: string;
	url: string;
	image: string;
	imageAlt: string;
	label: string;
	external?: boolean;
}

const CardTeaserRow = ({ items }: { items: TeaserItem[] }) => {
	return (
		<div className="card-teaser-row">
			{items.map((item) => (
				<CardTeaser key={item.url} {...item} />
			))}
		</div>
	);
};

export default CardTeaserRow;
