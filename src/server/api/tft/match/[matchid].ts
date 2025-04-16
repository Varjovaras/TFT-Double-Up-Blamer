import type { MatchV1Response } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const matchid = getRouterParam(event, "matchid");
    console.log(`Fetching match data for: ${matchid}`);

    if (!matchid) {
        throw createError({
            statusCode: 400,
            message: "MATCHID is required",
        });
    }

    const apiKey = process.env.DEVELOPMENT_API_KEY;

    try {
        const res = await fetch(
            `https://europe.api.riotgames.com/tft/match/v1/matches/${matchid}?api_key=${apiKey}`,
        );

        if (!res.ok) {
            throw createError({
                statusCode: res.status,
                message: `API request failed with status: ${res.status}`,
            });
        }

        const matchData = (await res.json()) as MatchV1Response;
        return matchData;
    } catch (error) {
        console.error("Error fetching match data:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch match data",
        });
    }
});
