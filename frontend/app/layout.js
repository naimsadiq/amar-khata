import { Tiro_Bangla, Hind_Siliguri, DM_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const tiro = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
  variable: "--font-tiro",
});
const hind = Hind_Siliguri({
  weight: ["300", "400", "500", "600"],
  subsets: ["bengali"],
  variable: "--font-hind",
});
const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = { title: "আমার খাতা — ডিজিটাল হিসাব-নিকাশ" };

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body
        className={`${tiro.variable} ${hind.variable} ${mono.variable} font-sans bg-paper text-ink overflow-x-hidden`}
      >
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
