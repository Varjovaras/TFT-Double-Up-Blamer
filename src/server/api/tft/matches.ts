type AccountV1Response = {
    puuid: string;
    gameName: string;
    tagLine: string;
};

export default defineEventHandler(async (event) => {
    // console.log(event);
    const tagLine = "6969";
    const name = "rollingntrolling";
    const res = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}?api_key=${process.env.DEVELOPMENT_API_KEY}`,
    );
    if (!res.ok) {
        throw new Error(`API request failed with status: ${res.status}`);
    }

    const accountData = (await res.json()) as AccountV1Response;

    return {
        puuId: accountData.puuid,
    };
});

const getPuuid = async (_tagLine: string, _name: string) => {
    const name = "rollingntrolling";
    const tagLine = "6969";

    const res = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}?api_key=${process.env.DEVELOPMENT_API_KEY}`,
    );
    if (!res.ok) {
        throw new Error(`API request failed with status: ${res.status}`);
    }

    const accountData = (await res.json()) as AccountV1Response;

    return {
        puuId: accountData.puuid,
    };
};
