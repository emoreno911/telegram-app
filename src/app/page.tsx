'use client';

import { useTranslations } from 'next-intl';

import { Page } from '@/components/Page';
import GameContainer from '@/components/Common/GameContainer';
import Homepage from '@/components/Common/Homepage';


export default function Home() {
  const t = useTranslations('i18n');

  return (
    <Page back={false}>
      <GameContainer>
        <Homepage />
      </GameContainer>
    </Page>
  );
}
