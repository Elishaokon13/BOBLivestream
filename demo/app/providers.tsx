"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { WagmiConfig } from "wagmi";
import { config } from "../lib/wagmi";

export function Providers(props: { children: ReactNode }) {
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS";
  const iconUrl = process.env.NEXT_PUBLIC_ICON_URL || "/icon.png";

  return (
    <WagmiConfig config={config}>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ""}
        chain={base}
        config={{
          appearance: {
            mode: "auto",
            theme: "mini-app-theme",
            name: projectName,
            logo: iconUrl,
          },
        }}
      >
        {props.children}
      </MiniKitProvider>
    </WagmiConfig>
  );
}
