import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@/styles/default.css";
import Layout from "@/components/layout";
import { Provider } from "react-redux";
import store from "@/config/redux";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Script
        src="https://kit.fontawesome.com/94e3743eb1.js"
        crossOrigin="anonymous"
      ></Script>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
