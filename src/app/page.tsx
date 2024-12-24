'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import GameContainer from '@/components/Common/GameContainer';
import GameButton from '@/components/Common/GameButton';
import AnimatedLogo from '@/components/Common/AnimatedLogo';
import { IconMusic, IconTrophy, IconUser, IconWallet } from '@tabler/icons-react';
import AudioAnalyzer from '@/components/Common/AudioAnalyzer';


export default function Home() {
  const t = useTranslations('i18n');

  const d = {
    displayName: "Eduardo",
    email: "eduardo@gmail.com",
    photoURL: "https://avatar.iran.liara.run/public/boy",
    uid: "768676868687",
  };


  return (
    <Page back={false}>
      <GameContainer>
          <div className="z-10">
            <AnimatedLogo />
          </div>
          <h2 className="font-gaming font-semibold text-pink-600 text-5xl text-shadow-black z-10 home-title-margin">Guess the Beat</h2>
          <h3 className="font-bold text-xl font-cursive text-center text-sky-500 text-shadow-black mb-4 z-10 px-4 max-w-96">Test your music knowledge and become a Tune Master!</h3>
          {/* <div className="rounded-full w-48 h-48 z-10">
            <img src={d.photoURL} alt="app-pic" className="" />
          </div> */}
          

          <Link href="/music-game">
            <GameButton className="!min-w-80">
              {/* <IconMusic /> */}
              <span>Play Now</span>
            </GameButton>
          </Link>
          <Link  href="/leaderboard">
            <GameButton className="!min-w-80">
              {/* <IconTrophy /> */}
              <span>Leaderboard</span>
            </GameButton>
          </Link>
          <Link  href="/user-profile">
            <GameButton className="!min-w-80">
              {/* <IconUser /> */}
              <span>Profile</span>
            </GameButton>
          </Link>
          <Link  href="/init-data">
            <GameButton className="!min-w-80">
              {/* <IconWallet /> */}
              <span>Connect Wallet</span>
            </GameButton>
          </Link>
      </GameContainer>
    </Page>
  );
}
