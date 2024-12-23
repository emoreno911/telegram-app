"use client"
import { Page } from "@/components/Page";
import { useParams } from "next/navigation";
import GameRound from "@/components/MusicGame/GameRound";
import GameContainer from "@/components/Common/GameContainer";


export default function MusicRoundPage() {
  const {genre} = useParams();
	const _genre = decodeURIComponent(genre as string)
	return (
		<Page>
			<GameContainer>
				<GameRound genre={_genre} />
			</GameContainer>
		</Page>	
	)
}