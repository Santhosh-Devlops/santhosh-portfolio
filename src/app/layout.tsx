import type { Metadata, Viewport } from "next";
import { Anton, Inter, Sora } from "next/font/google";
import { GlyphDefs } from "@/components/ui/Glyph";
import { InlineScript } from "@/components/InlineScript";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Santhosh Kumar K — AI Enthusiast & Software Developer",
  description:
    "Portfolio of Santhosh Kumar K, an Information Technology student and independent developer building AI-powered applications: multimodal RAG, multi-agent analytics, explainable resume screening and online anomaly detection.",
  authors: [{ name: "Santhosh Kumar K" }],
  openGraph: {
    title: "Santhosh Kumar K — Beyond Code",
    description: "AI enthusiast, software developer and independent builder.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#030406",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${sora.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Decide before first paint whether the title sequence will play, so page content never flashes beneath it. */}
        <InlineScript
          html={`(function(){try{var q=new URLSearchParams(location.search).get("intro");var seen=sessionStorage.getItem("skk-intro")==="1";if(q==="1"||(!seen&&q!=="0"))document.documentElement.classList.add("intro-pending")}catch(e){}})()`}
        />
      </head>
      <body>
        <GlyphDefs />
        {children}
      </body>
    </html>
  );
}
