<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
    >
        <LayoutNavBar />
        <!-- mobile menu only shown on mobile devices -->
        <LayoutMobileMenu />

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <slot />
        </main>

        <LayoutFooter />
    </div>
</template>
