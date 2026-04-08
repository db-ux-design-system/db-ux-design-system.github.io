import { DBCard, DBStack } from '@db-ux/react-core-components';

interface Release {
	title: string;
	description: string;
	url: string;
}

const ReleaseTeaser = ({ releases }: { releases: Release[] }) => {
	return (
		<DBStack direction="row" gap="medium">
			{releases.map((release) => (
				<a
					key={release.url}
					href={release.url}
					target="_blank"
					rel="noopener noreferrer"
					style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}
				>
					<DBCard behavior="interactive" spacing="medium" style={{ height: '100%' }}>
						<div
							style={{ display: 'flex', alignItems: 'center', gap: 'var(--db-spacing-fixed-md)' }}
						>
							<div style={{ flex: 1 }}>
								<strong style={{ display: 'block', marginBlockEnd: 'var(--db-spacing-fixed-xs)' }}>
									{release.title}
								</strong>
								<span style={{ color: 'var(--db-adaptive-on-bg-basic-emphasis-70-default)' }}>
									{release.description}
								</span>
							</div>
							<img
								src="/assets/migration-guides/Github-Teaser.png"
								alt="GitHub"
								style={{ blockSize: '80px', objectFit: 'contain', opacity: 0.8 }}
								loading="lazy"
							/>
						</div>
					</DBCard>
				</a>
			))}
		</DBStack>
	);
};

export default ReleaseTeaser;
