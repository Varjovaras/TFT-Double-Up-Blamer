import type { MatchIdList } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const puuid = getRouterParam(event, "puuid");
    console.log(puuid);

    if (!puuid) {
        throw createError({
            statusCode: 400,
            message: "PUUID is required",
        });
    }

    const apiKey = process.env.DEVELOPMENT_API_KEY;

    const res = await fetch(`
        https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=200&api_key=${apiKey}
        `);

    if (!res.ok) {
        throw new Error(`API request failed with status: ${res.status}`);
    }

    const matchList = (await res.json()) as MatchIdList;
    return matchList;
});
