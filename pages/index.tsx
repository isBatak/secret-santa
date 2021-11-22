import { useSession } from "supabase-swr";

import Auth from "../components/Auth";
import Account from "../components/Account";
import Layout from "../components/Layout";

export default function Home() {


  return (
    <Layout>
      <Account />
    </Layout>
  );
}
