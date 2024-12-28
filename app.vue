<script setup lang="ts">
const { toasts, remove } = useToast();
const appConfig = useAppConfig();
const config = useRuntimeConfig();

// Construct full URL for Twitter image
const twitterImageUrl = `${config.public.siteUrl}/images/banner.svg`;

useSeoMeta({
  title: appConfig.name,
  description: appConfig.description,
  twitterCard: 'summary_large_image',
  twitterSite: appConfig.twitterHandle,
  twitterTitle: appConfig.siteUrl,
  twitterDescription: appConfig.description,
  twitterImage: twitterImageUrl,
})
</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div class="toasts-container">
      <TransitionGroup name="toast">
        <Toast v-for="toast in toasts" :key="toast.id" :type="toast.type" :message="toast.message"
          :closable="toast.closable" @close="remove(toast.id)" />
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  background-color: $color-background;
  color: $color-text-primary;
  min-height: 100vh;
}

body {
  font-family: var(--font-body);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  background-color: $color-background;
}

.main-content {
  min-height: calc(100vh - 140px);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 1rem;
}

.toasts-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>