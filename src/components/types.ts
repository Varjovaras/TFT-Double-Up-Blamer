/**
 * Types for the Rito TFT application
 */

// Account response from Riot API
export type AccountV1Response = {
    puuid: string;
    gameName: string;
    tagLine: string;
};

// TFT Match data type
export type TFTMatch = {
    matchId: string;
    // Add more match-specific fields as needed
};

// Player data type
export type Player = {
    puuid: string;
    name: string;
    tagLine: string;
    // Add more player-specific fields as needed
};