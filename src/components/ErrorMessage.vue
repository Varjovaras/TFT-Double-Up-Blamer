<template>
    <div
        v-if="message"
        class="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6 w-full"
    >
        {{ message }}
    </div>
</template>

<script setup lang="ts">
defineProps({
    message: {
        type: String,
        default: "",
    },
});
</script>
