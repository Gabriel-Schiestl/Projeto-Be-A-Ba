import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps} }) {

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;