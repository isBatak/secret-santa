import { ChakraProvider, extendTheme, theme } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import { SwrSupabaseContext } from 'supabase-swr';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

import 'animate.css';

import { fetcher } from '../libs/fetcher';
import { useState } from 'react';

const myTheme = extendTheme({
	styles: {
		global: (props) => ({
			...theme.styles.global(props),
			body: {
				...theme.styles.global(props).body,
			},
		}),
	},
	layerStyles: {
		glass: {
			background: 'rgba( 255, 255, 255, 0.5 )',
			boxShadow: '0 8px 32px 0 rgba( 200, 38, 135, 0.37 )',
			backdropFilter: 'blur( 15px )',
			WebkitBackdropFilter: 'blur( 15px )',
			borderRadius: '10px',
			border: '1px solid rgba( 255, 255, 255, 0.18 )',
		},
	},
});

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

	return (
		<SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
			<SwrSupabaseContext.Provider value={supabaseClient}>
				<ChakraProvider theme={myTheme}>
					<SWRConfig
						value={{
							fetcher,
						}}
					>
						<button
							onClick={async () => {
								await supabaseClient.auth.signOut();
								router.push('/');
							}}
						>
							Logout
						</button>
						<Component {...pageProps} />
					</SWRConfig>
				</ChakraProvider>
			</SwrSupabaseContext.Provider>
		</SessionContextProvider>
	);
}

export default MyApp;
