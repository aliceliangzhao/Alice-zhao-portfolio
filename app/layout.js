import "./globals.css";
import "./project.css";
import CursorTrail from "./components/CursorTrail";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Alice Zhao | UX Designer",
  description: "UX Designer that reimagines digital experiences. Currently building AI products for AWS.",
  icons: {
    icon: "/img/favcon.png",
  },
  openGraph: {
    title: "Alice Zhao | UX Designer",
    description: "UX Designer that reimagines digital experiences. Currently building AI products for AWS.",
    images: [{ url: "/img/alicezhao-productdesigner.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alice Zhao | UX Designer",
    description: "UX Designer that reimagines digital experiences. Currently building AI products for AWS.",
    images: ["/img/alicezhao-productdesigner.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CursorTrail />
        {children}
      </body>
    </html>
  );
}
