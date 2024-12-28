<template>
  <div class="airdrop-progress">
    <div class="progress-header">
      <h3>Airdrop Progress</h3>
      <div class="stats">
        <div class="stat-item">
          <span class="label">Claimed</span>
          <span class="value">{{ methods.formatNumber(state.claimedAmount) }} HTTPZ</span>
        </div>
        <div class="stat-item">
          <span class="label">Total</span>
          <span class="value">{{ methods.formatNumber(state.totalAmount) }} HTTPZ</span>
        </div>
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progressPercentage}%` }" />
      <span class="progress-text">{{ progressPercentage }}%</span>
    </div>

    <div class="additional-stats">
      <div class="stat-item">
        <span class="label">Participants</span>
        <span class="value">{{ methods.formatNumber(state.participantsCount) }}</span>
      </div>
      <div class="stat-item">
        <span class="label">Claim Limit</span>
        <span class="value">{{ methods.formatNumber(state.claimLimit) }} HTTPZ</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AirdropState {
  claimedAmount: number
  totalAmount: number
  participantsCount: number
  claimLimit: number
}

interface Methods {
  formatNumber: (num: number) => string
}

const state = ref<AirdropState>({
  claimedAmount: 8800000,
  totalAmount: 22000000,
  participantsCount: 4000,
  claimLimit: 2200
})

const methods = {
  formatNumber: (num: number): string => {
    return new Intl.NumberFormat().format(num)
  }
}

const progressPercentage = computed(() => {
  return Math.round((state.value.claimedAmount / state.value.totalAmount) * 100)
})
</script>

<style lang="scss" scoped>
.airdrop-progress {
  @include glass-card;
  padding: 1.5rem;
}

.progress-header {
  margin-bottom: 1.5rem;

  h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
}

.stats {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .label {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  .value {
    font-family: var(--font-code);
    font-size: 0.875rem;
  }

  &.participants .label::before,
  &.claim-limit .label::before {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
    font-size: 1.125rem;
    line-height: 20px;
    text-align: center;
    color: var(--color-primary);
  }

}

.progress-bar-container {
  position: relative;
  height: 8px;
  background: rgba($color-secondary, 0.5);
  border-radius: 4px;
  margin: 1.5rem 0;
  overflow: hidden;
}

.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -1.5rem;
  font-family: var(--font-code);
  font-size: 0.875rem;
  color: var(--color-primary);
}

.additional-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba($color-primary, 0.1);
}
</style>