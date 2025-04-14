<template>
    <div class="hidden bg-gray-800 md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
            <NuxtLink to="/" class="mobile-nav-link">Home</NuxtLink>
            <NuxtLink to="/leaderboards" class="mobile-nav-link"
                >Leaderboards</NuxtLink
            >
            <NuxtLink to="/meta" class="mobile-nav-link"
                >Meta Analysis</NuxtLink
            >
            <NuxtLink to="/guides" class="mobile-nav-link">Guides</NuxtLink>
            <button
                class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-md px-4 py-2 mt-3"
            >
                Sign In
            </button>
        </div>
    </div>
</template>
