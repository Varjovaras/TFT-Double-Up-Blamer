import type { AccountV1Response } from "~/utils/types";

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

    const res = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagline}?api_key=${apiKey}`,
    );

    if (!res.ok) {
        throw createError({
            statusCode: res.status,
            message: `Getting puuid from accountV1 API failed with status: ${res.status}`,
        });
    }

    const accountData = (await res.json()) as AccountV1Response;
    console.log(accountData);
    return accountData;
});
