import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import Layout from '@/components/Layout';
import { NextPage } from 'next';
import { Card } from '@/components/core/Card/Card';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';

const LoginPage: NextPage = () => {
	const { isLoading, session, error, supabaseClient } = useSessionContext();
	const user = useUser();

	return (
		<Layout>
			<Card>
				<FormControl isInvalid={!!error}>
					<FormErrorMessage>{error?.message}</FormErrorMessage>
					<Auth
						redirectTo="http://localhost:3000/"
						appearance={{ theme: ThemeSupa }}
						supabaseClient={supabaseClient}
						socialLayout="horizontal"
						magicLink
					/>
				</FormControl>
			</Card>
		</Layout>
	);
};

export default LoginPage;
