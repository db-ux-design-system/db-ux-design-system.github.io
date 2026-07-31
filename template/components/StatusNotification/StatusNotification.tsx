import { DBNotification } from '@db-ux/react-core-components';
import { useLanguage } from '@template/context/language-context';

const statusConfig = {
	stable: {
		semantic: 'successful' as const,
		headline: 'Stable',
		short: {
			en: 'Mature, accessible, and mandatory as UX standard.',
			de: 'Ausgereift, barrierefrei und verbindlich als UX-Standard.',
		},
		long: {
			en: 'In the Stable phase, content is considered mature and reliable (accessible, Design System & brand compliant, etc.) and is mandatory to use as a UX standard. We update and improve it regularly to ensure it meets user needs and current standards.',
			de: 'In der Stable-Phase gelten Inhalte als ausgereift und zuverlässig (barrierefrei, Design-System- und markenkonform etc.) und sind als UX-Standard verbindlich. Wir aktualisieren und verbessern sie regelmäßig, um sicherzustellen, dass sie den Anforderungen und aktuellen Standards entsprechen.',
		},
	},
	beta: {
		semantic: 'informational' as const,
		headline: 'Beta',
		short: {
			en: 'Functional and usable, but may still change.',
			de: 'Funktional und nutzbar, kann sich aber noch ändern.',
		},
		long: {
			en: 'In the Beta phase, content is actively tested and optimized. It is functional and can already be used in production, but may still change. Feedback is explicitly welcome to further improve quality.',
			de: 'In der Beta-Phase werden Inhalte aktiv getestet und optimiert. Sie sind funktional und können bereits produktiv genutzt werden, können sich aber noch ändern. Feedback ist ausdrücklich willkommen, um die Qualität weiter zu verbessern.',
		},
	},
	concept: {
		semantic: 'warning' as const,
		headline: 'Concept',
		short: {
			en: 'Early development, not intended for production use.',
			de: 'Frühe Entwicklung, nicht für den Produktiveinsatz vorgesehen.',
		},
		long: {
			en: 'In the Concept phase, content is in early development. It serves as a draft and basis for discussion and is not yet intended for production use. Changes are possible at any time.',
			de: 'In der Concept-Phase befinden sich Inhalte in der frühen Entwicklung. Sie dienen als Entwurf und Diskussionsgrundlage und sind noch nicht für den Produktiveinsatz vorgesehen. Änderungen sind jederzeit möglich.',
		},
	},
	legacy: {
		semantic: 'critical' as const,
		headline: 'Legacy',
		short: {
			en: 'No longer actively developed, migration recommended.',
			de: 'Wird nicht mehr aktiv weiterentwickelt, Migration empfohlen.',
		},
		long: {
			en: 'Legacy content is no longer actively developed but remains available. It is recommended to migrate to the current version to benefit from improvements and bug fixes.',
			de: 'Legacy-Inhalte werden nicht mehr aktiv weiterentwickelt, bleiben aber verfügbar. Eine Migration auf die aktuelle Version wird empfohlen, um von Verbesserungen und Bugfixes zu profitieren.',
		},
	},
	deprecated: {
		semantic: 'neutral' as const,
		headline: 'Deprecated',
		short: {
			en: 'Will be removed, please migrate to the alternative soon.',
			de: 'Wird in einer zukünftigen Version entfernt, bitte zeitnah zur Alternative migrieren.',
		},
		long: {
			en: 'Deprecated content will be removed in a future version. Please migrate to the recommended alternative promptly to avoid compatibility issues.',
			de: 'Deprecated-Inhalte werden in einer zukünftigen Version entfernt. Bitte zeitnah zur empfohlenen Alternative migrieren, um Kompatibilitätsprobleme zu vermeiden.',
		},
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
	const { language } = useLanguage();
	const config = statusConfig[status];
	const text = variant === 'short' ? config.short[language] : config.long[language];
	const linkHref =
		language === 'de'
			? '/de/dokumentation/releases/content-status'
			: '/documentation/releases/content-status';
	const linkText = language === 'de' ? 'Mehr erfahren' : 'Learn more';

	return (
		<DBNotification
			semantic={config.semantic}
			headline={config.headline}
			variant="standalone"
			linkVariant={showLink ? 'block' : undefined}
			link={showLink ? <a href={linkHref}>{linkText}</a> : undefined}
		>
			{text}
		</DBNotification>
	);
};

export default StatusNotification;
