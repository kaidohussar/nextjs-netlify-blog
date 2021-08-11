import "normalize.css";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";

const StylesProvider = dynamic(
  () => import("kaidohussar-ui").then((mod) => mod.StylesProvider),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider>
      <Component {...pageProps} />
    </StylesProvider>
  );
}
