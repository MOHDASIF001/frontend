import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InquiryModals from "../components/InquiryModals";
import { ModalProvider } from "../context/ModalContext";
import { fetchSiteSettings } from "../lib/siteSettings";
import { buildOrganizationSchema } from "../lib/organizationSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://twinbholidays.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Twin Brothers Holidays - Travel Kashmir",
  description: "Book Jammu & Kashmir tour packages, hotels, cabs, and adventure activities.",
  authors: [{ name: "Twin Brothers Holidays", url: siteUrl }],
  creator: "Twin Brothers Holidays",
  publisher: "Twin Brothers Holidays",
  robots: { index: true, follow: true },
  // Served as-is from /public - no build-time image processing (the app/icon.*
  // convention runs every favicon through `sharp`, which hung Vercel's build
  // when its native binary didn't install cleanly there).
  icons: {
    icon: "/images/fav-icon-logo.jpeg",
    apple: "/images/fav-icon-logo.jpeg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Admin Panel -> Settings -> "SEO & Integrations" controls GTM/GA and the
  // Organization schema below - sitewide, without touching code.
  const settings = await fetchSiteSettings();
  const gtmId = settings.gtm_container_id.trim();
  const ga4Id = settings.ga4_measurement_id.trim();
  const organizationSchema = buildOrganizationSchema(settings);

  return (
    <html lang="en" className="h-full">
      <head>
        {gtmId && (
          // Plain inline <script>, not next/script - next/script's `afterInteractive`
          // strategy defers injection until after client-side hydration, so the tag
          // never appears in the server-rendered HTML at all (confirmed via curl: 0
          // occurrences of this script in the raw page source). It still fired for real
          // visitors once hydrated, but GTM's own "Test your website" installer check
          // only reads the static HTML and reported "tag not detected". This is Google's
          // own official snippet, rendered exactly as their install instructions show it.
          <script
            id="gtm-head"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script
              id="ga4-init"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Resource hints: start DNS/TLS for the origins behind the
            render-blocking CSS below early. Kept to 4 - PageSpeed Insights
            specifically warns that more than that stops helping (each one
            competes for bandwidth with the page's own critical requests). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
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
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <ModalProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <InquiryModals />
        </ModalProvider>
      </body>
    </html>
  );
}
