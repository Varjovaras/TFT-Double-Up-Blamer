<template>
    <div class="max-w-4xl mx-auto flex flex-col items-center">
        <h1
            class="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text inline-block"
        >
            TFT Double Up Blamer
        </h1>

        <SearchForm
            v-model="gameNameInput"
            :error="inputError"
            :is-loading="loading"
            class="mb-8"
            @submit="handleSearch"
        />
        <LoadingSpinner v-if="loading || loadingMatches" />

        <div
            v-if="error"
            class="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6 w-full"
        >
            {{ error }}
        </div>

        <!-- Account info -->
        <div v-if="accountData" class="w-full mb-8">
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-bold mb-2 text-blue-400">
                    Account Information
                </h2>
                <div class="flex items-center">
                    <div class="bg-gray-700 p-3 rounded-lg inline-flex mr-4">
                        <span class="text-2xl">👤</span>
                    </div>
                    <div>
                        <p class="text-xl font-semibold">
                            {{ accountData.gameName }}#{{ accountData.tagLine }}
                        </p>
                        <p class="text-gray-400 text-sm">
                            PUUID: {{ truncatePuuid(accountData.puuid) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Match history list -->
        <div v-if="matches.length > 0" class="mt-6 w-full">
            <h3 class="text-xl font-bold mb-3 text-purple-400">
                Recent Matches for {{ currentGameName }}#{{ currentTagLine }}
            </h3>

            <div
                v-if="fetchedMatches.length === 0 && !loadingMatches"
                class="text-center py-8"
            >
                <p class="text-gray-400">Click on a match ID to view details</p>
            </div>

            <div class="bg-gray-800 p-4 rounded-md mb-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                        v-for="(matchId, index) in matches.slice(0, 20)"
                        :key="index"
                        class="bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm transition-colors truncate"
                        :class="{
                            'border-2 border-blue-500':
                                selectedMatch?.metadata.match_id === matchId,
                        }"
                        @click="loadMatchDetails(matchId)"
                    >
                        {{ getShortMatchId(matchId) }}
                    </button>
                </div>
                <div class="text-gray-400 text-sm mt-2">
                    Showing 20 out of {{ matches.length }} matches
                </div>
            </div>
        </div>

        <!-- Match details -->
        <div v-if="selectedMatch" class="w-full">
            <div class="bg-gray-800 p-4 rounded-md mb-6">
                <h3 class="text-xl font-bold mb-3 text-blue-400">
                    Match Details
                </h3>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Match ID:</span>
                        <span class="font-mono">{{
                            selectedMatch.metadata.match_id
                        }}</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Game Type:</span>
                        <span>{{
                            formatGameType(selectedMatch.info.tft_game_type)
                        }}</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Date:</span>
                        <span>{{
                            formatDate(selectedMatch.info.gameCreation)
                        }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Duration:</span>
                        <span>{{
                            formatDuration(selectedMatch.info.game_length)
                        }}</span>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-gray-700 text-left">
                                <th class="p-2 rounded-tl">Placement</th>
                                <th class="p-2">Player</th>
                                <th class="p-2 hidden md:table-cell">Level</th>
                                <th class="p-2">Composition</th>
                                <th class="p-2 rounded-tr">Champions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="participant in sortedParticipants"
                                :key="participant.puuid"
                                :class="[
                                    'border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer',
                                    participant.puuid === accountData?.puuid
                                        ? 'bg-blue-900/30'
                                        : '',
                                    selectedParticipant?.puuid ===
                                    participant.puuid
                                        ? 'bg-purple-900/30'
                                        : '',
                                ]"
                                @click="selectParticipant(participant)"
                            >
                                <td
                                    class="p-2 font-bold"
                                    :class="
                                        getPlacementColor(participant.placement)
                                    "
                                >
                                    {{ participant.placement }}
                                </td>
                                <td class="p-2">
                                    <div class="flex flex-col">
                                        <span>{{
                                            participant.riotIdGameName
                                        }}</span>
                                        <span class="text-xs text-gray-500">{{
                                            participant.riotIdTagline
                                        }}</span>
                                    </div>
                                </td>
                                <td class="p-2 hidden md:table-cell">
                                    {{ participant.level }}
                                </td>
                                <td class="p-2">
                                    <div class="flex flex-wrap gap-1">
                                        <span
                                            v-for="trait in getActiveTraits(
                                                participant,
                                            ).slice(0, 3)"
                                            :key="trait.name"
                                            class="px-1 text-xs rounded"
                                            :class="getTraitStyle(trait)"
                                        >
                                            {{ formatTraitName(trait.name) }}
                                            {{ trait.num_units }}
                                        </span>
                                        <span
                                            v-if="
                                                getActiveTraits(participant)
                                                    .length > 3
                                            "
                                            class="text-xs text-gray-400"
                                        >
                                            +{{
                                                getActiveTraits(participant)
                                                    .length - 3
                                            }}
                                            more
                                        </span>
                                    </div>
                                </td>
                                <td class="p-2">
                                    <div class="flex flex-wrap gap-1">
                                        <div
                                            v-for="unit in getCoreUnits(
                                                participant.units,
                                            ).slice(0, 5)"
                                            :key="unit.character_id"
                                            class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                            :class="
                                                getUnitRarityBackground(
                                                    unit.rarity,
                                                )
                                            "
                                            :title="`${formatUnitName(unit.character_id)} (★${unit.tier})`"
                                        >
                                            {{
                                                getUnitInitial(
                                                    unit.character_id,
                                                )
                                            }}
                                        </div>
                                        <span
                                            v-if="participant.units.length > 5"
                                            class="text-xs text-gray-400 flex items-center"
                                        >
                                            +{{ participant.units.length - 5 }}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Participant detail view -->
            <div
                v-if="selectedParticipant"
                class="bg-gray-800 p-4 rounded-md mb-6"
            >
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-bold text-purple-400">
                        {{ selectedParticipant.riotIdGameName }}#{{
                            selectedParticipant.riotIdTagline
                        }}
                    </h4>
                    <div class="flex items-center">
                        <span
                            :class="
                                getPlacementColor(selectedParticipant.placement)
                            "
                            class="text-lg font-bold px-3 py-1 bg-gray-700 rounded-md"
                        >
                            #{{ selectedParticipant.placement }}
                        </span>
                        <span class="ml-2 px-3 py-1 bg-gray-700 rounded-md">
                            Level {{ selectedParticipant.level }}
                        </span>
                    </div>
                </div>

                <!-- Units display with items -->
                <h5 class="font-semibold mb-2 text-blue-400">Champions</h5>
                <div
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4"
                >
                    <div
                        v-for="unit in selectedParticipant.units"
                        :key="unit.character_id"
                        class="bg-gray-700 p-2 rounded-md"
                    >
                        <div class="flex items-center mb-1">
                            <div
                                class="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs"
                                :class="getUnitRarityBackground(unit.rarity)"
                            >
                                {{ getUnitInitial(unit.character_id) }}
                            </div>
                            <div
                                class="font-medium"
                                :class="getUnitRarityClass(unit.rarity)"
                            >
                                {{ formatUnitName(unit.character_id) }}
                            </div>
                        </div>
                        <div class="text-xs text-yellow-500 mb-1">
                            ★{{ unit.tier }}
                        </div>
                        <div
                            v-if="unit.itemNames.length > 0"
                            class="flex flex-wrap gap-1 mt-1"
                        >
                            <div
                                v-for="(item, idx) in unit.itemNames"
                                :key="idx"
                                class="bg-blue-900 text-blue-300 px-1 rounded text-xs"
                                :title="formatItemName(item)"
                            >
                                {{ formatItemName(item) }}
                            </div>
                        </div>
                        <div v-else class="text-xs text-gray-500 mt-1">
                            No items
                        </div>
                    </div>
                </div>

                <!-- Traits -->
                <h5 class="font-semibold mb-2 text-blue-400">Traits</h5>
                <div class="flex flex-wrap gap-2 mb-4">
                    <span
                        v-for="trait in selectedParticipant.traits.sort(
                            (a, b) => b.style - a.style,
                        )"
                        :key="trait.name"
                        class="px-2 py-1 text-xs rounded-full"
                        :class="getTraitStyle(trait)"
                    >
                        {{ formatTraitName(trait.name) }}
                        {{ trait.num_units }}/{{ trait.tier_total }}
                    </span>
                </div>

                <!-- Additional stats -->
                <h5 class="font-semibold mb-2 text-blue-400">Stats</h5>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-gray-700 p-3 rounded-md">
                        <div class="text-xs text-gray-400">Gold Left</div>
                        <div class="font-bold text-yellow-400">
                            {{ selectedParticipant.gold_left }}
                        </div>
                    </div>
                    <div class="bg-gray-700 p-3 rounded-md">
                        <div class="text-xs text-gray-400">Damage Dealt</div>
                        <div class="font-bold text-red-400">
                            {{ selectedParticipant.total_damage_to_players }}
                        </div>
                    </div>
                    <div class="bg-gray-700 p-3 rounded-md">
                        <div class="text-xs text-gray-400">Last Round</div>
                        <div class="font-bold text-blue-400">
                            {{ selectedParticipant.last_round }}
                        </div>
                    </div>
                    <div class="bg-gray-700 p-3 rounded-md">
                        <div class="text-xs text-gray-400">Outcome</div>
                        <div
                            class="font-bold"
                            :class="
                                selectedParticipant.win
                                    ? 'text-green-400'
                                    : 'text-red-400'
                            "
                        >
                            {{ selectedParticipant.win ? "Victory" : "Defeat" }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
    AccountV1Response,
    MatchIdList,
    MatchV1Response,
    Participant,
    Trait,
    Unit,
} from "~/utils/types";

