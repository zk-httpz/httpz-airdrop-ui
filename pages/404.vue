<template>
  <div class="page-error">
    <div class="error-content">
      <h1 class="error-title">404</h1>
      <p class="error-message">Page not found</p>
      <NuxtLink to="/" class="btn btn-primary">
        <Icon name="mdi:home" />
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.error-content {
  @include glass-card;
  padding: 3rem;
}

.error-title {
  @include neon-text;
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}
</style> 