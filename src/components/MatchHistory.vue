<template>
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
                    @click="emitLoadMatchDetails(matchId)"
                >
                    {{ getShortMatchId(matchId) }}
                </button>
            </div>
            <div class="text-gray-400 text-sm mt-2">
                Showing 20 out of {{ matches.length }} matches
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MatchIdList, MatchV1Response } from "~/utils/types";

defineProps<{
    matches: MatchIdList;
    currentGameName: string;
    currentTagLine: string;
    fetchedMatches: MatchV1Response[];
    loadingMatches: boolean;
    selectedMatch: MatchV1Response | null;
}>();

const emit = defineEmits<(e: "loadMatchDetails", matchId: string) => void>();

function getShortMatchId(matchId: string): string {
    // Format: EUW1_123456789 -> #123456...
    const parts = matchId.split("_");
    if (parts.length > 1) {
        return `#${parts[1].substring(0, 6)}...`;
    }
    return `${matchId.substring(0, 10)}...`;
}

function emitLoadMatchDetails(matchId: string) {
    emit("loadMatchDetails", matchId);
}
</script>
