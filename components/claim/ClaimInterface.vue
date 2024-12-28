<template>
  <div class="claim-interface">
    <div class="claim-content">
      <div class="claim-info">
        <span class="label">Amount to Claim</span>
        <span class="value">{{ appConfig.token.claimLimit.toLocaleString("en-US") }} {{ appConfig.token.symbol }}</span>
      </div>
      <button class="claim-btn" :class="{ 'wallet-not-connected': !appState.currAddress }"
        :disabled="appState.claimBtnDisabled" @click="$emit('claim')">
        Claim Tokens
      </button>
    </div>
    <div class="bottom-section">
      <div class="claim-notice">
        <p class="notice-text important">
          Only accounts that have never held {{ appConfig.token.symbol }} before are eligible to claim.
        </p>
        <p class="notice-text">
          Claiming {{ appConfig.token.symbol }} is completely free, but you need to pay:
        </p>
        <ul class="notice-list">
          <li>1 MINA for token account creation to receive tokens</li>
          <li>Small amount of MINA for transaction fees</li>
        </ul>
        <p class="notice-text">
          These fees are charged by the Mina network, not by us
        </p>
      </div>
      <button class="share-btn" @click="shareOnX">
        <svg class="x-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X (Twitter)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

defineEmits<{
  claim: []
}>();

const { appState } = useStatus();
const appConfig = useAppConfig();
const { shareOnX } = useWallet();

</script>

<style lang="scss" scoped>
.claim-interface {
  @include glass-card;
  padding: 1.5rem;
}

.claim-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba($color-primary, 0.1);
}

.claim-info {
  .label {
    display: block;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .value {
    font-family: var(--font-code);
    font-size: 1.25rem;
    color: var(--color-primary);
  }
}

.claim-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 1rem;
  cursor: pointer;
  transition: $transition-default;
  min-width: 160px;
  position: relative;

  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: $color-background;
    box-shadow:
      0 0 20px rgba($color-primary, 0.3),
      0 0 10px rgba($color-primary, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    border-color: rgba($color-primary, 0.5);
    color: rgba($color-primary, 0.5);
    backdrop-filter: blur(2px);
    background: rgba($color-background, 0.1);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg,
          transparent 0%,
          rgba(255, 255, 255, 0.05) 50%,
          transparent 100%);
      border-radius: inherit;
      pointer-events: none;
    }
  }

  &.wallet-not-connected {
    &:hover::after {
      content: 'Please connect wallet first';
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba($color-background, 0.95);
      color: var(--color-primary);
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      white-space: nowrap;
      pointer-events: none;
      border: 1px solid var(--color-primary);
      backdrop-filter: blur(8px);
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.15),
        0 0 1px rgba($color-primary, 0.3);
      z-index: 10;
      animation: tooltipFade 0.2s ease-out;

      @media (max-width: 640px) {
        width: calc(100% + 32px);
        white-space: normal;
        text-align: center;
        font-size: 0.8125rem;
        padding: 0.625rem;
        left: -16px;
        transform: none;
        bottom: calc(100% + 12px);
      }
    }

    &:hover::before {
      content: '';
      position: absolute;
      bottom: calc(100% + 4px);
      left: 50%;
      transform: translateX(-50%);
      border-width: 4px;
      border-style: solid;
      border-color: var(--color-primary) transparent transparent transparent;
      pointer-events: none;
      z-index: 10;

      @media (max-width: 640px) {
        left: 50%;
        bottom: calc(100% + 8px);
      }
    }
  }
}

@keyframes tooltipFade {
  from {
    opacity: 0;
    transform: translate(-50%, 4px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 640px) {
  @keyframes tooltipFade {
    from {
      opacity: 0;
      transform: translateY(4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
}

.claim-notice {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  flex: 1;

  .important {
    color: var(--color-primary);
    font-weight: 500;
    border-bottom: 1px solid rgba($color-primary, 0.1);
    padding-bottom: 0.75rem;
  }
}

.notice-text {
  margin-bottom: 0.75rem;
}

.notice-list {
  list-style: none;
  padding-left: 1rem;
  margin-bottom: 0.75rem;

  li {
    position: relative;
    margin-bottom: 0.5rem;

    &::before {
      content: '•';
      position: absolute;
      left: -1rem;
      color: var(--color-primary);
    }
  }
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 0.875rem;
  cursor: pointer;
  transition: $transition-default;
  white-space: nowrap;
  margin-top: 0.25rem;

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.875rem;
    font-size: 1rem;
    margin-top: 0;
  }

  &:hover {
    background: var(--color-primary);
    color: $color-background;
    box-shadow:
      0 0 20px rgba($color-primary, 0.3),
      0 0 10px rgba($color-primary, 0.2);
  }
}

.x-icon {
  width: 16px;
  height: 16px;

  @media (max-width: 640px) {
    width: 18px;
    height: 18px;
  }
}
</style>