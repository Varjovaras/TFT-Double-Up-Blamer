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
            @select-participant="handleSelectParticipant"
        />

        <!-- Participant detail view -->
        <div
            v-if="selectedParticipant"
            class="bg-gray-800 p-4 rounded-md mb-6 w-full"
        >
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

            <!-- Use the new ParticipantStats component -->
            <ParticipantStats :participant="selectedParticipant" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AccountInfo from "~/components/AccountInfo.vue";
// Import the new component
import ParticipantStats from "~/components/ParticipantStats.vue";
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

// --- Utility Functions (keep relevant ones) ---

function formatTraitName(traitName: string): string {
    if (!traitName) return "";
    let name = traitName
        .replace(/^(Set\d{1,2}_|TFT\d{1,2}_)/, "")
        .replace(/_Trait$/, "");
    name = name.replace(/([A-Z])/g, " $1").trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getTraitStyle(trait: Trait): string {
    switch (trait.style) {
        case 0:
            return "bg-gray-700 text-gray-400"; // Inactive
        case 1:
            return "bg-bronze text-white"; // Bronze
        case 2:
            return "bg-silver text-white"; // Silver
        case 3:
            return "bg-gold text-white"; // Gold
        case 4:
            return "bg-chromatic text-white"; // Prismatic/Chromatic
        default:
            return "bg-gray-700 text-gray-400";
    }
}

// --- API Fetching Logic ---

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
        accountData.value = null; // Clear potentially stale data
        matches.value = [];
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
    matches.value = []; // Clear previous matches

    try {
        const data = await $fetch<MatchIdList>(`/api/tft/matches/${puuid}`);
        matches.value = data;
    } catch (err) {
        error.value = "Failed to fetch match history.";
        console.error("Error fetching matches:", err);
        matches.value = []; // Ensure matches are empty on error
    } finally {
        loadingMatches.value = false;
    }
}

async function loadMatchDetails(matchId: string) {
    // Clear previous selection when loading a new match
    selectedParticipant.value = null;

    // Check if we already fetched this match
    const existingMatch = fetchedMatches.value.find(
        (m) => m.metadata.match_id === matchId,
    );

    if (existingMatch) {
        selectedMatch.value = existingMatch;
        // Automatically select the searched player if they are in the match
        selectSearchedPlayerInMatch(existingMatch);
        return;
    }

    loadingMatches.value = true;
    selectedMatch.value = null; // Clear selected match while loading

    try {
        const matchData = await $fetch<MatchV1Response>(
            `/api/tft/match/${matchId}`,
        );
        // Add to cache only if fetch was successful
        fetchedMatches.value.push(matchData);
        selectedMatch.value = matchData;
        // Automatically select the searched player if they are in the match
        selectSearchedPlayerInMatch(matchData);
    } catch (err) {
        error.value = `Failed to fetch match details for ${matchId}.`;
        console.error("Error fetching match:", err);
        selectedMatch.value = null; // Clear match on error
    } finally {
        loadingMatches.value = false;
    }
}

// Function to handle participant selection from MatchDetails component
function handleSelectParticipant(participant: Participant) {
    selectedParticipant.value = participant;
}

// Helper to find and select the participant matching the searched account
function selectSearchedPlayerInMatch(matchData: MatchV1Response) {
    if (accountData.value && matchData?.info?.participants) {
        const userParticipant = matchData.info.participants.find(
            (p) => p.puuid === accountData.value?.puuid,
        );
        selectedParticipant.value = userParticipant || null;
    } else {
        selectedParticipant.value = null;
    }
}
</script>

<style scoped>
/* Keep existing styles */
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
    color: #1f2937; /* Dark text for contrast */
    font-weight: 600;
}
</style>
