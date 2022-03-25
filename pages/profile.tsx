import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs';

export default function Profile({ user }) {
  return <div>Hello {user.name}</div>;
}

export const getServerSideProps = withAuthRequired({ redirectTo: '/login' });
