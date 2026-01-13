import { DBNotification } from '@db-ux/react-core-components';

const ComponentLifecycleNotification = ({ state }: { state: 'stable' | 'beta' }) => {
	return (
		<DBNotification
			semantic={state === 'stable' ? 'successful' : 'informational'}
			headline={state === 'stable' ? 'Stable' : 'Beta'}
			link={<a href="/TODO">Mehr erfahren</a>}
		>
			{state === 'stable'
				? 'In der Stable-Phase gelten die Inhalte als ausgereift und zuverlässig (Barrierefrei, Design System- & Markenkonform, etc.) und sind als UX Standard verpflichtend zu nutzen. Wir aktualisieren und verbessern sie regelmäßig, um sicherzustellen, dass sie den Bedürfnissen unserer Nutzer entsprechen und den aktuellen Standards entsprechen.'
				: 'In der Beta-Phase sind die Inhalte bereits funktionsfähig und weitgehend stabil, jedoch können noch einige kleinere Änderungen (visuell & funktional) vorgenommen werden.'}
		</DBNotification>
	);
};

export default ComponentLifecycleNotification;
