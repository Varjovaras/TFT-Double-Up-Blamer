<template>
    <div v-if="selectedMatch" class="w-full">
        <div class="bg-gray-800 p-4 rounded-md mb-6">
            <h3 class="text-xl font-bold mb-3 text-blue-400">Match Details</h3>

            <!-- General Match Info -->
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

            <!-- Participants Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-700 text-left">
                            <th class="p-2 rounded-tl">Placement</th>
                            <th class="p-2">Player</th>
                            <th class="p-2 hidden md:table-cell">Level</th>
                            <th class="p-2">Composition</th>
                            <th class="p-2 rounded-tr">Champions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="participant in sortedParticipants"
                            :key="participant.puuid"
                            :class="[
                                'border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors',
                                participant.puuid === accountData?.puuid
                                    ? 'bg-blue-900/30'
                                    : '',
                                selectedParticipant?.puuid === participant.puuid
                                    ? 'bg-purple-900/30'
                                    : '',
                            ]"
                            @click="emitSelectParticipant(participant)"
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
                            <td class="p-2">
                                <div class="flex flex-wrap gap-1">
                                    <span
                                        v-for="trait in getActiveTraits(
                                            participant,
                                        ).slice(0, 3)"
                                        :key="trait.name"
                                        class="px-1 text-xs rounded"
                                        :class="getTraitStyle(trait)"
                                        :title="formatTraitName(trait.name)"
                                    >
                                        {{ formatTraitName(trait.name) }}
                                        {{ trait.num_units }}
                                    </span>
                                    <span
                                        v-if="
                                            getActiveTraits(participant)
                                                .length > 3
                                        "
                                        class="text-xs text-gray-400"
                                    >
                                        +{{
                                            getActiveTraits(participant)
                                                .length - 3
                                        }}
                                        more
                                    </span>
                                </div>
                            </td>
                            <td class="p-2">
                                <div class="flex flex-wrap gap-1">
                                    <div
                                        v-for="unit in getCoreUnits(
                                            participant.units,
                                        ).slice(0, 5)"
                                        :key="unit.character_id"
                                        class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                                        :class="
                                            getUnitRarityBackground(unit.rarity)
                                        "
                                        :title="`${formatUnitName(unit.character_id)} (★${unit.tier})`"
                                    >
                                        {{ getUnitInitial(unit.character_id) }}
                                    </div>
                                    <span
                                        v-if="participant.units.length > 5"
                                        class="text-xs text-gray-400 flex items-center"
                                    >
                                        +{{ participant.units.length - 5 }}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
    AccountV1Response,
    MatchV1Response,
    Participant,
    Trait,
    Unit,
} from "~/utils/types";
import { formatGameType } from "~/utils/utils";

const props = defineProps<{
    selectedMatch: MatchV1Response | null;
    accountData: AccountV1Response | null;
    selectedParticipant: Participant | null;
}>();

console.log(props.selectedMatch?.info.tft_game_type);
const emit =
    defineEmits<(e: "selectParticipant", participant: Participant) => void>();

const sortedParticipants = computed(() => {
    if (!props.selectedMatch) return [];
    // Ensure participants array exists and is an array before sorting
    const participants = props.selectedMatch.info?.participants;
    if (!Array.isArray(participants)) return [];
    return [...participants].sort((a, b) => a.placement - b.placement);
});

function emitSelectParticipant(participant: Participant) {
    emit("selectParticipant", participant);
}

function formatDate(timestamp: number): string {
    if (!timestamp) return "Invalid Date";
    try {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date";
    }
}

function formatDuration(seconds: number): string {
    if (typeof seconds !== "number" || Number.isNaN(seconds) || seconds < 0)
        return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatTraitName(traitName: string): string {
    if (!traitName) return "";
    // Remove Set prefix (e.g., Set11_, TFT14_) and potential suffixes like _Trait
    let name = traitName
        .replace(/^(Set\d{1,2}_|TFT\d{1,2}_)/, "")
        .replace(/_Trait$/, "");
    // Insert spaces before capital letters for camelCase names
    name = name.replace(/([A-Z])/g, " $1").trim();
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function formatUnitName(characterId: string): string {
    if (!characterId) return "";
    // Remove Set prefix (e.g., TFT14_)
    let name = characterId.replace(/^(Set\d{1,2}_|TFT\d{1,2}_)/, "");
    // Handle special forms like NidaleeCougar by inserting space
    name = name.replace(/([A-Z][a-z]+)/g, " $1").trim();
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getUnitInitial(characterId: string): string {
    if (!characterId) return "?";
    const name = characterId.replace(/^(Set\d{1,2}_|TFT\d{1,2}_)/, "");
    return name.charAt(0).toUpperCase();
}

function getPlacementColor(placement: number): string {
    if (placement === 1) return "text-yellow-400"; // Gold
    if (placement <= 4) return "text-blue-400"; // Top 4 (Blue)
    return "text-gray-400"; // Bottom 4
}

function getTraitStyle(trait: Trait): string {
    // Style based on trait tier (style property)
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

function getUnitRarityBackground(rarity: number): string {
    // Background color based on unit cost (rarity field)
    switch (rarity) {
        case 0:
            return "bg-gray-600 text-white"; // 1 cost (Common)
        case 1:
            return "bg-green-800 text-green-200"; // 2 cost (Uncommon)
        case 2:
            return "bg-blue-800 text-blue-200"; // 3 cost (Rare)
        case 3:
            return "bg-purple-800 text-purple-200"; // 4 cost (Epic)
        case 4:
            return "bg-yellow-800 text-yellow-200"; // 5 cost (Legendary)
        case 5: // Often used for special units or higher costs in some sets
        case 6:
        case 7:
            return "bg-orange-800 text-orange-200"; // Higher/Special Tier
        default:
            return "bg-gray-600 text-white"; // Default/Unknown
    }
}

function getActiveTraits(participant: Participant): Trait[] {
    if (!participant?.traits) return [];
    // Return only active traits (style > 0)
    return participant.traits
        .filter((trait) => trait.style > 0)
        .sort((a, b) => b.style - a.style || b.num_units - a.num_units); // Sort by style (highest first), then by unit count
}

function getCoreUnits(units: Unit[]): Unit[] {
    if (!Array.isArray(units)) return [];
    // Sort units by tier (star level) and then rarity (cost) to show most impactful units first
    return [...units].sort((a, b) => {
        // Primary sort: Tier (descending)
        if (b.tier !== a.tier) return b.tier - a.tier;
        // Secondary sort: Rarity (descending)
        return b.rarity - a.rarity;
    });
}
</script>

<style scoped>
/* Add custom styles if needed, e.g., for trait colors */
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
