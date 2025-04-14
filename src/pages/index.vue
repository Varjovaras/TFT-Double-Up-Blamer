<template>
    <div class="max-w-4xl mx-auto">
        <h1
            class="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text inline-block"
        >
            TFT Account Lookup
        </h1>

        <div class="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
            <form
                class="flex flex-col md:flex-row gap-3"
                @submit.prevent="handleSearch"
            >
                <div class="flex-1">
                    <input
                        v-model="gameNameInput"
                        type="text"
                        placeholder="Game Name"
                        class="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div class="w-full md:w-32">
                    <input
                        v-model="tagLineInput"
                        type="text"
                        placeholder="Tagline"
                        class="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
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
            class="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6"
        >
            {{ error }}
        </div>

        <!-- Match history section -->
        <div v-if="matches.length > 0" class="mt-6">
            <h3 class="text-xl font-bold mb-3 text-purple-400">
                Recent Matches for {{ currentGameName }}#{{ currentTagLine }}
            </h3>
            <div class="bg-gray-700 p-4 rounded-md overflow-x-auto">
                <div class="text-sm font-mono">
                    <div
                        v-for="(match, index) in matches.slice(0, 10)"
                        :key="index"
                        class="py-1"
                    >
                        {{ match }}
                    </div>
                </div>
                <div class="text-gray-400 text-sm mt-2">
                    Showing 10 out of {{ matches.length }} matches
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { AccountV1Response, MatchIdList } from "~/utils/types";

const route = useRoute();
const router = useRouter();

const gameNameInput = ref("");
const tagLineInput = ref("");

const loading = ref(false);
const error = ref("");
const accountData = ref<AccountV1Response | null>(null);
const matches = ref<MatchIdList>([]);
const loadingMatches = ref(false);
const currentGameName = ref("");
const currentTagLine = ref("");

// Check URL parameters on load
onMounted(() => {
    const { name, tagline } = route.query;

    if (name && tagline) {
        gameNameInput.value = name as string;
        tagLineInput.value = tagline as string;
        handleSearch();
    }
});

async function handleSearch() {
    if (!gameNameInput.value || !tagLineInput.value) return;

    // Update the URL with the search parameters
    router.push({
        query: {
            name: gameNameInput.value,
            tagline: tagLineInput.value,
        },
    });

    loading.value = true;
    error.value = "";
    matches.value = [];

    try {
        const data = await $fetch<AccountV1Response>(
            `/api/tft/account/${gameNameInput.value}/${tagLineInput.value}`,
        );

        accountData.value = data;
        currentGameName.value = data.gameName;
        currentTagLine.value = data.tagLine;

        await fetchMatches(data.puuid);
    } catch (err) {
        error.value =
            "Failed to fetch account data. Make sure the Riot ID is correct.";
        console.error("Error fetching account:", err);
    } finally {
        loading.value = false;
    }
}

async function fetchMatches(puuid: string) {
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
</script>
