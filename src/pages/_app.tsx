import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@/styles/default.css";
import Layout from "@/components/layout";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "@/config/redux";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Head>
          <Script
            src="https://kit.fontawesome.com/94e3743eb1.js"
            crossOrigin="anonymous"
          ></Script>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
