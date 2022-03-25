import { useUser, Auth } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Box } from '@chakra-ui/react';

const LoginPage = () => {
  const { user, error } = useUser();
  const [data, setData] = useState();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('test').select('*');
      setData(data);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user]);

  if (!user)
    return (
      <Layout>
        <Box spacing={8} bg="white" p={5} borderRadius="md" boxShadow="2xl" minW="md">
          {error && <p>{error.message}</p>}
          <Auth
            supabaseClient={supabaseClient}
            providers={['google', 'github', 'facebook']}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </Box>
      </Layout>
    );

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>client-side data fetching with RLS</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default LoginPage;
