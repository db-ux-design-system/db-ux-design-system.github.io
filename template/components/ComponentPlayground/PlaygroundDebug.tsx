import { useState } from 'react';
import { resolveComponent } from './component-registry';

export default function PlaygroundDebug() {
	const [variant, setVariant] = useState('outlined');
	const DBButton = resolveComponent('DBButton');

	return (
		<div style={{ padding: '20px', border: '2px solid red' }}>
			<p>
				Debug: variant = {variant}, DBButton resolved = {DBButton ? 'YES' : 'NO'}
			</p>
			<select value={variant} onChange={(e) => setVariant(e.target.value)}>
				<option value="outlined">Outlined</option>
				<option value="brand">Brand</option>
				<option value="filled">Filled</option>
				<option value="ghost">Ghost</option>
			</select>
			{DBButton && <DBButton variant={variant}>Test Button</DBButton>}
		</div>
	);
}
