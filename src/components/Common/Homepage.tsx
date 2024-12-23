import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import GameContainer from '@/components/Common/GameContainer';
import GameButton from '@/components/Common/GameButton';
import AnimatedLogo from '@/components/Common/AnimatedLogo';
import { IconMusic, IconTrophy, IconUser, IconWallet } from '@tabler/icons-react';


export default function Homepage() {

  const d = {
    displayName: "Eduardo",
    email: "eduardo@gmail.com",
    photoURL: "https://avatar.iran.liara.run/public/boy",
    uid: "768676868687",
  };


  return (
    <Page back={false}>
      <GameContainer>
          <h2 className="font-gaming font-semibold text-pink-600 text-5xl text-shadow-white z-10">Guess the Beat</h2>
          <h3 className="z-10">Test your music knowledge and become a Tune Master!</h3>
          <button 
							type="button"
							className="w-full  max-w-48 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
							onClick={() => {}}
						>
							<div className="flex justify-center gap-1 text-shadow-black">
								<IconWallet />
								<span>Connect Wallet</span>
							</div>
					</button>
          
          {/* <div className="z-10">
            <AnimatedLogo />
          </div> */}

				<div className="w-96 z-10 bg-gray-700 p-4 py-2 rounded-lg shadow mb-0 flex items-center justify-between bg-pink-500/75">
					<div className="flex items-center space-x-4">
						<IconMusic className="w-12 h-12"/>
						<div>
							<p className="font-semibold text-lg">{"Play Now"}</p>
							<p className="text-gray-300">Guess songs and artists</p>
						</div>
					</div>
				</div>

				<div className="w-96 z-10 bg-gray-700 p-4 py-2 rounded-lg shadow mb-0 flex items-center justify-between bg-pink-500/75">
					<div className="flex items-center space-x-4">
						<IconTrophy className="w-12 h-12"/>
						<div>
							<p className="font-semibold text-lg">{"Leaderboard"}</p>
							<p className="text-gray-300">Compete with friends</p>
						</div>
					</div>
				</div>

				<div className="w-96 z-10 bg-gray-700 p-4 py-2 rounded-lg shadow mb-0 flex items-center justify-between bg-pink-500/75">
					<div className="flex items-center space-x-4">
						<IconUser className="w-12 h-12"/>
						<div>
							<p className="font-semibold text-lg">{"Profile"}</p>
							<p className="text-gray-300">View your stats</p>
						</div>
					</div>
				</div>

      </GameContainer>
    </Page>
  );
}