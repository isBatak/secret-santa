import { ChakraProvider, extendTheme, theme } from "@chakra-ui/react";
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { SWRConfig } from "swr";
import { SwrSupabaseContext } from "supabase-swr";

import "animate.css";

import { fetcher } from "../libs/fetcher";

const myTheme = extendTheme({
  styles: {
    global: (props) => ({
      ...theme.styles.global(props),
      body: {
        ...theme.styles.global(props).body,
        bg: "yellow",
      },
    }),
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <SwrSupabaseContext.Provider value={supabaseClient}>
        <ChakraProvider theme={myTheme}>
          <SWRConfig
            value={{
              fetcher,
            }}
          >
            <Component {...pageProps} />
          </SWRConfig>
        </ChakraProvider>
      </SwrSupabaseContext.Provider>
    </UserProvider>
  );
}

export default MyApp;
