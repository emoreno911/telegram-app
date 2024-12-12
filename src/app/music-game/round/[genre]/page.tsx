"use client"
import { Page } from "@/components/Page";
import { useParams } from "next/navigation";
import GameRound from "@/components/MusicGame/GameRound";


export default function MusicRoundPage() {
    const {genre} = useParams();
	return (
		<Page>
			<GameRound genre={genre as string} />
		</Page>	
	)
}