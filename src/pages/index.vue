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
                @submit.prevent="fetchAccount"
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
        <div v-if="loading" class="flex justify-center my-8">
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

        <!-- Account information -->
        <div
            v-if="accountData && !loading"
            class="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
            <h2 class="text-2xl font-bold mb-4 text-blue-400">
                Account Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-700 p-4 rounded-md">
                    <div class="text-gray-400 text-sm mb-1">Riot ID</div>
                    <div class="text-xl font-medium">
                        {{ accountData.gameName }}#{{ accountData.tagLine }}
                    </div>
                </div>

                <div class="bg-gray-700 p-4 rounded-md">
                    <div class="text-gray-400 text-sm mb-1">PUUID</div>
                    <div class="text-sm font-mono break-all">
                        {{ accountData.puuid }}
                    </div>
                </div>
            </div>

            <button
                class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 transition-colors"
                :disabled="loadingMatches"
                @click="fetchMatches"
            >
                {{
                    loadingMatches ? "Loading Matches..." : "Get Match History"
                }}
            </button>

            <!-- Match history section -->
            <div v-if="matches.length > 0" class="mt-6">
                <h3 class="text-xl font-bold mb-3 text-purple-400">
                    Recent Matches
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
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { AccountV1Response, MatchIdList } from "~/utils/types";

const gameNameInput = ref("");
const tagLineInput = ref("");

const loading = ref(false);
const error = ref("");
const accountData = ref<AccountV1Response | null>(null);
const matches = ref<MatchIdList>([]);
const loadingMatches = ref(false);

async function fetchAccount() {
    if (!gameNameInput.value || !tagLineInput.value) return;

    loading.value = true;
    error.value = "";
    accountData.value = null;
    matches.value = [];

    try {
        const data = await $fetch<AccountV1Response>(
            `/api/tft/account/${gameNameInput.value}/${tagLineInput.value}`,
        );
        accountData.value = data;
    } catch (err) {
        error.value =
            "Failed to fetch account data. Make sure the Riot ID is correct.";
        console.error("Error fetching account:", err);
    } finally {
        loading.value = false;
    }
}

async function fetchMatches() {
    if (!accountData.value?.puuid) return;

    loadingMatches.value = true;

    try {
        const data = await $fetch<MatchIdList>(
            `/api/tft/matches/${accountData.value.puuid}`,
        );
        matches.value = data;
    } catch (err) {
        error.value = "Failed to fetch match history.";
        console.error("Error fetching matches:", err);
    } finally {
        loadingMatches.value = false;
    }
}
</script>
