<script setup lang="ts">
interface Props {
  type: 'success' | 'error' | 'loading' | 'info'
  message: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closable: false
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="toast" :class="[type, { closable }]">
    <div class="content">
      <div v-if="type === 'loading'" class="loading-icon">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zM376.32 647.744a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.872-135.808a32 32 0 0 1 45.248 0z" />
        </svg>
      </div>
      <span class="message">{{ message }}</span>
    </div>
    <button v-if="closable" class="close-btn" @click="emit('close')">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M512 451.669333l211.2-211.2 60.330667 60.330667L572.330667 512l211.2 211.2-60.330667 60.330667L512 572.330667l-211.2 211.2-60.330667-60.330667L451.669333 512 240.469333 300.8 300.8 240.469333z" />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.85);
  animation: slideIn 0.3s ease-out forwards;
  backdrop-filter: blur(4px);

  &.closable {
    padding-right: 40px;
    pointer-events: auto;
  }

  &:not(.closable) {
    pointer-events: none;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &.success {
    box-shadow:
      0 0 4px rgba(74, 222, 128, 0.4),
      0 0 12px rgba(74, 222, 128, 0.3),
      0 0 24px rgba(74, 222, 128, 0.2);

    .message {
      color: #4ade80;
      text-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
    }
  }

  &.error {
    box-shadow:
      0 0 4px rgba(251, 113, 133, 0.4),
      0 0 12px rgba(251, 113, 133, 0.3),
      0 0 24px rgba(251, 113, 133, 0.2);

    .message {
      color: #fb7185;
      text-shadow: 0 0 8px rgba(251, 113, 133, 0.4);
    }
  }

  &.loading {
    box-shadow:
      0 0 4px rgba(96, 165, 250, 0.4),
      0 0 12px rgba(96, 165, 250, 0.3),
      0 0 24px rgba(96, 165, 250, 0.2);

    .message {
      color: #60a5fa;
      text-shadow: 0 0 8px rgba(96, 165, 250, 0.4);
    }
  }

  &.info {
    box-shadow:
      0 0 4px rgba(167, 139, 250, 0.4),
      0 0 12px rgba(167, 139, 250, 0.3),
      0 0 24px rgba(167, 139, 250, 0.2);

    .message {
      color: #a78bfa;
      text-shadow: 0 0 8px rgba(167, 139, 250, 0.4);
    }
  }

  .loading-icon {
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;

    svg {
      width: 100%;
      height: 100%;
      fill: #60a5fa;
    }
  }

  .close-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    color: rgba(255, 255, 255, 0.8);

    &:hover {
      opacity: 1;
    }

    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  }

  .message {
    display: inline-block;
  }
}

@keyframes slideIn {
  0% {
    transform: translate(-50%, -100%);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>