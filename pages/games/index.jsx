import { withPageAuth } from '@supabase/auth-helpers-nextjs';

import Layout from '../../components/Layout';
import Games from '../../components/Games';

export default function GamesPage({ data }) {
	return (
		<Layout>
			<Games data={data} />
		</Layout>
	);
}

export const getServerSideProps = withPageAuth({
	redirectTo: '/login',
	async getServerSideProps(ctx, supabase) {
		const { data } = await supabase.from('games').select('*');

		return { props: { data } };
	},
});
