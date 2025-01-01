import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Methods
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON
);

const tableName = "gtb_leaderboard"

// nft_id, username, total, best, avg
async function getTopTen() {
    const cols = "nft_id, username, total, best, avg";
    try {
        const { data, error, status } = await supabase
            .from(tableName)
            .select(cols)
            .order("best", { ascending: false })
            .limit(10);

        if (error && status !== 406) {
            console.log("leaderboard", error)
            return {
                error: true,
                data: null
            }
        }

        return {
            error: false,
            data
        }        
    } catch (error) {
        console.log("leaderboard", error)
        return {
            error: true,
            data: null
        }
    }
}


async function updatePlayerData({nft_id, username, total, best, avg}) {
    // remove null properties for the update
    const obj = {nft_id, username, total, best, avg};
    const cleanData = Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value != null)
    );

    try {
        const { error } = await supabase
            .from(tableName)
            .upsert(cleanData)

        if (error) {
            console.log(nft_id, error)
            return {
                error: true,
                data: null
            }
        }

        return {
            error: false,
            data: ""
        }        
    } catch (error) {
        console.log(nft_id, error)
        return {
            error: true,
            data: null
        }
    }
}

export async function GET(req) {
    const result = await getTopTen()
    return NextResponse.json(result)
}

export async function POST(req) {
    const data = await req.json();
    const result = await updatePlayerData(data)
    return NextResponse.json(result)
}