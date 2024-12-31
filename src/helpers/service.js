export async function getLeaderboard() {
    try {
        const res = await fetch(`/api/leaderboard`, {
            method: "GET"
        });
        const response = await res.json();
        return response;
    } catch (error) {
        console.log(error)
        return {error: true}
    }    
}

export async function updateLeaderboard({nft_id, username, total, best, avg}) {
    try {
        const res = await fetch(`/api/leaderboard`, {
            method: "POST",
            body: JSON.stringify({ nft_id, username, total, best, avg }),
        });
        const response = await res.json();
        return response;
    } catch (error) {
        console.log(error)
        return {error: true}
    }
}

export async function getLastMatches(nft_id) {
    try {
        const res = await fetch(`/api/matches?nft_id=${nft_id}&last=1`, {
            method: "GET"
        });
        const response = await res.json();
        return response;
    } catch (error) {
        console.log(error)
        return {error: true}
    }    
}

export async function getPointsAndAvg(nft_id) {
    try {
        const res = await fetch(`/api/matches?nft_id=${nft_id}`, {
            method: "GET"
        });
        const response = await res.json();
        return response;
    } catch (error) {
        console.log(error)
        return {error: true}
    }    
}

export async function insertMatch({nft_id, username, points, avg_time, cat_id, cat_name}) {
    try {
        const res = await fetch(`/api/matches`, {
            method: "POST",
            body: JSON.stringify({nft_id, username, points, avg_time, cat_id, cat_name}),
        });
        const response = await res.json();
        return response;
    } catch (error) {
        console.log(error)
        return {error: true}
    }
}