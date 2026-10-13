import { useState, type ReactElement } from 'react';
import {
	DBButton,
	DBDialog,
	DBDialogFooter,
	DBDialogHeader,
} from '@db-ux/react-core-components';
import { type OverviewLabels } from './_shared.tsx';

/*
 * The dialog is shown through its trigger and opens with its real behavior, so
 * the overlay, the focus handling and Escape are the component's own.
 *
 * `open` is held here rather than on the page, and `onClose` mirrors the dialog
 * closing itself back into that state — the dialog can be dismissed with Escape
 * or its own close button, which never pass through the trigger.
 */
export const DialogOverview = ({ labels }: { labels: OverviewLabels }): ReactElement => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<DBButton type="button" variant="filled" onClick={() => setOpen(true)}>
				{labels.openDialog}
			</DBButton>
			<DBDialog
				open={open}
				onClose={() => setOpen(false)}
				header={<DBDialogHeader closeButtonText={labels.close} text={labels.dialogTitle} />}
				footer={
					<DBDialogFooter>
						<DBButton type="button" variant="ghost" onClick={() => setOpen(false)}>
							{labels.cancel}
						</DBButton>
						<DBButton type="button" variant="brand" onClick={() => setOpen(false)}>
							{labels.confirm}
						</DBButton>
					</DBDialogFooter>
				}
			>
				{labels.dialogText}
			</DBDialog>
		</>
	);
};
