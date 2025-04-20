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
        <ParticipantInfo :participant="selectedParticipant" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
    AccountV1Response,
    MatchIdList,
    MatchV1Response,
    Participant,
    DoubleUpResponse,
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
        fetchDoubleUpData(name as string, tagline as string);
    }
});

// Fetch Double Up data directly from our new endpoint
async function fetchDoubleUpData(name: string, tagline: string) {
    loading.value = true;
    error.value = "";
    matches.value = [];
    fetchedMatches.value = [];
    selectedMatch.value = null;
    selectedParticipant.value = null;

    try {
        // Use the new endpoint that returns filtered Double Up matches
        const data = await $fetch<DoubleUpResponse>(
            `/api/tft/double_up/${name}/${tagline}`,
        );

        accountData.value = data.account;
        currentGameName.value = data.account.gameName;
        currentTagLine.value = data.account.tagLine;

        // Store fetched match data
        fetchedMatches.value = data.matches;

        // Extract match IDs for the MatchHistory component
        matches.value = data.matches.map((match) => match.metadata.match_id);

        // Automatically select the first match if available
        if (data.matches.length > 0) {
            selectedMatch.value = data.matches[0];
            selectSearchedPlayerInMatch(data.matches[0]);
        }
    } catch (err) {
        error.value =
            "Failed to fetch Double Up match data. Make sure the Riot ID is correct.";
        console.error("Error fetching Double Up data:", err);
        accountData.value = null;
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

    await fetchDoubleUpData(name, tagline);
}

async function loadMatchDetails(matchId: string) {
    // Since we already have all the match data, no need to fetch it again
    const existingMatch = fetchedMatches.value.find(
        (m) => m.metadata.match_id === matchId,
    );

    if (existingMatch) {
        selectedMatch.value = existingMatch;
        // Automatically select the searched player if they are in the match
        selectSearchedPlayerInMatch(existingMatch);
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
