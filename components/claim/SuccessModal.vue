<template>
  <div class="success-modal">
    <h3 class="success-title">
      Congratulations! You have successfully submitted the claim transaction.
    </h3>
    <p class="success-desc">
      You need to wait until the transaction is included in a block to receive the tokens
    </p>
    <div class="button-group">
      <button class="share-btn" @click="openTxnUrl">
        View on Minascan
      </button>
      <button class="share-btn" @click="shareOnX">
        <svg class="x-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  txnUrl: string
}>();

const { shareOnX } = useWallet();


const openTxnUrl = () => {
  window.open(props.txnUrl, "_blank");
};
</script>

<style lang="scss" scoped>
.success-modal {
  text-align: center;
}

.success-title {
  color: var(--color-primary);
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  line-height: 1.5;
}

.success-desc {
  color: var(--color-text);
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    font-size: 0.938rem;
    margin-bottom: 1.5rem;
  }
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
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

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.875rem;
    font-size: 1rem;
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