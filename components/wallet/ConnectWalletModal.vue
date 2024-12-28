<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Connect Wallet</h3>
        <button class="close-btn" @click="close">
          <span class="icon icon-close"></span>
        </button>
      </div>
      <div class="modal-body">
        <button class="wallet-option" @click="connectAuro">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="10" fill="#594AF1" />
            <path
              d="M50.0067 18.1C55.6467 18.1 60.5667 19.21 64.7667 21.43C68.9667 23.65 72.2067 26.95 74.4867 31.33C76.8267 35.65 77.9967 40.9 77.9967 47.08V82H66.2967V65.8H33.5367V82H22.0167V47.08C22.0167 40.9 23.1567 35.65 25.4367 31.33C27.7767 26.95 31.0467 23.65 35.2467 21.43C39.4467 19.21 44.3667 18.1 50.0067 18.1ZM66.2967 55.99V46C66.2967 40.18 64.8567 35.8 61.9767 32.86C59.0967 29.86 55.0767 28.36 49.9167 28.36C44.7567 28.36 40.7367 29.86 37.8567 32.86C34.9767 35.8 33.5367 40.18 33.5367 46V55.99H66.2967Z"
              fill="white" />
          </svg>
          <div class="wallet-info">
            <span class="wallet-name">Auro Wallet</span>
            <span class="wallet-desc">
              {{ isAuroInstalled ? 'Installed' : 'Click to install Auro Wallet' }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'connect'): void
}>()

const isAuroInstalled = ref(false)

onMounted(() => {
  isAuroInstalled.value = !!window.mina
})

const close = () => {
  emit('close')
}

const connectAuro = async () => {
  try {
    if (!window.mina) {
      window.open('https://www.aurowallet.com', '_blank')
      return
    }

    const accounts = await window.mina.requestAccounts()
    if (Array.isArray(accounts) && accounts.length > 0) {
      emit('connect')
      close()
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color-background, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: $color-secondary;
  border: 1px solid rgba($color-primary, 0.2);
  border-radius: $border-radius;
  width: 100%;
  max-width: 400px;
  box-shadow:
    0 0 20px rgba($color-secondary, 0.7),
    0 0 3px rgba($color-primary, 0.3);
  margin: auto;
  position: relative;
  transition: $transition-default;

  &:hover {
    border-color: rgba($color-text-primary, 0.4);
    box-shadow:
      0 0 30px rgba($color-secondary, 0.7),
      0 0 15px rgba($color-text-primary, 0.2),
      0 0 5px rgba($color-text-primary, 0.1),
      inset 0 0 3px rgba($color-text-primary, 0.1);
  }
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba($color-primary, 0.1);
}

.modal-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: $color-text-primary;
}

.close-btn {
  background: transparent;
  border: none;
  color: $color-text-secondary;
  cursor: pointer;
  padding: 0.5rem;
  transition: $transition-default;

  &:hover {
    color: $color-text-primary;
  }

  .icon {
    width: 20px;
    height: 20px;
  }
}

.modal-body {
  padding: 1.5rem;
}

.wallet-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: transparent;
  border: 1px solid rgba($color-primary, 0.2);
  border-radius: $border-radius;
  cursor: pointer;
  transition: $transition-default;

  &:hover {
    background: rgba($color-primary, 0.05);
    border-color: rgba($color-primary, 0.4);
    transform: translateY(-1px);
    box-shadow:
      0 0 20px rgba($color-primary, 0.1),
      0 0 5px rgba($color-primary, 0.1);
  }

  img {
    border-radius: $border-radius;
  }
}

.wallet-info {
  text-align: left;

  .wallet-name {
    display: block;
    color: $color-text-primary;
    font-family: var(--font-heading);
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .wallet-desc {
    display: block;
    color: $color-text-secondary;
    font-size: 0.875rem;
  }
}
</style>