<template>
    <div v-if="accountData" class="w-full mb-8">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-2 text-blue-400">
                Account Information
            </h2>
            <div class="flex items-center">
                <div class="bg-gray-700 p-3 rounded-lg inline-flex mr-4">
                    <span class="text-2xl">👤</span>
                </div>
                <div>
                    <p class="text-xl font-semibold">
                        {{ accountData.gameName }}#{{ accountData.tagLine }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    accountData: AccountV1Response | null
}>();
</script>
