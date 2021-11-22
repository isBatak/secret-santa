import { ChakraProvider, extendTheme, theme } from "@chakra-ui/react";
import { SWRConfig } from "swr";
import { SwrSupabaseContext } from "supabase-swr";
import { supabase } from "../utils/supabaseClient";

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
    <SwrSupabaseContext.Provider value={supabase}>
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
  );
}

export default MyApp;
