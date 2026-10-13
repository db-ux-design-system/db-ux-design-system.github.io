import { type ReactElement } from 'react';
import { DBNotification } from '@db-ux/react-core-components';
import {
	columns,
	NOTIFICATION_VARIANTS,
	SEMANTICS,
	type NotificationVariant,
	type OverviewLabels,
} from './_shared.tsx';

/*
 * One column per variant, each holding the six semantics below each other.
 *
 * Shown directly rather than through a trigger: a notification is content on the
 * page, not an overlay that has to be opened. The headline names the semantic and
 * the text names the variant, so every specimen says which cell of the matrix it
 * is.
 *
 * The icon is the component's own: five semantics bring one, `adaptive` does not,
 * and that difference is left as it is instead of being evened out with an
 * explicit `icon`.
 *
 * `closeable` is left out. The close button would be a control that closes
 * nothing on a page of specimens, which is worse than not showing it.
 *
 * `ariaLive` and `role` are left unset as well. They turn a notification into a
 * live region, which is right for one that arrives during use and wrong for
 * eighteen that are part of the page from the start.
 */
const NotificationCell = ({
	variant,
	labels,
}: {
	variant: NotificationVariant;
	labels: OverviewLabels;
}): ReactElement => (
	/*
	 * The specimens fill their column rather than their content: a notification is
	 * a block of content and takes the width it is given, so at content width the
	 * widest of them grew out of its column.
	 */
	<div className="overview-stack" data-align="stretch">
		{SEMANTICS.map((semantic) => (
			<DBNotification
				key={semantic}
				variant={variant}
				semantic={semantic}
				headline={labels.infotextSemantics[semantic]}
				/*
				 * Only the overlay variant carries a timestamp — it is the variant that
				 * arrives as a snackbar, where when it arrived is part of the message.
				 * The machine-readable duration goes with the visible text.
				 */
				timestamp={variant === 'overlay' ? labels.notificationTimestamp : undefined}
				timestampDatetime={variant === 'overlay' ? 'PT5M' : undefined}
			>
				{labels.notificationVariants[variant]}
			</DBNotification>
		))}
	</div>
);

export const NotificationOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => (
	<div className="overview-grid" style={columns(3)}>
		{NOTIFICATION_VARIANTS.map((variant) => (
			<NotificationCell key={variant} variant={variant} labels={labels} />
		))}
	</div>
);
