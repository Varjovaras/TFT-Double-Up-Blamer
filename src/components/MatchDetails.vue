<!-- <template>
<div v-if="selectedMatch" class="w-full">
    <div class="bg-gray-800 p-4 rounded-md mb-6">
        <h3 class="text-xl font-bold mb-3 text-blue-400">
            Match Details
        </h3>

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
                            'border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer',
                            participant.puuid === accountData?.puuid
                                ? 'bg-blue-900/30'
                                : '',
                            selectedParticipant?.puuid ===
                            participant.puuid
                                ? 'bg-purple-900/30'
                                : '',
                        ]"
                        @click="selectParticipant(participant)"
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
                                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                    :class="
                                        getUnitRarityBackground(
                                            unit.rarity,
                                        )
                                    "
                                    :title="`${formatUnitName(unit.character_id)} (★${unit.tier})`"
                                >
                                    {{
                                        getUnitInitial(
                                            unit.character_id,
                                        )
                                    }}
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
</template> -->
