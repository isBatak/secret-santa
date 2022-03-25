import { Grid } from "@chakra-ui/react";

export default function Layout({ children }) {

  return (
    <Grid
      placeItems="center"
      minH="100vh"
      bgImage="url('https://miro.medium.com/max/4000/1*Oxka9SDh5CeYDw1TNTAeFA.jpeg')"
      bgSize="cover"
      p={5}
    >
      {children}
    </Grid>
  );
}
