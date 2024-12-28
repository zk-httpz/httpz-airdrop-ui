<template>
  <div class="status-card">
    <div class="status-icon">
      <span class="icon icon-network"></span>
    </div>
    <div class="status-content">
      <h3 class="status-title">Network</h3>
      <p class="status-value">
      <div v-if="appState.networkConnected === null" class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span v-else>{{ appState.networkConnected ? "Connected" : "Offline" }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { appState } = useStatus();

</script>

<style lang="scss" scoped>
.status-card {
  @include glass-card;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border: 1px solid rgba($color-primary, 0.3);
  box-shadow:
    0 0 20px rgba($color-secondary, 0.7),
    0 0 3px rgba($color-primary, 0.3),
    inset 0 0 2px rgba($color-primary, 0.1);

  &:hover {
    border-color: rgba($color-glow, 0.4);
    box-shadow:
      0 0 20px rgba($color-secondary, 0.7),
      0 0 15px rgba($color-glow, 0.3),
      0 0 30px rgba($color-glow, 0.2),
      inset 0 0 3px rgba($color-glow, 0.1);
  }
}

.status-icon {
  color: var(--color-primary);

  .icon {
    width: 24px;
    height: 24px;
  }
}

.status-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.status-value {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.loading {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  width: 60px;
  height: 12px;
  margin-left: 8px;

  >span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    animation: pulse 1s ease-in-out infinite;
    box-shadow: 0 0 8px var(--color-primary);
    backdrop-filter: blur(4px);

    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.1}s;
      }
    }
  }
}

@keyframes pulse {
  0% {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 8px var(--color-primary);
  }

  50% {
    background: var(--color-primary);
    box-shadow: 0 0 16px var(--color-primary),
      0 0 24px var(--color-primary);
  }

  100% {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 8px var(--color-primary);
  }
}
</style>