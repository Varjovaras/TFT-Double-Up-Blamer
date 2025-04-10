<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8 text-center">
            Rito TFT Stats Tracker
        </h1>

        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="mb-4">
                <label
                    for="playerName"
                    class="block text-sm font-medium text-gray-700"
                    >Player Name</label
                >
                <input
                    id="playerName"
                    v-model="playerName"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter player name"
                />
            </div>

            <div class="mb-6">
                <label
                    for="tagLine"
                    class="block text-sm font-medium text-gray-700"
                    >Tag Line</label
                >
                <input
                    id="tagLine"
                    v-model="tagLine"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 6969"
                />
            </div>

            <button
                @click="fetchPlayerData"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
                :disabled="isLoading"
            >
                {{ isLoading ? "Loading..." : "Search Player" }}
            </button>
        </div>

        <!-- Error message -->
        <div
            v-if="error"
            class="max-w-md mx-auto mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
            {{ error }}
        </div>

        <!-- Player Info Card -->
        <div
            v-if="player"
            class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8"
        >
            <h2 class="text-xl font-semibold mb-4">Player Information</h2>
            <div class="mb-4">
                <span class="font-medium">Name:</span>
                {{ formatPlayerName(player.name, player.tagLine) }}
            </div>
            <div class="mb-4">
                <span class="font-medium">PUUID:</span>
                <span class="break-all">{{ player.puuid }}</span>
            </div>

            <button
                @click="fetchMatchHistory"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 mb-4"
                :disabled="isLoadingMatches"
            >
                {{
                    isLoadingMatches
                        ? "Loading Matches..."
                        : "Load Match History"
                }}
            </button>

            <!-- The match history would be added here -->
            <div
                v-if="showMatchPlaceholder"
                class="text-center text-gray-500 italic"
            >
                Match history feature coming soon!
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { formatPlayerName, fetchPlayerPUUID } from "~/components/utils";
import type { Player } from "~/components/types";

// Form state
const playerName = ref("");
const tagLine = ref("");
const player = ref<Player | null>(null);
const error = ref<string | null>(null);
const isLoading = ref(false);
const isLoadingMatches = ref(false);
const showMatchPlaceholder = ref(false);

/**
 * Search for a player by name and tagline
 */
async function fetchPlayerData() {
    if (!playerName.value || !tagLine.value) {
        error.value = "Please enter both player name and tag line";
        return;
    }

    error.value = null;
    isLoading.value = true;

    try {
        const puuid = await fetchPlayerPUUID(playerName.value, tagLine.value);
        player.value = {
            puuid,
            name: playerName.value,
            tagLine: tagLine.value,
        };
    } catch (err) {
        console.error("Error fetching player data:", err);
        error.value =
            err instanceof Error ? err.message : "Failed to find player";
    } finally {
        isLoading.value = false;
    }
}

/**
 * Placeholder for match history feature
 */
function fetchMatchHistory() {
    isLoadingMatches.value = true;

    // Simulate API call
    setTimeout(() => {
        showMatchPlaceholder.value = true;
        isLoadingMatches.value = false;
    }, 1500);
}
</script>
