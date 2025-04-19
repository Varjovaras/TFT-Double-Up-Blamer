<template>
    <div v-if="participant" class="bg-gray-800 p-4 rounded-md mb-6 w-full">
        <!-- Traits -->
        <h5 class="font-semibold mb-2 text-blue-400">Traits</h5>
        <div class="flex flex-wrap gap-2 mb-4">
            <span
                v-for="trait in sortedTraits"
                :key="trait.name"
                class="px-2 py-1 text-xs rounded-full"
                :class="getTraitStyle(trait)"
                :title="`${formatTraitName(trait.name)} (${trait.num_units}/${trait.tier_total})`"
            >
                {{ formatTraitName(trait.name) }}
                {{ trait.num_units }}
            </span>
        </div>

        <!-- Stats -->
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
            <!-- Placement -->
            <div class="bg-gray-700 p-3 rounded-md">
                <div class="text-xs text-gray-400">Placement</div>
                <div
                    class="font-bold"
                    :class="getPlacementColor(participant.placement)"
                >
                    {{ participant.placement }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Participant, Trait } from "~/utils/types";

const props = defineProps<{
    participant: Participant | null;
}>();

const sortedTraits = computed(() => {
    if (!props.participant?.traits) return [];
    return [...props.participant.traits].sort((a, b) => b.style - a.style);
});

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

function getPlacementColor(placement: number): string {
    if (placement === 1) return "text-yellow-400"; // Gold
    if (placement <= 4) return "text-blue-400"; // Top 4 (Blue)
    return "text-gray-400"; // Bottom 4
}
</script>

<style scoped>
.bg-bronze {
    background-color: #cd7f32; /* Standard bronze color */
}
.bg-silver {
    background-color: #a1b2c3; /* A representative silver color */
}
.bg-gold {
    background-color: #ffd700; /* Standard gold color */
}
.bg-chromatic {
    /* A vibrant gradient for prismatic/chromatic traits */
    background: linear-gradient(
        90deg,
        #ff4d4d,
        /* Red */ #ffb74d,
        /* Orange */ #ffed4d,
        /* Yellow */ #4dff4d,
        /* Green */ #4dffff,
        /* Cyan */ #4d4dff,
        /* Blue */ #ff4dff /* Magenta */
    );
    color: #1f2937; /* Dark text for contrast on bright gradient */
    font-weight: 600;
}
</style>
