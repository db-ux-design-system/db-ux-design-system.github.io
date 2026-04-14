import { DBNotification } from '@db-ux/react-core-components';
import './YourAction.css';

const YourAction = ({ actions }: { actions: string[] }) => {
	return (
		<DBNotification
			className="your-action"
			semantic="warning"
			headline="Your Action"
			variant="standalone"
		>
			<ul>
				{actions.map((action) => (
					<li key={action}>{action}</li>
				))}
			</ul>
		</DBNotification>
	);
};

export default YourAction;
