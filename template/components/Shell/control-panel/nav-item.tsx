import { DBBadge, DBNavigationItem, DBNavigationItemGroup } from '@db-ux/react-core-components';
import { getAriaCurrent } from '@template/utils/client.utils.ts';
import { covers, getFirstChildPath, trimExtension } from '@template/utils/navigation.utils.ts';

const getStatusBadge = (status?: string) => {
	if (!status || status === 'stable') return null;
	
	const config = {
		concept: { semantic: 'warning', label: 'Concept' },
		beta: { semantic: 'informative', label: 'Beta' },
		deprecated: { semantic: 'critical', label: 'Deprecated' },
		legacy: { semantic: 'warning', label: 'Legacy' },
	}[status];

	if (!config) return null;

	return (
		<DBBadge semantic={config.semantic as any} size="small" style={{ marginLeft: 'auto' }}>
			{config.label}
		</DBBadge>
	);
};

const NavItem = ({
	path,
	title,
	icon,
	iconTrailing,
	children,
	isSubNavigation,
	disabled,
	status,
}: NavigationItem) => {
	const isActive =
		typeof window !== 'undefined' &&
		covers(
			{ path, title, icon, iconTrailing, children, isSubNavigation },
			window.location.pathname,
		);
	if (isSubNavigation) {
		const target = path ?? getFirstChildPath(children);

		return (
			<DBNavigationItem
				icon={icon}
				key={`router-leaf-${target ?? title}`}
				disabled={disabled}
			>
				<a
					href={trimExtension(target)}
					aria-current={isActive ? 'page' : undefined}
					style={{ display: 'flex', alignItems: 'center', width: '100%' }}
				>
					{title}
					{getStatusBadge(status)}
				</a>
			</DBNavigationItem>
		);
	}

	if (children && children.length > 0) {
		return (
			<DBNavigationItemGroup
				text={title}
				key={`router-group-${path ?? title}`}
				aria-disabled={disabled ? 'true' : undefined}
				expanded={isActive}
			>
				{children.map((sub) => (
					<NavItem key={`router-sub-${sub.path ?? sub.title}`} {...sub} />
				))}
			</DBNavigationItemGroup>
		);
	}

	return (
		<DBNavigationItem
			icon={icon}
			key={`router-leaf-${path ?? title}`}
			disabled={disabled}
		>
			<a
				href={trimExtension(path)}
				aria-current={getAriaCurrent(trimExtension(path))}
				style={{ display: 'flex', alignItems: 'center', width: '100%' }}
			>
				{title}
				{getStatusBadge(status)}
			</a>
		</DBNavigationItem>
	);
};

export default NavItem;
