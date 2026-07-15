import Script from "next/script";
import "./tokens.css";
import "./globals.css";
import "./project.css";
import BlobCursor from "./components/BlobCursor";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Alice Zhao | Product Designer",
  description: "UX Lead @ AWS. Shaping AI-native experience for AWS storage services.",
  icons: {
    icon: "/img/favcon.png",
  },
  openGraph: {
    title: "Alice Zhao | Product Designer",
    description: "UX Lead @ AWS. Shaping AI-native experience for AWS storage services.",
    images: [{ url: "/img/alicezhao-productdesigner.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alice Zhao | UX Designer",
    description: "UX Lead @ AWS. Shaping AI-native experience for AWS storage services.",
    images: ["/img/alicezhao-productdesigner.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BlobCursor />
        {children}
        {/* Microsoft Clarity — visitor analytics (heatmaps + session recordings) */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xlmqnyfr5v");`}
        </Script>
      </body>
    </html>
  );
}
