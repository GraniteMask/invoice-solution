import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../public/styles.css'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'react-redux'
import store from '../store'
import { QueryClientProvider, QueryClient } from 'react-query'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SnackbarProvider anchorOrigin={{vertical: 'top', horizontal:'left'}}>
          <Component {...pageProps} />
        </SnackbarProvider>
      </Provider>
    </QueryClientProvider>
  )
}

export default MyApp
