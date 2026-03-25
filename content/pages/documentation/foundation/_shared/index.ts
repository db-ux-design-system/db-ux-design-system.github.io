export const handleTableCopy = (styles: CSSStyleDeclaration) => {
	document.querySelectorAll('.token-table tr[data-token]').forEach(function (row) {
		const token = row.getAttribute('data-token');
		const raw = styles.getPropertyValue('--' + token).trim();
		const valueCell = row.querySelector('.token-value');
		if (valueCell && raw) {
			const remVal = parseFloat(raw);
			const pxVal = Math.round(remVal * 16);
			valueCell.textContent = raw + ' (' + pxVal + 'px)';
		}

		row.addEventListener('click', function () {
			const button = row!.querySelector('button');
			if (button) {
				button.style.setProperty('--db-icon-trailing', '"check"');
				setTimeout(function () {
					button.style.setProperty('--db-icon-trailing', '"copy"');
				}, 2000);
			}
			void navigator.clipboard.writeText('var(--' + token + ')');
		});
	});
};

export const handleSimplePlaygrounds = ({
	dataAttributeName,
	tokenPrefix,
	popoverLabel,
	remPx,
	withDensity,
	isColor,
}: {
	dataAttributeName: string;
	tokenPrefix: string;
	popoverLabel: string;
	remPx?: boolean;
	withDensity?: boolean;
	isColor?: boolean;
}): boolean => {
	const select: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>(
		`[id="select"]`,
	) as HTMLSelectElement | null;
	const box = document.getElementById(`box`);
	const popover = document.querySelector('.db-popover-content');
	const styles = getComputedStyle(document.documentElement);

	if (!select || !box || !popover || !styles) return false;

	let densitySelect: HTMLSelectElement | null;
	if (withDensity) {
		densitySelect = document.querySelector<HTMLSelectElement>(`[id="density-select"]`);

		if (!densitySelect) return false;
	}

	const createParagraph = (text: string): HTMLParagraphElement => {
		const p = document.createElement('p');
		p.textContent = text;
		return p;
	};

	const handleChange = async () => {
		box.setAttribute(`data-${dataAttributeName}`, select.value);

		popover!.textContent = '';

		if (isColor) {
			// Wait for transition to settle for color values
			await new Promise((resolve) => setTimeout(resolve, 500));
			const computedStyles = getComputedStyle(box.querySelector('.db-card')!);
			popover!.appendChild(
				createParagraph(
					`Background Color: --db-${select.value}-bg-basic-level-1-default (${computedStyles.backgroundColor})`,
				),
			);
			popover!.appendChild(
				createParagraph(
					`Color: --db-${select.value}-on-bg-basic-emphasis-100-default (${computedStyles.color})`,
				),
			);
			popover!.appendChild(
				createParagraph(
					`Border Color: --db-${select.value}-on-bg-basic-emphasis-60-default (${computedStyles.borderColor})`,
				),
			);
		} else {
			const token = `--db-${dataAttributeName}-${select.value}`;
			// Read token value directly from CSS custom property to avoid transition mid-values
			const tokenValue = styles.getPropertyValue(token).trim();
			if (remPx) {
				const remVal = parseFloat(tokenValue);
				const remDisplay = remVal === 1 ? remVal : remVal.toFixed(2);
				const pxVal = Math.round(remVal * 16);
				popover!.appendChild(
					createParagraph(`${popoverLabel}: ${token} (${remDisplay}rem / ${pxVal}px)`),
				);
			} else {
				popover!.appendChild(createParagraph(`${popoverLabel}: ${token} (${tokenValue})`));
			}
		}
	};

	void handleChange();
	select.addEventListener('change', handleChange);

	if (withDensity) {
		const handleDensityChange = () => {
			box.setAttribute('data-density', densitySelect!.value);
			void handleChange();
		};

		void handleDensityChange();
		densitySelect!.addEventListener('change', handleDensityChange);
	}

	handleTableCopy(styles);

	return true;
};
