<template>
  <div class="token-info">
    <div class="token-header">
      <img src="/images/httpz-coin.svg" alt="$Httpz" width="48" height="48" class="token-logo" />
      <div class="token-details">
        <h3 class="token-name">{{ appConfig.token.name }} Token</h3>
        <p class="token-description">{{ appConfig.token.description }}</p>
      </div>
    </div>

    <div class="token-vision">
      <p class="vision-text">
        HTTPZ introduces a proof layer on top of HTTPS, enabling independent verification of data authenticity and
        source reliability. To celebrate this vision of a decentralized internet, we're launching $Httpz - a community
        token on Mina Protocol.
      </p>
    </div>

    <div class="token-stats">
      <div class="stat-item">
        <div class="stat-main">
          <span class="label">Total Supply:</span>
          <span class="value">{{ appConfig.token.maxSupply.toLocaleString("en-US") }} {{ appConfig.token.symbol
            }}</span>
        </div>
        <span class="note">(inspired by Mina's 22kb blockchain)</span>
      </div>
      <div class="stat-item">
        <div class="stat-main">
          <span class="label">Airdrop Share:</span>
          <span class="value">100%</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-main">
          <span class="label">Contract:</span>
          <code class="contract-address">{{ tokenContractAddress }}</code>
        </div>
        <button class="copy-btn" @click="copy(tokenContractAddress)">
          <span class="icon icon-copy"></span>
        </button>
      </div>
      <div class="stat-item">
        <div class="stat-main">
          <span class="label">Token ID:</span>
          <code class="contract-address">{{ tokenId }}</code>
        </div>
        <button class="copy-btn" @click="copy(tokenId)">
          <span class="icon icon-copy"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const config = useRuntimeConfig();
const appConfig = useAppConfig();

const tokenContractAddress = config.public.tokenContractAddress;
const tokenId = config.public.tokenId;

const copy = (str: string) => {
  navigator.clipboard.writeText(str);
};
</script>

<style lang="scss" scoped>
.token-info {
  @include glass-card;
  padding: 1rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
}

.token-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (min-width: 640px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
}

.token-logo {
  width: 40px;
  height: 40px;

  @media (min-width: 640px) {
    width: 48px;
    height: 48px;
  }
}

.token-details {
  flex: 1;
  min-width: 0; // Prevent text overflow
}

.token-name {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  margin-bottom: 0.375rem;

  @media (min-width: 640px) {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
}

.token-description {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
}

.token-vision {
  margin-bottom: 1.25rem;

  @media (min-width: 640px) {
    margin-bottom: 1.5rem;
  }

  .vision-text {
    color: var(--color-text-secondary);
    font-size: 0.8125rem;
    line-height: 1.5;

    @media (min-width: 640px) {
      font-size: 0.875rem;
    }
  }
}

.token-stats {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  @media (min-width: 640px) {
    gap: 1rem;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
}

.stat-main {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;

  @media (min-width: 640px) {
    gap: 0.5rem;
  }
}

.label {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
}

.value {
  font-family: var(--font-code);
  font-size: 0.8125rem;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
}

.note {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  opacity: 0.8;
}

.contract-address {
  font-family: var(--font-code);
  font-size: 0.8125rem;
  padding: 0.25rem 0.375rem;
  background: rgba($color-secondary, 0.5);
  border-radius: var(--border-radius);
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 640px) {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }
}

.copy-btn {
  padding: 0.25rem;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: $transition-default;
  align-self: flex-start;

  &:hover {
    color: var(--color-primary);
  }

  .icon {
    width: 14px;
    height: 14px;

    @media (min-width: 640px) {
      width: 16px;
      height: 16px;
    }
  }
}
</style>