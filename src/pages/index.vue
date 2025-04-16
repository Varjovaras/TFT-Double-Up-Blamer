<template>
    <div class="max-w-4xl mx-auto flex flex-col items-center">
        <h1
            class="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text inline-block"
        >
            TFT Double Up Blamer
        </h1>

        <div class="bg-gray-800 rounded-lg mx-auto p-6 mb-8 shadow-lg w-full">
            <form class="flex flex-col gap-3" @submit.prevent="handleSearch">
                <div class="flex-1">
                    <input
                        v-model="gameNameInput"
                        type="text"
                        placeholder="Game Name#Tagline"
                        class="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <p v-if="inputError" class="text-red-500 text-sm mt-1">
                    {{ inputError }}
                </p>
                <button
                    type="submit"
                    class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-md px-6 py-2 transition-all duration-200 transform hover:scale-105"
                    :disabled="loading"
                >
                    {{ loading ? "Loading..." : "Search" }}
                </button>
            </form>
        </div>

        <!-- Loading state -->
        <div v-if="loading || loadingMatches" class="flex justify-center my-8">
            <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
            />
        </div>

        <!-- Error message -->
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
                        @click="loadMatchDetails(matchId)"
                    >
                        {{ matchId }}
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
                                <th class="p-2 hidden md:table-cell">
                                    Last Round
                                </th>
                                <th class="p-2 rounded-tr">Composition</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="participant in sortedParticipants"
                                :key="participant.puuid"
                                :class="[
                                    'border-b border-gray-700 hover:bg-gray-700/50',
                                    participant.puuid === accountData?.puuid
                                        ? 'bg-blue-900/30'
                                        : '',
                                ]"
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
                                <td class="p-2 hidden md:table-cell">
                                    {{ participant.last_round }}
                                </td>
                                <td class="p-2">
                                    <div class="flex flex-wrap gap-1">
                                        <span
                                            v-for="trait in getActiveTraits(
                                                participant,
                                            )"
                                            :key="trait.name"
                                            class="px-1 text-xs rounded"
                                            :class="getTraitStyle(trait)"
                                        >
                                            {{ formatTraitName(trait.name) }}
                                            {{ trait.num_units }}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Participant detail view (conditionally show when a participant is selected) -->
            <div
                v-if="selectedParticipant"
                class="bg-gray-800 p-4 rounded-md mb-6"
            >
                <h4 class="text-lg font-bold mb-3 text-purple-400">
                    {{ selectedParticipant.riotIdGameName }}#{{
                        selectedParticipant.riotIdTagline
                    }}
                    - Placement: {{ selectedParticipant.placement }}
                </h4>

                <!-- Units display with items -->
                <div class="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                    <div
                        v-for="unit in selectedParticipant.units"
                        :key="unit.character_id"
                        class="bg-gray-700 p-2 rounded-md"
                    >
                        <div
                            class="font-medium mb-1"
                            :class="getUnitRarityClass(unit.rarity)"
                        >
                            {{ formatUnitName(unit.character_id) }}
                        </div>
                        <div class="text-xs text-yellow-500">
                            ★{{ unit.tier }}
                        </div>
                        <div class="flex flex-wrap gap-1 mt-1">
                            <div
                                v-for="(item, idx) in unit.itemNames"
                                :key="idx"
                                class="w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center"
                                :title="formatItemName(item)"
                            >
                                {{ idx + 1 }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Traits -->
                <div class="mb-4">
                    <h5 class="font-semibold mb-2">Traits</h5>
                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="trait in selectedParticipant.traits"
                            :key="trait.name"
                            class="px-2 py-1 text-xs rounded-full"
                            :class="getTraitStyle(trait)"
                        >
                            {{ formatTraitName(trait.name) }}
                            {{ trait.num_units }}/{{ trait.tier_total }}
                        </span>
                    </div>
                </div>

                <!-- Additional stats -->
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
                        <div class="text-xs text-gray-400">
                            Players Eliminated
                        </div>
                        <div class="font-bold text-purple-400">
                            {{ selectedParticipant.players_eliminated }}
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
    return puuid.substring(0, 8) + "..." + puuid.substring(puuid.length - 8);
}

function formatGameType(type: string): string {
    if (type === "standard") return "Ranked";
    if (type === "normal") return "Normal";
    if (type === "pairs") return "Double Up";
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
    const name = characterId.replace("TFT14_", "");
    return name;
}

function formatItemName(itemName: string): string {
    // Clean up item names for display
    let name = itemName.replace("TFT_Item_", "").replace("TFT14_Item_", "");
    // Insert spaces before capital letters
    name = name.replace(/([A-Z])/g, " $1").trim();
    return name;
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

function getActiveTraits(participant: Participant): Trait[] {
    // Return only active traits (style > 0)
    return participant.traits
        .filter((trait) => trait.style > 0)
        .sort((a, b) => b.style - a.style); // Sort by style (highest first)
}

async function fetchAccountData(name: string, tagline: string) {
    loading.value = true;
    error.value = "";
    matches.value = [];
    fetchedMatches.value = [];
    selectedMatch.value = null;

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
        selectedParticipant.value = null;
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

            if (userParticipant) {
                selectedParticipant.value = userParticipant;
            } else {
                selectedParticipant.value = null;
            }
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
