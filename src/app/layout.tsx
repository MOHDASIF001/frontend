import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InquiryModals from "../components/InquiryModals";
import { ModalProvider } from "../context/ModalContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://twinbholidays.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Twin Brothers Holidays - Travel Kashmir",
  description: "Book Jammu & Kashmir tour packages, hotels, cabs, and adventure activities.",
  keywords: "Kashmir, Srinagar, Gulmarg, Pahalgam, Tour Packages, Hotel Booking, Cabs",
  // Served as-is from /public - no build-time image processing (the app/icon.*
  // convention runs every favicon through `sharp`, which hung Vercel's build
  // when its native binary didn't install cleanly there).
  icons: {
    icon: "/images/fav-icon-logo.jpeg",
    apple: "/images/fav-icon-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Sour+Gummy:ital,wght@0,100..900;1,100..900&family=Alex+Brush&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Bootstrap 5 CSS */}
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
          crossOrigin="anonymous" 
        />
        
        {/* FontAwesome 6.7.2 */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" 
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
        
        {/* Bootstrap 5 JS Bundle */}
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" 
          integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" 
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ModalProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <InquiryModals />
        </ModalProvider>
      </body>
    </html>
  );
}
