import CardTeaser, { type CardTeaserProps } from './CardTeaser';
import './CardTeaserRow.css';

const CardTeaserRow = ({ items }: { items: CardTeaserProps[] }) => {
	return (
		<div className="card-teaser-row">
			{items.map((item) => (
				<CardTeaser key={item.url} {...item} />
			))}
		</div>
	);
};

export default CardTeaserRow;
