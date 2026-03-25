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
	computedStyle,
	popoverLabel,
	remPx,
	withDensity,
	isColor,
}: {
	dataAttributeName: string;
	computedStyle: string;
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

		await new Promise((resolve) => setTimeout(resolve, 500));

		popover!.textContent = '';

		if (isColor) {
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
			const computed = (getComputedStyle(box!) as any)[computedStyle];
			if (remPx) {
				const rem = parseFloat(computed) / 16;
				const radiusRem = rem === 1 ? rem : rem.toFixed(2);
				const radiusPx = Math.round(parseFloat(computed));
				popover!.appendChild(
					createParagraph(`${popoverLabel}: ${token} (${radiusRem}rem / ${radiusPx}px)`),
				);
			} else {
				popover!.appendChild(createParagraph(`${popoverLabel}: ${token} (${computed})`));
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
