export type AccountV1Response = {
    puuid: string;
    gameName: string;
    tagLine: string;
};

export type MatchIdList = string[];

export type Player = {
    puuid: string;
    name: string;
    tagLine: string;
};

export type Companion = {
    content_ID: string;
    item_ID: number;
    skin_ID: number;
    species: string;
};

export type Trait = {
    name: string;
    num_units: number;
    style: number;
    tier_current: number;
    tier_total: number;
};

export type Unit = {
    character_id: string;
    itemNames: string[];
    name: string;
    rarity: number;
    tier: number;
};

export type Participant = {
    companion: Companion;
    gold_left: number;
    last_round: number;
    level: number;
    missions?: Record<string, number>;
    placement: number;
    players_eliminated: number;
    puuid: string;
    riotIdGameName: string;
    riotIdTagline: string;
    time_eliminated: number;
    total_damage_to_players: number;
    traits: Trait[];
    units: Unit[];
    win: boolean;
};

export type MatchMetadata = {
    data_version: string;
    match_id: string;
    participants: string[];
};

export type MatchInfo = {
    endOfGameResult: string;
    gameCreation: number;
    gameId: number;
    game_datetime: number;
    game_length: number;
    game_version: string;
    mapId: number;
    participants: Participant[];
    queueId: number;
    queue_id: number;
    tft_game_type: string;
    tft_set_core_name: string;
    tft_set_number: number;
};

export type MatchV1Response = {
    metadata: MatchMetadata;
    info: MatchInfo;
};
