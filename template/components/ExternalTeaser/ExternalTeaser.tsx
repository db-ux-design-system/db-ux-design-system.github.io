import { DBCard } from '@db-ux/react-core-components';

interface ExternalTeaserProps {
	title: string;
	description: string;
	url: string;
	image: string;
	imageAlt: string;
	label: string;
}

const ExternalTeaser = ({
	title,
	description,
	url,
	image,
	imageAlt,
	label,
}: ExternalTeaserProps) => {
	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}
		>
			<DBCard behavior="interactive" spacing="medium" style={{ height: '100%' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--db-spacing-fixed-md)' }}>
					<div style={{ flex: 1 }}>
						<strong style={{ display: 'block', marginBlockEnd: 'var(--db-spacing-fixed-xs)' }}>
							{title}
						</strong>
						<span style={{ color: 'var(--db-adaptive-on-bg-basic-emphasis-70-default)' }}>
							{description}
						</span>
						<strong
							data-icon-trailing="arrow_up_right"
							style={{ display: 'block', marginBlockStart: 'var(--db-spacing-fixed-sm)' }}
						>
							{label}
						</strong>
					</div>
					<img
						src={image}
						alt={imageAlt}
						style={{ blockSize: '80px', objectFit: 'contain', opacity: 0.8 }}
						loading="lazy"
					/>
				</div>
			</DBCard>
		</a>
	);
};

export default ExternalTeaser;
