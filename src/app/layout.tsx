import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { Root } from "@/components/Root/Root";
import { I18nProvider } from "@/core/i18n/provider";
import { MatchProvider } from "@/contexts/MatchContext";
import DappProvider from "@/contexts/DappContext";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";
import "./_assets/custom.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Guess The Beat",
  description: "The Telegram game for music lovers",
  openGraph: {
    type: "website",
    url: "https://guessthebeat.xyz",
    title: "Guess The Beat",
    description: "The Telegram game for music lovers",
    siteName: "Guess The Beat",
    images: [{
      url: "https://gateway.pinata.cloud/ipfs/bafkreiahcoxixyhzjk7fivigz2sov4rvrygb5wkpvzkg3juy3zixp3d6vm",
    }],
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <link
        rel="icon"
        href="/favico.ico"
        type="image/x-icon"
        sizes="any"
      />
      <body>
        <I18nProvider>
          <Root>
            <DappProvider>
              <MatchProvider>{children}</MatchProvider>
            </DappProvider>
          </Root>
        </I18nProvider>
      </body>
    </html>
  );
}
