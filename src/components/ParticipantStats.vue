<template>
    <div v-if="participant" class="w-full">
        <h5 class="font-semibold mb-2 text-blue-400">Stats</h5>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Gold Left -->
            <div class="bg-gray-700 p-3 rounded-md">
                <div class="text-xs text-gray-400">Gold Left</div>
                <div class="font-bold text-yellow-400">
                    {{ participant.gold_left }}
                </div>
            </div>
            <!-- Damage Dealt -->
            <div class="bg-gray-700 p-3 rounded-md">
                <div class="text-xs text-gray-400">Damage Dealt</div>
                <div class="font-bold text-red-400">
                    {{ participant.total_damage_to_players }}
                </div>
            </div>
            <!-- Last Round -->
            <div class="bg-gray-700 p-3 rounded-md">
                <div class="text-xs text-gray-400">Last Round</div>
                <div class="font-bold text-blue-400">
                    {{ participant.last_round }}
                </div>
            </div>
            <!-- Outcome -->
            <div class="bg-gray-700 p-3 rounded-md">
                <div class="text-xs text-gray-400">Outcome</div>
                <div
                    class="font-bold"
                    :class="participant.win ? 'text-green-400' : 'text-red-400'"
                >
                    {{ participant.win ? "Victory" : "Defeat" }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Participant } from "~/utils/types";

defineProps<{
    participant: Participant | null; // Accept null or Participant object
}>();
</script>
