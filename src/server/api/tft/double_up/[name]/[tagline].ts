import type {
    MatchV1Response,
    AccountV1Response,
    MatchIdList,
} from "~/utils/types";

export default defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const tagline = getRouterParam(event, "tagline");
    const apiKey = process.env.DEVELOPMENT_API_KEY;

    if (!name || !tagline) {
        throw createError({
            statusCode: 400,
            message: "Name and tagline are required",
        });
    }

    const accountRes = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagline}?api_key=${apiKey}`,
    );

    if (!accountRes.ok) {
        throw createError({
            statusCode: accountRes.status,
            message: `Getting account data failed with status: ${accountRes.status}`,
        });
    }

    const accountData = (await accountRes.json()) as AccountV1Response;
    const puuid = accountData.puuid;

    //get the last 1000 games
    const matchesRes = await fetch(
        `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=1000&api_key=${apiKey}`,
    );

    if (!matchesRes.ok) {
        throw createError({
            statusCode: matchesRes.status,
            message: `Getting match IDs failed with status: ${matchesRes.status}`,
        });
    }

    const matchIds = (await matchesRes.json()) as MatchIdList;

    // Step 3: Fetch match details for each match ID (with some rate limiting)
    const doubleUpMatches: MatchV1Response[] = [];

    // Process matches in chunks to avoid rate limiting issues
    const chunkSize = 10;
    for (let i = 0; i < Math.min(matchIds.length, 50); i += chunkSize) {
        // Limit to 50 most recent matches
        const chunk = matchIds.slice(i, i + chunkSize);

        // Fetch match details in parallel for each chunk
        const matchDetailsPromises = chunk.map(async (matchId) => {
            try {
                const res = await fetch(
                    `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${apiKey}`,
                );

                if (res.ok) {
                    const matchData = (await res.json()) as MatchV1Response;
                    // Filter for Double Up games ("pairs" game type)
                    if (matchData.info.tft_game_type === "pairs") {
                        return matchData;
                    }
                }
                return null;
            } catch (error) {
                console.error(`Error fetching match ${matchId}:`, error);
                return null;
            }
        });

        const chunkResults = await Promise.all(matchDetailsPromises);
        doubleUpMatches.push(
            ...(chunkResults.filter(
                (match) => match !== null,
            ) as MatchV1Response[]),
        );

        // Add a small delay between chunks to reduce API rate limit pressure
        if (i + chunkSize < matchIds.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    return {
        account: accountData,
        matches: doubleUpMatches,
    };
});
