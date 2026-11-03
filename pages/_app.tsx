import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DM_Sans, Lora } from "next/font/google";
import Navbar from "@/components/Navbar";
import SocialLinks from "@/components/SocialLinks";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dm-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${lora.className} ${dmSans.variable} site`}>
      <Navbar />
      <main className="site-main">
        <Component {...pageProps} />
        <SocialLinks />
      </main>
    </div>
  );
}
