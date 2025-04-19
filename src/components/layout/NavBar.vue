<template>
    <nav class="border-b border-gray-700 bg-gray-800 backdrop-blur-sm sticky top-0 z-50">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <div class="flex items-center">
                    <NuxtLink to="/" class="flex items-center" @click.native.prevent="navigateToHome">
                        <div class="text-xl font-bold tracking-wider">
                            <span
                                class="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text inline-block">
                                DOUBLE UP BLAMER
                            </span>
                        </div>
                    </NuxtLink>
                </div>

                <!-- Navigation Links -->
                <div class="hidden md:flex space-x-6">
                    <NuxtLink to="/" class="nav-link">Home</NuxtLink>
                </div>

                <!-- User Menu / Actions -->
                <div class="flex items-center space-x-4">
                    <button class="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>

                    <button class="p-2 rounded-full hover:bg-gray-700 transition-colors md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>

                    <button
                        class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-md px-4 py-2 hidden md:block transition-all duration-200 transform hover:scale-105">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToHome = () => {
    router.push({ path: '/' }).then(() => {
        window.location.reload();
    });
};
</script>