const route = useRoute();
const router = useRouter();

const gameNameInput = ref("");
const inputError = ref("");
const loading = ref(false);
const error = ref("");
const accountData = ref<AccountV1Response | null>(null);
const matches = ref<MatchIdList>([]);
const loadingMatches = ref(false);
const currentGameName = ref("");
const currentTagLine = ref("");
const fetchedMatches = ref<MatchV1Response[]>([]);
const selectedMatch = ref<MatchV1Response | null>(null);
const selectedParticipant = ref<Participant | null>(null);

const sortedParticipants = computed(() => {
    if (!selectedMatch.value) return [];
    return [...selectedMatch.value.info.participants].sort(
        (a, b) => a.placement - b.placement,
    );
});

// Check URL parameters on load
onMounted(() => {
    const { name, tagline } = route.query;

    if (name && tagline) {
        currentGameName.value = name as string;
        currentTagLine.value = tagline as string;
        gameNameInput.value = `${name}#${tagline}`;
        fetchAccountData(name as string, tagline as string);
    }
});

function truncatePuuid(puuid: string): string {
    return `${puuid.substring(0, 8)}...${puuid.substring(puuid.length - 8)}`;
}

function getShortMatchId(matchId: string): string {
    // Format: EUW1_123456789 -> #123456789
    const parts = matchId.split("_");
    if (parts.length > 1) {
        return `#${parts[1].substring(0, 6)}...`;
    }
    return `${matchId.substring(0, 10)}...`;
}

