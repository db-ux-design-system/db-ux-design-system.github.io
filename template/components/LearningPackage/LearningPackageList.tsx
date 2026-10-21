import { DBCheckbox } from '@db-ux/react-core-components';
import {
	type Lang,
	type PackagePage,
	toHref,
} from '@template/components/GetStartedWizard/wizard-flow';
import { learningPackageTexts } from './texts';

type Props = {
	lang: Lang;
	items: PackagePage[];
	viewed: string[];
	onToggle: (id: string, viewed: boolean) => void;
	/** Prefix for the checkbox ids, unique per list on the page. */
	idPrefix: string;
};

const slug = (id: string) => id.replace(/[/#]/g, '-');

/**
 * The pages of a learning package in order, as used in the popover of the control
 * panel. Each row is a link to the page, stretched over the whole row, with a
 * "Viewed" checkbox next to it. The checkbox is a sibling of the link, not inside it,
 * and sits above the stretched link area, so it stays operable on its own.
 * Styles: LearningPackage.css, loaded globally.
 */
const LearningPackageList = ({ lang, items, viewed, onToggle, idPrefix }: Props) => {
	const text = learningPackageTexts[lang];
	return (
		<ol className="lp-list">
			{items.map((item) => {
				const id = `${idPrefix}-${slug(item.id)}`;
				return (
					<li key={item.id} className="lp-item">
						<a className="lp-item-link" href={toHref(item, lang)}>
							{item.label[lang]}
						</a>
						{/* No visible label: the progress above the list names the column.
						    The hidden label names the page, so each checkbox has a unique
						    accessible name. */}
						<DBCheckbox
							className="lp-item-check"
							id={id}
							name={id}
							showLabel={false}
							label={text.viewedLabel(item.label[lang])}
							checked={viewed.includes(item.id)}
							onChange={(event) => onToggle(item.id, event.target.checked)}
						/>
					</li>
				);
			})}
		</ol>
	);
};

export default LearningPackageList;
