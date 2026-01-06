import { DBNavigationItem, DBNavigationItemGroup } from '@db-ux/react-core-components';
import { getAriaCurrent } from '@template/utils/client.utils.ts';
import { covers, getFirstChildPath } from '@template/utils/navigation.utils.ts';

const NavItem = ({
	path,
	title,
	icon,
	iconTrailing,
	children,
	isSubNavigation,
	disabled,
}: NavigationItem) => {
	// if sub-navigation node, do not render children here
	if (isSubNavigation) {
		const target = path ?? getFirstChildPath(children);
		const isActive =
			typeof window !== 'undefined' &&
			covers(
				{ path, title, icon, iconTrailing, children, isSubNavigation },
				window.location.pathname,
			);

		return (
			<DBNavigationItem
				icon={icon}
				key={`router-leaf-${target ?? title}`}
				disabled={disabled}
				aria-disabled={disabled ? 'true' : undefined}
			>
				<a
					href={target}
					aria-current={isActive ? 'page' : undefined}
					data-icon-trailing={iconTrailing}
				>
					{title}
				</a>
			</DBNavigationItem>
		);
	}

	// node with children
	if (children && children.length > 0) {
		return (
			<DBNavigationItemGroup
				text={title}
				key={`router-group-${path ?? title}`}
				aria-disabled={disabled ? 'true' : undefined}
			>
				{children.map((sub) => (
					<NavItem key={`router-sub-${sub.path ?? sub.title}`} {...sub} />
				))}
			</DBNavigationItemGroup>
		);
	}

	// leaf-node, no children
	return (
		<DBNavigationItem
			icon={icon}
			key={`router-leaf-${path ?? title}`}
			disabled={disabled}
			aria-disabled={disabled ? 'true' : undefined}
		>
			<a href={path} aria-current={getAriaCurrent(path)} data-icon-trailing={iconTrailing}>
				{title}
			</a>
		</DBNavigationItem>
	);
};

export default NavItem;
