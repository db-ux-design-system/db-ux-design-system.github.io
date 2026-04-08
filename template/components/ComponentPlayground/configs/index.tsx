import type { PlaygroundConfig } from '../types';

export { accordionConfig } from './accordion.config';
export { backdropConfig } from './backdrop.config';
export { badgeConfig } from './badge.config';
export { buttonConfig } from './button.config';
export { cardConfig } from './card.config';
export { checkboxConfig } from './checkbox.config';
export { customSelectConfig } from './customSelect.config';
export { dividerConfig } from './divider.config';
export { drawerConfig } from './drawer.config';
export { infotextConfig } from './infotext.config';
export { inputConfig } from './input.config';
export { linkConfig } from './link.config';
export { notificationConfig } from './notification.config';
export { popoverConfig } from './popover.config';
export { radioConfig } from './radio.config';
export { selectConfig } from './select.config';
export { stackConfig } from './stack.config';
export { switchConfig } from './switch.config';
export { tagConfig } from './tag.config';
export { textareaConfig } from './textarea.config';
export { tooltipConfig } from './tooltip.config';

import { accordionConfig } from './accordion.config';
import { backdropConfig } from './backdrop.config';
import { badgeConfig } from './badge.config';
import { buttonConfig } from './button.config';
import { cardConfig } from './card.config';
import { checkboxConfig } from './checkbox.config';
import { customSelectConfig } from './customSelect.config';
import { dividerConfig } from './divider.config';
import { drawerConfig } from './drawer.config';
import { infotextConfig } from './infotext.config';
import { inputConfig } from './input.config';
import { linkConfig } from './link.config';
import { notificationConfig } from './notification.config';
import { popoverConfig } from './popover.config';
import { radioConfig } from './radio.config';
import { selectConfig } from './select.config';
import { stackConfig } from './stack.config';
import { switchConfig } from './switch.config';
import { tagConfig } from './tag.config';
import { textareaConfig } from './textarea.config';
import { tooltipConfig } from './tooltip.config';

export const configRegistry: Record<string, PlaygroundConfig<any>> = {
	accordion: accordionConfig,
	backdrop: backdropConfig,
	badge: badgeConfig,
	button: buttonConfig,
	card: cardConfig,
	checkbox: checkboxConfig,
	customSelect: customSelectConfig,
	divider: dividerConfig,
	drawer: drawerConfig,
	infotext: infotextConfig,
	input: inputConfig,
	link: linkConfig,
	notification: notificationConfig,
	popover: popoverConfig,
	radio: radioConfig,
	select: selectConfig,
	stack: stackConfig,
	switch: switchConfig,
	tag: tagConfig,
	textarea: textareaConfig,
	tooltip: tooltipConfig,
};

export function resolveConfig(component: string): PlaygroundConfig<any> | undefined {
	return configRegistry[component];
}
