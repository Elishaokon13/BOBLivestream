import { Providers } from "./providers";
import "./globals.css";
import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS";
  const heroImage = process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "/hero.png";

  // Ensure URL is defined
  if (!URL) {
    return {
      title: projectName,
      description: "Mint your POAP for attending the BUILD ON BASE workshop",
    };
  }

  const frameMetadata = {
    version: "1",
    image: heroImage,
    buttons: [
      {
        label: "Mint POAP",
        action: "post",
      },
    ],
    postUrl: `${URL}/api/webhook`,
  };

  return {
    title: projectName,
    description: "Mint your POAP for attending the BUILD ON BASE workshop",
    openGraph: {
      title: projectName,
      description: "Mint your POAP for attending the BUILD ON BASE workshop",
      images: [heroImage],
    },
    other: {
      "fc:frame": JSON.stringify(frameMetadata),
      "fc:frame:image": heroImage,
      "fc:frame:post_url": `${URL}/api/webhook`,
      "fc:frame:button:1": "Mint POAP",
    },
  };
}