function formatGameType(type: string): string {
    if (type === "standard") return "Ranked";
    if (type === "normal") return "Normal";
    if (type === "pairs") return "Double Up";
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatTraitName(traitName: string): string {
    // Remove TFT14_ prefix and other formatting
    let name = traitName.replace("TFT14_", "");
    // Insert spaces before capital letters
    name = name.replace(/([A-Z])/g, " $1").trim();
    return name;
}

function formatUnitName(characterId: string): string {
    // Remove TFT14_ prefix
    let name = characterId.replace("TFT14_", "");
    // Handle special forms like NidaleeCougar
    name = name.replace(/([A-Z])/g, " $1").trim();
    return name;
}

function getUnitInitial(characterId: string): string {
    // Get first letter of the champion name after TFT14_
    const name = characterId.replace("TFT14_", "");
    return name.charAt(0);
}

function formatItemName(itemName: string): string {
    // Clean up item names for display
    let name = itemName.replace("TFT_Item_", "").replace("TFT14_Item_", "");
    // Handle special cases
    name = name.replace("EmblemItem", "");
    // Add spaces before capital letters and truncate if too long
    name = name.replace(/([A-Z])/g, " $1").trim();
    return name.length > 12 ? `${name.substring(0, 10)}...` : name;
}

function getPlacementColor(placement: number): string {
    if (placement === 1) return "text-yellow-400";
    if (placement === 2) return "text-blue-400";
    if (placement === 3) return "text-orange-400";
    if (placement === 4) return "text-purple-400";
    return "text-gray-400";
}

function getTraitStyle(trait: Trait): string {
    // Style based on trait tier
    if (trait.style === 0) return "bg-gray-700 text-gray-400"; // Inactive
    if (trait.style === 1) return "bg-bronze text-white"; // Bronze
    if (trait.style === 2) return "bg-silver text-white"; // Silver
    if (trait.style === 3) return "bg-gold text-white"; // Gold
    if (trait.style === 4) return "bg-chromatic text-white"; // Chromatic
    return "bg-gray-700 text-gray-400";
}

function getUnitRarityClass(rarity: number): string {
    if (rarity === 0) return "text-gray-200"; // 1 cost
    if (rarity === 1) return "text-green-400"; // 2 cost
    if (rarity === 2) return "text-blue-400"; // 3 cost
    if (rarity === 3) return "text-purple-400"; // 4 cost
    if (rarity === 4) return "text-yellow-400"; // 5 cost
    if (rarity >= 5) return "text-orange-400"; // Legendary or special
    return "text-gray-200";
}

function getUnitRarityBackground(rarity: number): string {
    if (rarity === 0) return "bg-gray-600 text-white"; // 1 cost
    if (rarity === 1) return "bg-green-800 text-green-200"; // 2 cost
    if (rarity === 2) return "bg-blue-800 text-blue-200"; // 3 cost
    if (rarity === 3) return "bg-purple-800 text-purple-200"; // 4 cost
    if (rarity === 4) return "bg-yellow-800 text-yellow-200"; // 5 cost
    if (rarity >= 5) return "bg-orange-800 text-orange-200"; // Legendary or special
    return "bg-gray-600 text-white";
}

function getActiveTraits(participant: Participant): Trait[] {
    // Return only active traits (style > 0)
    return participant.traits
        .filter((trait) => trait.style > 0)
        .sort((a, b) => b.style - a.style); // Sort by style (highest first)
}

function getCoreUnits(units: Unit[]): Unit[] {
    // Sort units by tier and rarity to get the most important ones first
    return [...units].sort((a, b) => {
        // First sort by tier
        if (b.tier !== a.tier) return b.tier - a.tier;
        // Then by rarity
        return b.rarity - a.rarity;
    });
}

function selectParticipant(participant: Participant) {
    selectedParticipant.value = participant;
}

async function fetchAccountData(name: string, tagline: string) {
    loading.value = true;
    error.value = "";
    matches.value = [];
    fetchedMatches.value = [];
    selectedMatch.value = null;
    selectedParticipant.value = null;

    try {
        const data = await $fetch<AccountV1Response>(
            `/api/tft/account/${name}/${tagline}`,
        );

        accountData.value = data;
        currentGameName.value = data.gameName;
        currentTagLine.value = data.tagLine;

        await fetchMatchIds(data.puuid);
    } catch (err) {
        error.value =
            "Failed to fetch account data. Make sure the Riot ID is correct.";
        console.error("Error fetching account:", err);
    } finally {
        loading.value = false;
    }
}

async function handleSearch() {
    inputError.value = "";
    error.value = "";

    if (!gameNameInput.value.includes("#")) {
        inputError.value =
            "Please enter your Riot ID in the format: Name#Tagline";
        return;
    }

    const parts = gameNameInput.value.split("#");
    if (parts.length < 2 || parts[0].trim() === "" || parts[1].trim() === "") {
        inputError.value = "Please enter a valid Riot ID (Name#Tagline)";
        return;
    }

    const name = parts[0].trim();
    const tagline = parts.slice(1).join("#").trim();

    // Update the URL with the search parameters
    router.push({
        query: {
            name,
            tagline,
        },
    });

    await fetchAccountData(name, tagline);
}

async function fetchMatchIds(puuid: string) {
    if (!puuid) return;

    loadingMatches.value = true;

    try {
        const data = await $fetch<MatchIdList>(`/api/tft/matches/${puuid}`);
        matches.value = data;
    } catch (err) {
        error.value = "Failed to fetch match history.";
        console.error("Error fetching matches:", err);
    } finally {
        loadingMatches.value = false;
    }
}

async function loadMatchDetails(matchId: string) {
    // Check if we already fetched this match
    const existingMatch = fetchedMatches.value.find(
        (m) => m.metadata.match_id === matchId,
    );

    if (existingMatch) {
        selectedMatch.value = existingMatch;

        // Find current user in the participants
        if (accountData.value) {
            const userParticipant = existingMatch.info.participants.find(
                (p) => p.puuid === accountData.value?.puuid,
            );

            selectedParticipant.value = userParticipant || null;
        } else {
            selectedParticipant.value = null;
        }

        return;
    }

    loadingMatches.value = true;

    try {
        const matchData = await $fetch<MatchV1Response>(
            `/api/tft/match/${matchId}`,
        );
        fetchedMatches.value.push(matchData);
        selectedMatch.value = matchData;

        // Find current user in the participants
        if (accountData.value) {
            const userParticipant = matchData.info.participants.find(
                (p) => p.puuid === accountData.value?.puuid,
            );

            selectedParticipant.value = userParticipant || null;
        } else {
            selectedParticipant.value = null;
        }
    } catch (err) {
        error.value = `Failed to fetch match details for ${matchId}.`;
        console.error("Error fetching match:", err);
    } finally {
        loadingMatches.value = false;
    }
}
</script>

<style scoped>
.bg-bronze {
    background-color: #cd7f32;
}
.bg-silver {
    background-color: #a1b2c3;
}
.bg-gold {
    background-color: #ffd700;
}
.bg-chromatic {
    background: linear-gradient(
        90deg,
        #ff4d4d,
        #ffb74d,
        #ffed4d,
        #4dff4d,
        #4dffff,
        #4d4dff,
        #ff4dff
    );
}
</style>
