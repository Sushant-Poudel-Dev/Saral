import { Inter, Lexend, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: "Saral",
  description: "App Description",
};

export default function RootLayout({ children }) {
  const fontClasses = [
    inter.variable,
    lexend.variable,
    montserrat.variable,
    roboto.variable,
    "antialiased",
  ].join(" ");

  return (
    <html lang='en'>
      <body
        className={fontClasses}
        suppressHydrationWarning={true}
      >
        <Navbar />
        {children}
        <div className='hidden md:block'>
          <Footer />
        </div>
      </body>
    </html>
  );
}
