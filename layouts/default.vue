<template>
  <div class="app">
    <TheHeader />
    <main class="main-content">
      <NuxtPage />
    </main>
    <TheFooter />

  </div>
</template>

<style lang="scss">
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
</style>