import "../styles/globals.css";
import Head from "next/head";
import { SessionProvider } from 'next-auth/react'
import { ToastContainer, toast } from "react-toastify";

function MyApp({ Component, pageProps: { session, ...pageProps} }) {

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Dashboard</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
      </Head>
      <ToastContainer />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;