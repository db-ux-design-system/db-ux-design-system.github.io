import {
	DBBadge,
	DBControlPanelNavigationItem,
	DBControlPanelNavigationItemGroup,
} from '@db-ux/react-core-components';
import { getAriaCurrent } from '@template/utils/client.utils.ts';
import { covers, getFirstChildPath, trimExtension } from '@template/utils/navigation.utils.ts';
import { useLanguage } from '@template/context/language-context';
import { toDeSlug, toEnSlug } from '@template/i18n/slug-mapping';
import { useEffect, useRef } from 'react';

/** Navigates like a link: Cmd/Ctrl opens a new tab, otherwise the current tab. */
const navigateTo = (href: string, event: { metaKey?: boolean; ctrlKey?: boolean }) => {
	if (event.metaKey || event.ctrlKey) {
		window.open(href, '_blank', 'noopener');
		return;
	}
	window.location.assign(href);
};

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
	groupLink,
	parentStatus,
}: NavigationItem & { parentStatus?: string }) => {
	const { language } = useLanguage();
	const displayTitle = (language === 'de' && titleDe) ? titleDe : title;
	const localePath = (p: string | undefined) => {
		if (!p) return p;
		const trimmed = trimExtension(p) ?? p;
		return language === 'de' ? `/de/${toDeSlug(trimmed)}` : trimmed;
	};
	const lockIcon = isProtected ? (
		<span
			data-icon="lock_closed"
			aria-label={language === 'de' ? 'Geschützter Inhalt' : 'Protected content'}
			role="img"
			style={{ marginInlineStart: 'auto', fontSize: '0.75em' }}
		/>
	) : null;

	const groupHref = groupLink && children?.length ? localePath(path) : undefined;
	const groupRef = useRef<HTMLLIElement>(null);

	// The title next to the back button in an opened group is a plain <span> rendered
	// by DBControlPanelNavigationItemGroup. With `groupLink`, turn it into a link to the
	// group's own page: link role, keyboard focus, Enter to activate. The library
	// offers no slot for it, so this enhances the existing element instead of
	// replacing it, which keeps React's ownership of the node intact.
	// TODO: Move into core-web as an option of DBControlPanelNavigationItemGroup.
	useEffect(() => {
		const titleEl = groupRef.current?.querySelector<HTMLElement>(
			':scope > .db-control-panel-navigation-item-group-menu > .db-control-panel-navigation-item-group-back-button > span',
		);
		if (!groupHref || !titleEl) return;

		titleEl.setAttribute('role', 'link');
		titleEl.setAttribute('tabindex', '0');
		titleEl.dataset.groupLink = 'true';
		const current = getAriaCurrent(groupHref);
		if (current) titleEl.setAttribute('aria-current', current);

		const onClick = (event: MouseEvent) => {
			// Keep the click away from the menu handler that closes the mobile drawer.
			event.stopPropagation();
			navigateTo(groupHref, event);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Enter') return;
			event.preventDefault();
			event.stopPropagation();
			navigateTo(groupHref, event);
		};
		titleEl.addEventListener('click', onClick);
		titleEl.addEventListener('keydown', onKeyDown);

		return () => {
			titleEl.removeEventListener('click', onClick);
			titleEl.removeEventListener('keydown', onKeyDown);
			titleEl.removeAttribute('role');
			titleEl.removeAttribute('tabindex');
			titleEl.removeAttribute('aria-current');
			delete titleEl.dataset.groupLink;
		};
	}, [groupHref]);

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
			'/' + toEnSlug(window.location.pathname.replace(/^\/de\//, '').replace(/^\/de$/, '').replace(/\/+$/, '')),
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
		// The group header is a button that toggles the group. With `groupLink`, it
		// navigates to the group's own page instead; that page then renders the group
		// expanded because `isActive` covers it. On the page itself, the header keeps
		// its normal toggle behavior so the group can still be collapsed.
		// DBControlPanelNavigationItemGroup also passes `onClick` on to its <li>, so
		// clicks on links inside the group bubble up to this handler. Only react to
		// clicks on this group's own header button.
		const handleGroupClick =
			groupHref && !getAriaCurrent(groupHref)
				? (event: { target: EventTarget | null; metaKey?: boolean; ctrlKey?: boolean }) => {
						const ownButton = groupRef.current?.querySelector(
							':scope > .db-control-panel-navigation-item-group-expand-button',
						);
						if (!ownButton || !(event.target instanceof Node) || !ownButton.contains(event.target)) {
							return;
						}
						navigateTo(groupHref, event);
					}
				: undefined;

		return (
			<DBControlPanelNavigationItemGroup
				ref={groupRef}
				text={displayTitle}
				endSlot={getStatusBadge(status)}
				key={`router-group-${path ?? title}`}
				aria-disabled={disabled ? 'true' : undefined}
				expanded={isActive}
				onClick={handleGroupClick}
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
