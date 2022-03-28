import { useUser, Auth } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import Layout from '@/components/Layout';
import { NextPage } from 'next';
import { Card } from '@/components/core/Card/Card';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';

const LoginPage: NextPage = () => {
	const { error } = useUser();

	return (
		<Layout>
			<Card>
				<FormControl isInvalid={!!error}>
					<FormErrorMessage>{error?.message}</FormErrorMessage>
					<Auth supabaseClient={supabaseClient} socialLayout="vertical" socialButtonSize="xlarge" magicLink />
				</FormControl>
			</Card>
		</Layout>
	);
};

export default LoginPage;
