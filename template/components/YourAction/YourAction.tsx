import { DBNotification } from '@db-ux/react-core-components';
import './YourAction.css';

const YourAction = ({ actions }: { actions: string[] }) => {
	return (
		<DBNotification
			className="your-action"
			semantic="warning"
			headline="Your Action"
			variant="standalone">
			<ol>
				{actions.map((action, index) => (
					<li key={index}>{action.replace(/^\d+\.\s*/, '')}</li>
				))}
			</ol>
		</DBNotification>
	);
};

export default YourAction;
