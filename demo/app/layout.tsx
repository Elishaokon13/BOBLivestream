import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://bob-livestream.vercel.app/";
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS";
  const heroImage = process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "/app.png";

  return {
    title: projectName,
    description: "Mint your POAP for attending the BUILD ON BASE workshop",
    openGraph: {
      title: projectName,
      description: "Mint your POAP for attending the BUILD ON BASE workshop",
      images: [heroImage],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "vNext",
        image: {
          src: heroImage,
          aspectRatio: "1.91:1",
        },
        buttons: [
          {
            label: `Launch ${projectName}`,
            action: "post",
          },
        ],
        postUrl: URL,
      }),
      "fc:frame:image": heroImage,
      "fc:frame:post_url": URL,
      "fc:frame:button:1": `Launch ${projectName}`,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
