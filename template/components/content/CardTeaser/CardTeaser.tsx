import { DBCard } from '@db-ux/react-core-components';
import './CardTeaser.css';

export interface CardTeaserProps {
	title: string;
	description: string;
	url: string;
	image: string;
	imageAlt: string;
	label: string;
	external?: boolean;
	protected?: boolean;
}

const CardTeaser = ({
	title,
	description,
	url,
	image,
	imageAlt,
	label,
	external = false,
	protected: isProtected = false,
}: CardTeaserProps) => {
	return (
		<a
			href={url}
			{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
			className="card-teaser"
		>
			<DBCard behavior="interactive" spacing="medium">
				{isProtected && (
					<span
						className="card-teaser-protected-icon"
						data-icon="lock_closed"
						aria-label="Protected content"
						role="img"
					/>
				)}
				<div className="card-teaser-content">
					<div className="card-teaser-body">
						<strong className="card-teaser-title">{title}</strong>
						<span className="card-teaser-description">{description}</span>
						<strong
							className="card-teaser-label"
							data-icon-trailing={external ? 'arrow_up_right' : 'arrow_right'}
						>
							{label}
						</strong>
					</div>
					<img src={image} alt={imageAlt} className="card-teaser-image" loading="lazy" />
				</div>
			</DBCard>
		</a>
	);
};

export default CardTeaser;
