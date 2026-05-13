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

export const metadata = {
  title: "আমার খাতা — ডিজিটাল হিসাব-নিকাশ",
  description: "ছোট ব্যবসার হিসাব, বাকি, বিক্রি ও খরচ সহজে পরিচালনা করুন।",

  metadataBase: new URL("https://amar-khata-xi.vercel.app"),

  openGraph: {
    title: "আমার খাতা — ডিজিটাল হিসাব-নিকাশ",
    description: "ছোট ব্যবসার হিসাব, বাকি, বিক্রি ও খরচ সহজে পরিচালনা করুন।",
    url: "https://amar-khata-xi.vercel.app",
    siteName: "আমার খাতা",
    images: [
      {
        url: "/images/amar-khata-dashboard.jpg",
        width: 1200,
        height: 630,
        alt: "আমার খাতা",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "আমার খাতা — ডিজিটাল হিসাব-নিকাশ",
    description: "ছোট ব্যবসার হিসাব, বাকি, বিক্রি ও খরচ সহজে পরিচালনা করুন।",
    images: ["/images/amar-khata-dashboard.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-scroll-behavior="smooth" data-theme="dark">
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
