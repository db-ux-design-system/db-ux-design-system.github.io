import { DBStack } from '@db-ux/react-core-components';
import ExternalTeaser from './ExternalTeaser';

interface TeaserItem {
	title: string;
	description: string;
	url: string;
	image: string;
	imageAlt: string;
	label: string;
}

const ExternalTeaserRow = ({ items }: { items: TeaserItem[] }) => {
	return (
		<DBStack direction="row" gap="medium">
			{items.map((item) => (
				<ExternalTeaser key={item.url} {...item} />
			))}
		</DBStack>
	);
};

export default ExternalTeaserRow;
