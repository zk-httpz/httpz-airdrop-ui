<template>
  <header class="header">
    <div class="container header-container">
      <div class="logo">
        <img src="/images/httpz-logo.svg" alt="HTTPZ" width="32" height="32" />
        <!-- <span class="logo-text">HTTPZ</span> -->
      </div>
      <div class="system-status">
        Mina Mainnet
      </div>

      <!-- Desktop Navigation -->
      <nav class="navigation desktop-nav">
        <a href="https://github.com/zk-httpz/mina-httpz-token" target="_blank" rel="noopener noreferrer"
          class="nav-item">
          <span class="icon icon-github"></span>
          Github
        </a>
        <button class="nav-item" @click="openSettings">
          <span class="icon icon-settings"></span>
          Settings
        </button>

        <!-- Wallet Button -->
        <div class="wallet-wrapper" v-click-outside="closeWalletMenu">
          <button v-if="appState.currAddress === null" class="nav-item" @click="openModal">
            <span class="icon icon-wallet"></span>
            Connect Wallet
          </button>
          <button v-else class="nav-item" @click.stop="toggleWalletMenu">
            <span class="icon icon-wallet"></span>
            {{ shortAddress }}
          </button>

          <!-- Wallet Dropdown Menu -->
          <div v-if="appState.currAddress !== null" class="wallet-dropdown" :class="{ active: isWalletMenuOpen }">
            <button class="dropdown-item" @click="disconnectWallet">
              Disconnect
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" v-click-outside="closeMenu">
        <button class="menu-trigger" @click="toggleMenu">
          <span class="icon icon-menu"></span>
        </button>
        <div class="dropdown-menu" :class="{ active: isMenuOpen }">
          <a href="https://github.com/zk-httpz/mina-httpz-token" target="_blank" rel="noopener noreferrer"
            class="nav-item">
            <span class="icon icon-github"></span>
            Github
          </a>
          <button class="nav-item" @click="openSettings">
            <span class="icon icon-settings"></span>
            Settings
          </button>
          <button v-if="appState.currAddress === null" class="nav-item" @click="openModal">
            <span class="icon icon-wallet"></span>
            Connect Wallet
          </button>
          <button v-else class="nav-item" @click="disconnectWallet">
            <span class="icon icon-wallet"></span>
            {{ shortAddress }}
          </button>
        </div>
      </div>
    </div>

    <!-- RPC Settings Modal -->
    <RpcSettings :is-open="isSettingsOpen" @close="closeSettings" @save="saveRpcSettings" />
    <ConnectWalletModal :is-open="isModalOpen" @close="closeModal" @connect="connectWallet" />
  </header>
</template>

<script setup lang="ts">

const vClickOutside = {
  mounted(el: any, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };

    document.addEventListener('click', el._clickOutside);
  },

  unmounted(el: any) {
    document.removeEventListener('click', el._clickOutside);
  }
};

const isMenuOpen = ref(false);
const isSettingsOpen = ref(false);
const isWalletMenuOpen = ref(false);

const {
  isModalOpen,
  openModal,
  closeModal,
  connectWallet,
  disconnectWallet
} = useWallet();

const { appState, setMinaEndpoint } = useStatus();
const { updateZkappEndpoint, updateSystemStatus } = useToken();
const { error: showError, success } = useToast();

const shortAddress = computed(() => {
  if (appState.value.currAddress === null) return ''
  return `${appState.value.currAddress.slice(0, 6)}...${appState.value.currAddress.slice(-4)}`;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  isWalletMenuOpen.value = false;
};

const closeMenu = () => {
  isMenuOpen.value = false;
  isWalletMenuOpen.value = false;
};

const toggleWalletMenu = () => {
  isWalletMenuOpen.value = !isWalletMenuOpen.value;
};

const openSettings = () => {
  isSettingsOpen.value = true;
  closeMenu();
};

const closeSettings = () => {
  isSettingsOpen.value = false;
}

const saveRpcSettings = async (endpoint: string) => {
  console.log('New RPC endpoint:', endpoint);
  try {
    setMinaEndpoint(endpoint);
    await updateZkappEndpoint(endpoint);
    success('RPC endpoint updated successfully');
    await updateSystemStatus();
    console.log('updateZkappEndpoint done');
  } catch (error) {
    console.error('Error updating zkapp endpoint:', error);
    showError('Failed to update RPC endpoint. Please try again.');
  }
}

const closeWalletMenu = () => {
  isWalletMenuOpen.value = false;
};
</script>

<style lang="scss" scoped>
.header {
  padding: 1rem 0;
  border-bottom: 1px solid rgba($color-primary, 0.2);
  background: rgba($color-background, 0.95);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-right: 3.5rem;

  img {
    transform: scale(3);
    transform-origin: left center;
  }

  .logo-text {
    @include neon-text;
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.system-status {
  @include neon-text;
  font-family: var(--font-code);
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.navigation {
  display: flex;
  gap: 1rem;
  margin-left: auto;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: $border-radius;
    color: $color-text-primary;
    font-family: var(--font-heading);
    font-size: 0.875rem;
    cursor: pointer;
    transition: $transition-default;
    text-decoration: none;

    &:hover {
      color: var(--color-primary);
      border-color: rgba($color-primary, 0.2);
      background: rgba($color-primary, 0.05);
    }

    .icon {
      width: 18px;
      height: 18px;
    }
  }
}

.desktop-nav {
  @media (max-width: 768px) {
    display: none;
  }
}

.mobile-nav {
  display: none;
  position: relative;
  margin-left: auto;

  @media (max-width: 768px) {
    display: block;
  }
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: $border-radius;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: $transition-default;

  &:hover {
    color: var(--color-primary);
    border-color: rgba($color-primary, 0.2);
    background: rgba($color-primary, 0.05);
  }

  .icon {
    width: 24px;
    height: 24px;
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: $color-secondary;
  border: 1px solid rgba($color-primary, 0.2);
  border-radius: $border-radius;
  padding: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow:
    0 0 20px rgba($color-secondary, 0.7),
    0 0 3px rgba($color-primary, 0.3);

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .nav-item {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: $border-radius;
    color: $color-text-primary;
    font-family: var(--font-heading);
    font-size: 0.875rem;
    cursor: pointer;
    transition: $transition-default;
    margin: 0.25rem 0;

    &:hover {
      color: var(--color-primary);
      border-color: rgba($color-primary, 0.2);
      background: rgba($color-primary, 0.05);
    }

    .icon {
      width: 18px;
      height: 18px;
    }

    &:not(:last-child) {
      margin-bottom: 0.25rem;
    }
  }
}

.wallet-wrapper {
  position: relative;
}

.wallet-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 160px;
  background: $color-secondary;
  border: 1px solid rgba($color-primary, 0.2);
  border-radius: $border-radius;
  padding: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow:
    0 0 20px rgba($color-secondary, 0.7),
    0 0 3px rgba($color-primary, 0.3);

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.dropdown-item {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: $border-radius;
  color: $color-text-primary;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  cursor: pointer;
  transition: $transition-default;

  &:hover {
    color: var(--color-primary);
    border-color: rgba($color-primary, 0.2);
    background: rgba($color-primary, 0.05);
  }
}
</style>