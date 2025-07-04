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
  
  const miniAppEmbed = {
    version: "1",
    imageUrl: `${URL}${heroImage.startsWith('/') ? heroImage.slice(1) : heroImage}`,
    button: {
      title: "🎉 Mint POAP",
      action: {
        type: "launch_miniapp",
        url: URL,
        name: projectName,
        splashImageUrl: `${URL}splash.png`,
        splashBackgroundColor: "#0052FF"
      }
    }
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
      'fc:miniapp': JSON.stringify(miniAppEmbed),
      'fc:frame': JSON.stringify(miniAppEmbed), // For backward compatibility
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
