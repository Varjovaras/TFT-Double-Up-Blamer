import type { AccountV1Response } from "~/utils/types";

const getPuuidByAccountV1 = async (
    accountName?: string,
    accountTagLine?: string,
) => {
    const name = accountName || "rollingntrolling";
    const tagLine = accountTagLine || "6969";

    const res = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}?api_key=${process.env.DEVELOPMENT_API_KEY}`,
    );

    if (!res.ok) {
        throw new Error(`API request failed with status: ${res.status}`);
    }

    const accountData = (await res.json()) as AccountV1Response;
    return accountData;
};

export default getPuuidByAccountV1;
