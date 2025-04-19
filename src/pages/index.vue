<template>
    <div class="max-w-4xl mx-auto flex flex-col items-center">
        <LayoutHeader />
        <SearchForm
            v-model="gameNameInput"
            :error="inputError"
            :is-loading="loading"
            class="mb-8"
            @submit="handleSearch"
        />
        <LoadingSpinner v-if="loading || loadingMatches" />
        <ErrorMessage :message="error" />
        <AccountInfo v-if="accountData" :account-data="accountData" />
        <MatchHistory
            v-if="matches.length > 0"
            :matches="matches"
            :current-game-name="currentGameName"
            :current-tag-line="currentTagLine"
            :fetched-matches="fetchedMatches"
            :loading-matches="loadingMatches"
            :selected-match="selectedMatch"
            @load-match-details="loadMatchDetails"
        />

        <MatchDetails
            :selected-match="selectedMatch"
            :account-data="accountData"
            :selected-participant="selectedParticipant"
        />

        <!-- Participant detail view -->
        <div v-if="selectedParticipant" class="bg-gray-800 p-4 rounded-md mb-6">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AccountInfo from "~/components/AccountInfo.vue";
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
        console.log("läälää");
        console.log(data);
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
