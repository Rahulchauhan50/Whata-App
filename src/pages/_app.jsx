import "@/styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux"; // Import the Provider
import { store } from "../redux/store"; // Import your Redux store

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
       
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
