import { DBButton, DBTooltip } from '@db-ux/react-core-components';
import './TooltipExample.css';

export default function TooltipExample({ text = 'Tooltip text', placement = 'top', animation = true, showArrow = true, emphasis = 'strong', width = 'auto' }) {
	return (
		<div className="tooltip-example-wrapper">
			<DBButton variant="primary">
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
