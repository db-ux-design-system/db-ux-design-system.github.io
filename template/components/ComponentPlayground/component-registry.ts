import type { ComponentType } from 'react';
import {
	DBAccordion,
	DBBadge,
	DBButton,
	DBCard,
	DBCheckbox,
	DBDivider,
	DBInfotext,
	DBInput,
	DBLink,
	DBNavigation,
	DBNavigationItem,
	DBNotification,
	DBRadio,
	DBSection,
	DBSelect,
	DBStack,
	DBSwitch,
	DBTag,
	DBTextarea,
} from '@db-ux/react-core-components';

const componentRegistry: Record<string, ComponentType<any>> = {
	DBAccordion,
	DBBadge,
	DBButton,
	DBCard,
	DBCheckbox,
	DBDivider,
	DBInfotext,
	DBInput,
	DBLink,
	DBNavigation,
	DBNavigationItem,
	DBNotification,
	DBRadio,
	DBSection,
	DBSelect,
	DBStack,
	DBSwitch,
	DBTag,
	DBTextarea,
};

export function resolveComponent(name: string | undefined): ComponentType<any> | undefined {
	if (!name) return undefined;
	return componentRegistry[name];
}
