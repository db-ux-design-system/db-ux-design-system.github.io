import { DBButton, DBTooltip } from '@db-ux/react-core-components';
import './TooltipExample.css';

type TooltipPlacement =
	| 'left'
	| 'top'
	| 'bottom'
	| 'right'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end';
type TooltipEmphasis = 'strong' | 'weak';
type TooltipWidth = 'fixed' | 'auto';

export default function TooltipExample({
	text = 'Tooltip text',
	placement = 'top' as TooltipPlacement,
	animation = true,
	showArrow = true,
	emphasis = 'strong' as TooltipEmphasis,
	width = 'auto' as TooltipWidth,
}) {
	return (
		<div className="tooltip-example-wrapper">
			<DBButton variant="primary" type="button">
				<DBTooltip
					placement={placement}
					animation={animation}
					showArrow={showArrow}
					emphasis={emphasis}
					width={width}
				>
					{text}
				</DBTooltip>
				Hover me
			</DBButton>
		</div>
	);
}
