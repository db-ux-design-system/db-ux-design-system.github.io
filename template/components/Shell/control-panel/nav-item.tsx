import {
	DBBadge,
	DBControlPanelNavigationItem,
	DBControlPanelNavigationItemGroup,
} from '@db-ux/react-core-components';
import { getAriaCurrent } from '@template/utils/client.utils.ts';
import { covers, getFirstChildPath, trimExtension } from '@template/utils/navigation.utils.ts';
import { useLanguage } from '@template/context/language-context';
import { toDeSlug, toEnSlug } from '@template/i18n/slug-mapping';

const getStatusBadge = (status?: string) => {
	if (!status || status === 'stable') return null;

	const config = {
		concept: { semantic: 'warning', label: 'Concept' },
		beta: { semantic: 'informational', label: 'Beta' },
		deprecated: { semantic: 'critical', label: 'Deprecated' },
		legacy: { semantic: 'warning', label: 'Legacy' },
		sub: { semantic: 'neutral', label: 'Sub' },
	}[status];

	if (!config) return null;

	return (
		<DBBadge semantic={config.semantic as any} size="small" style={{ marginInlineStart: 'auto' }}>
			{config.label}
		</DBBadge>
	);
};

const NavItem = ({
	path,
	title,
	titleDe,
	icon,
	iconTrailing,
	children,
	isSubNavigation,
	disabled,
	status,
	externalUrl,
	protected: isProtected,
	parentStatus,
}: NavigationItem & { parentStatus?: string }) => {
	const { language } = useLanguage();
	const displayTitle = (language === 'de' && titleDe) ? titleDe : title;
	const localePath = (p: string | undefined) => {
		if (!p) return p;
		const trimmed = trimExtension(p);
		return language === 'de' ? `/de/${toDeSlug(trimmed)}` : trimmed;
	};
	const lockIcon = isProtected ? (
		<span
			data-icon="lock_closed"
			aria-label="Protected content"
			role="img"
			style={{ marginInlineStart: 'auto', fontSize: '0.75em' }}
		/>
	) : null;

	if (externalUrl) {
		return (
			<DBControlPanelNavigationItem
				icon={icon}
				key={`router-leaf-${externalUrl}`}
				disabled={disabled ? true : undefined}
			>
				<a
					href={externalUrl}
					target="_blank"
					rel="noopener noreferrer"
					style={{ display: 'flex', alignItems: 'center', width: '100%' }}
				>
					{displayTitle}
					{lockIcon}
				</a>
			</DBControlPanelNavigationItem>
		);
	}

	const isActive =
		typeof window !== 'undefined' &&
		covers(
			{ path, title, icon, iconTrailing, children, isSubNavigation },
			toEnSlug(window.location.pathname.replace(/^\/de\//, '').replace(/^\/de$/, '')),
		);

	if (isSubNavigation) {
		const target = path ?? getFirstChildPath(children);

		return (
			<DBControlPanelNavigationItem
				icon={icon}
				key={`router-leaf-${target ?? title}`}
				disabled={disabled}
			>
				<a
					href={localePath(target)}
					aria-current={isActive ? 'page' : undefined}
					style={{ display: 'flex', alignItems: 'center', width: '100%' }}
				>
					{displayTitle}
					{lockIcon || getStatusBadge(status)}
				</a>
			</DBControlPanelNavigationItem>
		);
	}

	if (children && children.length > 0) {
		return (
			<DBControlPanelNavigationItemGroup
				text={displayTitle}
				endSlot={getStatusBadge(status)}
				key={`router-group-${path ?? title}`}
				aria-disabled={disabled ? 'true' : undefined}
				expanded={isActive}
			>
				{children.map((sub) => (
					<NavItem key={`router-sub-${sub.path ?? sub.title}`} {...sub} parentStatus={status} />
				))}
			</DBControlPanelNavigationItemGroup>
		);
	}

	// For leaf items inside a group: only show badge if it differs from parent
	const effectiveStatus = parentStatus && status === parentStatus ? undefined : status;

	return (
		<DBControlPanelNavigationItem
			icon={icon}
			key={`router-leaf-${path ?? title}`}
			disabled={disabled ? true : undefined}
		>
			<a
				href={localePath(path)}
				aria-current={getAriaCurrent(localePath(path))}
				style={{ display: 'flex', alignItems: 'center', width: '100%' }}
			>
				{displayTitle}
				{lockIcon || getStatusBadge(effectiveStatus)}
			</a>
		</DBControlPanelNavigationItem>
	);
};

export default NavItem;
