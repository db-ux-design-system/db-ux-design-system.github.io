import { DBControlPanelMeta, DBLink, DBStack } from '@db-ux/react-core-components';

const DemoMetaNavigation = () => (
	<DBControlPanelMeta>
		<DBStack direction="row" justifyContent="space-between">
			<DBStack direction="row">
				<DBLink size="small" variant="inline" href="#">
					Privatreisen
				</DBLink>
				<DBLink size="small" variant="inline" href="#">
					Geschäftsreisen
				</DBLink>
			</DBStack>
			<DBStack direction="row">
				<DBLink size="small" variant="inline" href="#">
					Hilfe & Kontakt
				</DBLink>
				<DBLink size="small" variant="inline" href="#">
					Verkehrsmeldungen
				</DBLink>
				<DBLink size="small" variant="inline" href="#">
					Baustellen
				</DBLink>
				<DBLink size="small" variant="inline" href="#">
					Deutsch
				</DBLink>
			</DBStack>
		</DBStack>
	</DBControlPanelMeta>
);

export default DemoMetaNavigation;
