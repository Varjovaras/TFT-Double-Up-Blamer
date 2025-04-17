<template>
    <div class="bg-gray-800 rounded-lg mx-auto p-6 shadow-lg w-full">
        <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
            <div class="flex-1">
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <input
                    v-model="inputValue"
                    type="text"
                    placeholder="Gamename#Tagline"
                    class="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <p v-if="error" class="text-red-500 text-sm mt-1">
                {{ error }}
            </p>
            <button
                type="submit"
                class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-md px-6 py-2 transition-all duration-200 transform hover:scale-105"
                :disabled="isLoading"
            >
                {{ isLoading ? "Loading..." : buttonText }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
    buttonText: {
        type: String,
        default: "Search",
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: "",
    },
    modelValue: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const inputValue = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newValue) => {
        inputValue.value = newValue;
    },
);

// Update the parent's model value when input changes
watch(inputValue, (newValue) => {
    emit("update:modelValue", newValue);
});

function onSubmit() {
    emit("submit", inputValue.value);
}
</script>
