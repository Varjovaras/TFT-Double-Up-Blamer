<template>
    <footer
        class="bg-gray-900 text-gray-400 py-8 mt-12 border-t border-gray-800"
    >
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Logo & Description -->
                <div class="col-span-1 md:col-span-2">
                    <div class="flex items-center mb-4">
                        <div
                            class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2"
                        >
                            <span class="text-sm font-bold">R</span>
                        </div>
                        <div class="text-lg font-bold tracking-wider">
                            <span class="text-blue-400">RITO</span>
                            <span class="text-purple-400">TFT</span>
                        </div>
                    </div>
                    <p class="text-sm">
                        Double Up Blamer lets you find the culprit why you
                        didn't go first in double up
                    </p>
                    <div class="flex space-x-4 mt-4">
                        <a
                            href="https://github.com/Varjovaras/TFT-Double-Up-Blamer"
                            class="text-gray-400 hover:text-blue-400 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <!-- <h3 class="text-white font-medium mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Home</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Leaderboards</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Player Search</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Meta Analysis</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Guides</a
                            >
                        </li>
                    </ul> -->
                </div>

                <!-- Resources -->
                <div>
                    <!-- <h3 class="text-white font-medium mb-4">Resources</h3>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >API Documentation</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Developer Portal</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Patch Notes</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Community Forum</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                >Support</a
                            >
                        </li>
                    </ul> -->
                </div>
            </div>

            <!-- Bottom Section -->
            <div class="border-t border-gray-800 mt-8 pt-6">
                <div
                    class="flex flex-col md:flex-row justify-between items-center"
                >
                    <div class="text-xs text-gray-500 mb-4 md:mb-0">
                        © 2023 Kristjan Rajaniemi. All rights reserved. This
                        site is not affiliated with or endorsed by Riot Games.
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- <a
                            href="#"
                            class="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                            >Privacy Policy</a
                        >
                        <span class="text-gray-600">•</span>
                        <a
                            href="#"
                            class="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                            >Terms of Service</a
                        >
                        <span class="text-gray-600">•</span>
                        <a
                            href="#"
                            class="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                            >Cookie Policy</a
                        > -->
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
