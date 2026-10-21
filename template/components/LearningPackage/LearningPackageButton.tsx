import { useId, useRef } from 'react';
import { DBButton, DBPopover } from '@db-ux/react-core-components';
import { navigate } from 'astro:transitions/client';
import { useLanguage } from '@template/context/language-context';
import {
	type PackagePage,
	packagePages,
	wizardHref,
} from '@template/components/GetStartedWizard/wizard-flow';
import LearningPackageList from './LearningPackageList';
import { clearPackage, setViewed, useLearningPackage } from './learning-package-store';
import { learningPackageTexts } from './texts';

/**
 * Secondary action in the control panel: opens the saved learning package from the
 * Get Started wizard on every page. Renders nothing while no package is saved.
 *
 * The popover opens and closes like the language switch: uncontrolled DBPopover,
 * open while the pointer is over it or the focus is inside. Escape is handled by the
 * library: it only closes the popover while the trigger has focus, and the focus then
 * moves to the page body. Escape from a control inside the popover does nothing.
 */
const LearningPackageButton = ({ size }: { size?: 'small' }) => {
	const { language: lang } = useLanguage();
	const text = learningPackageTexts[lang];
	const pkg = useLearningPackage();
	const wrapperRef = useRef<HTMLDivElement>(null);
	// The desktop and the mobile control panel both render this button, so the ids
	// need to be unique per instance.
	const idPrefix = `lp-popover${useId().replace(/[^\w-]/g, '')}`;

	// Labels come from the catalog; ids that no longer exist are skipped.
	const items = (pkg?.items ?? [])
		.map((item) => packagePages[item.id])
		.filter((item): item is PackagePage => Boolean(item));
	if (!pkg || items.length === 0) return null;

	const viewed = items.filter((item) => pkg.viewed.includes(item.id)).length;
	const total = items.length;

	const remove = () => {
		// The button disappears, so the focus moves to the next control instead of
		// getting lost: the color mode switch on desktop, the burger button on mobile.
		const wrapper = wrapperRef.current;
		const nextControl =
			wrapper?.nextElementSibling?.querySelector<HTMLElement>('input, button, a') ??
			wrapper
				?.closest('.db-control-panel-mobile')
				?.querySelector<HTMLElement>('.db-control-panel-mobile-button');
		clearPackage();
		requestAnimationFrame(() => nextControl?.focus());
	};

	return (
		<div className="lp-control" ref={wrapperRef}>
			<DBPopover
				className="lp-popover"
				placement="bottom-end"
				spacing="medium"
				width="fixed"
				trigger={
					<DBButton
						type="button"
						variant="ghost"
						size={size}
						icon="light_bulb"
						aria-label={text.triggerLabel(viewed, total)}
					>
						{viewed}/{total}
					</DBButton>
				}
			>
				<div role="group" aria-labelledby={`${idPrefix}-title`} className="lp-popover-body">
					<p id={`${idPrefix}-title`} className="lp-popover-title">
						{text.title}
					</p>
					<p className="lp-progress">{text.progress(viewed, total)}</p>
					<LearningPackageList
						lang={lang}
						items={items}
						viewed={pkg.viewed}
						onToggle={setViewed}
						idPrefix={idPrefix}
					/>
					<div className="lp-popover-actions">
						<DBButton
							type="button"
							variant="filled"
							size="small"
							icon="circular_arrows"
							onClick={() => {
								// Client-side navigation through the ClientRouter, like a link.
								void navigate(wizardHref(lang));
							}}
						>
							{text.restart}
						</DBButton>
						<DBButton type="button" variant="ghost" size="small" icon="bin" onClick={remove}>
							{text.remove}
						</DBButton>
					</div>
				</div>
			</DBPopover>
		</div>
	);
};

export default LearningPackageButton;
