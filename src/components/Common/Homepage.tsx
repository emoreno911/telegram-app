import { Link } from '@/components/Link/Link';
import GameButton from '@/components/Common/GameButton';
import AnimatedLogo from '@/components/Common/AnimatedLogo';
import { useDapp } from '@/contexts/DappContext';
import { splitHexAddress } from '@/helpers/utils'
import { IconCopy } from '@tabler/icons-react';


export default function Homepage() {
	const {
		state,
		address,
		btnLoading,
		signMessageContext,
		verifyMessageResult,
		connectWallet = () => {},
		disconnectWallet = () => {},
		setSignMessageContext = (x:string) => {},
		signMessage  = () => {},
		verifySignMessage = () => {},
	} = useDapp();


  return (
    <>
			<div className="z-10">
				<AnimatedLogo />
			</div>
			<h2 className="font-gaming font-semibold text-pink-600 text-5xl text-shadow-black z-10 home-title-margin">Guess the Beat</h2>
			<h3 className="font-bold text-xl font-cursive text-center text-sky-500 text-shadow-black mb-4 z-10 px-4 max-w-96">Test your music knowledge and become a Tune Master!</h3>
			
			{address && (
				<div className="z-10 text-white mb-4 px-4 py-1 bg-sky-600 text-sm rounded-md flex items-center gap-1 box-shadow-custom">
					<img 
						src="https://opbnb.bscscan.com/assets/opbnb/images/svg/logos/token-light.svg"
						className="h-4 w-4"
						alt="opBNB symbol"
					/>
					<span>{splitHexAddress(address)}</span>
					<div>
						<IconCopy className="h-4 w-4" />
					</div>
				</div>
			)}

			<Link href="/music-game">
				<GameButton className="!min-w-80">
					<span>Play Now</span>
				</GameButton>
			</Link>
			<Link  href="/leaderboard">
				<GameButton className="!min-w-80">
					<span>Leaderboard</span>
				</GameButton>
			</Link>
			{address && (
				<Link  href="/user-profile">
					<GameButton className="!min-w-80">
						<span>Profile</span>
					</GameButton>
				</Link>
			)}
			<div className="z-10">
				{address ? null :(
					<GameButton 
						className="!min-w-80"
						onClick={connectWallet}
					>
						<span>{ btnLoading ? "Loadding..." : "Connect Wallet" }</span>
					</GameButton>
				)}
			</div>
    </>
  );
}