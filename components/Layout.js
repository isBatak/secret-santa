import { Grid } from "@chakra-ui/react";
import { useSession } from "supabase-swr";
import Auth from "./Auth";

export default function Layout({ children }) {
  const session = useSession();

  return (
    <Grid
      placeItems="center"
      minH="100vh"
      bgImage="url('https://miro.medium.com/max/4000/1*Oxka9SDh5CeYDw1TNTAeFA.jpeg')"
      bgSize="cover"
      p={5}
    >
      {!session ? (
        <Auth />
      ) : children}
    </Grid>
  );
}
