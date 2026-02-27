import type { APIRoute } from 'astro';
import { appNavigation } from '../../../app.navigation';

export const GET: APIRoute = () => {
	return new Response(JSON.stringify(appNavigation), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
