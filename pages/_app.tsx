import type { AppProps } from 'next/app';
import ChatbotPopup from '../components/ChatbotPopup';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ChatbotPopup />
    </>
  );
}

export default MyApp;