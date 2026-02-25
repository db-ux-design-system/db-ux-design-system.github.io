import { DBControlPanelMetaNavigation, DBLink, DBStack } from '@db-ux/react-core-components';

const DemoMetaNavigation = () => (
	<DBControlPanelMetaNavigation>
		<DBStack direction="row" justifyContent="space-between">
			<DBStack direction="row">
				<DBLink size="small" variant="inline" href="#" icon="help">
					Privatreisen
				</DBLink>
				<DBLink size="small" variant="inline" href="#" icon="warning">
					Geschäftsreisen
				</DBLink>
			</DBStack>
			<DBStack direction="row">
				<DBLink size="small" variant="inline" href="#" icon="help">
					Hilfe & Kontakt
				</DBLink>
				<DBLink size="small" variant="inline" href="#" icon="warning">
					Verkehrsmeldungen
				</DBLink>
				<DBLink size="small" variant="inline" href="#" icon="construction">
					Baustellen
				</DBLink>
				<DBLink size="small" variant="inline" href="#" icon="language">
					Deutsch
				</DBLink>
			</DBStack>
		</DBStack>
	</DBControlPanelMetaNavigation>
);

export default DemoMetaNavigation;
