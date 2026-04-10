import { DBNotification } from '@db-ux/react-core-components';

const statusConfig = {
	stable: {
		semantic: 'successful' as const,
		headline: 'Stable',
		short: 'Mature, accessible, and mandatory as UX standard.',
		long: 'In the Stable phase, content is considered mature and reliable (accessible, Design System & brand compliant, etc.) and is mandatory to use as a UX standard. We update and improve it regularly to ensure it meets user needs and current standards.',
	},
	beta: {
		semantic: 'informational' as const,
		headline: 'Beta',
		short: 'Functional and usable, but may still change.',
		long: 'In the Beta phase, content is actively tested and optimized. It is functional and can already be used in production, but may still change. Feedback is explicitly welcome to further improve quality.',
	},
	concept: {
		semantic: 'warning' as const,
		headline: 'Concept',
		short: 'Early development, not intended for production use.',
		long: 'In the Concept phase, content is in early development. It serves as a draft and basis for discussion and is not yet intended for production use. Changes are possible at any time.',
	},
	legacy: {
		semantic: 'critical' as const,
		headline: 'Legacy',
		short: 'No longer actively developed, migration recommended.',
		long: 'Legacy content is no longer actively developed but remains available. It is recommended to migrate to the current version to benefit from improvements and bug fixes.',
	},
	deprecated: {
		semantic: 'neutral' as const,
		headline: 'Deprecated',
		short: 'Will be removed, please migrate to the alternative soon.',
		long: 'Deprecated content will be removed in a future version. Please migrate to the recommended alternative promptly to avoid compatibility issues.',
	},
};

type StatusType = keyof typeof statusConfig;

const StatusNotification = ({
	status,
	variant = 'short',
	showLink = true,
}: {
	status: StatusType;
	variant?: 'short' | 'long';
	showLink?: boolean;
}) => {
	const config = statusConfig[status];
	return (
		<DBNotification
			semantic={config.semantic}
			headline={config.headline}
			variant="standalone"
			linkVariant={showLink ? 'block' : undefined}
			link={showLink ? <a href="/documentation/releases/content-status">Learn more</a> : undefined}
		>
			{variant === 'short' ? config.short : config.long}
		</DBNotification>
	);
};

export default StatusNotification;
