<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex flex-col"
    >
        <LayoutNavBar />
        <!-- mobile menu only shown on mobile devices -->
        <LayoutMobileMenu />

        <main class="container mx-auto px-4 py-8 flex-grow">
            <slot />
        </main>

        <LayoutFooter />
    </div>
</template>
