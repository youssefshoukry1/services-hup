import "./globals.css";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });

export const metadata = {
  title: "ServiceHub | Lokale Dienstleistungen finden",
  description: "Entdecken Sie lokale Dienstleister in Deutschland und nehmen Sie direkt Kontakt auf.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de-DE">
      <body className={`${manrope.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
