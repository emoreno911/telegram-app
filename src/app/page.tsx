'use client';

import { Section, Cell, Image, List } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';


export default function Home() {
  const t = useTranslations('i18n');

  return (
    <Page back={false}>
      <List>
        <Section
          header="Application Launch Data"
          footer="These pages help developer to learn more about current launch information"
        >
          <Link href="/init-data">
            <Cell subtitle="User data, chat information, technical data">
              Init Data
            </Cell>
          </Link>
          <Link href="/music-game">
            <Cell subtitle="Music dapp for fun with NFTs">
              Guess the Beat 🎶
            </Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
}
