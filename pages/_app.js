import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { SSRProvider } from 'react-bootstrap';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </Provider>
  )
}

export default MyApp
