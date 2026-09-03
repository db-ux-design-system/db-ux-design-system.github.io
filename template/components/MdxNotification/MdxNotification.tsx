import {
	DBNotification,
	DBLink,
	type DBNotificationProps
} from '@db-ux/react-core-components';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<
	Omit<DBNotificationProps, 'link'> & {
		linkHref?: string;
		linkText?: string;
	}
>;

const MdxNotification = ({
	linkHref,
	linkText,
	children,
	...notificationProps
}: Props) => (
	<DBNotification
		variant="standalone"
		{...notificationProps}
		link={
			linkHref && linkText ? (
				<DBLink href={linkHref}>{linkText}</DBLink>
			) : undefined
		}
	>
		{children}
	</DBNotification>
);

export default MdxNotification;
