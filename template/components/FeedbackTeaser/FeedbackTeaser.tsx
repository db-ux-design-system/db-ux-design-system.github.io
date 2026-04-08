import { DBCard, DBSection, DBStack } from '@db-ux/react-core-components';

interface Release {
	title: string;
	description: string;
	url: string;
}

const FeedbackTeaser = ({ releases }: { releases?: Release[] }) => {
	return (
		<DBSection spacing="small" width="full">
			<DBStack direction="row" gap="medium">
				{releases?.map((release) => (
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
									<h5 style={{ marginBlockStart: 0 }}>{release.title}</h5>
									{release.description}
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
				<a
					href="https://github.com/db-ux-design-system/core/issues/new"
					target="_blank"
					rel="noopener noreferrer"
					style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}
				>
					<DBCard spacing="medium" style={{ flex: 1 }}>
						<div
							style={{ display: 'flex', alignItems: 'center', gap: 'var(--db-spacing-fixed-md)' }}
						>
							<div style={{ flex: 1 }}>
								<h5 style={{ marginBlockStart: 0 }}>Feedback Welcome</h5>
								<p>Let us know if you encounter unexpected issues or need support.</p>
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
			</DBStack>
		</DBSection>
	);
};

export default FeedbackTeaser;
