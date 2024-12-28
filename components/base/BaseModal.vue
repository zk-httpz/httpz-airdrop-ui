<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <button v-if="showCloseButton" class="modal-close" @click="$emit('update:modelValue', false)">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCloseButton: false,
  closeOnOverlayClick: true
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    emit('update:modelValue', false);
  }
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  @include glass-card;
  position: relative;
  background: rgba($color-background, 0.95);
  border: 1px solid rgba($color-primary, 0.1);
  padding: 2rem;
  max-width: 90%;
  width: 500px;
  border-radius: 12px;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: $transition-default;
  opacity: 0.6;

  @media (max-width: 640px) {
    top: 0.75rem;
    right: 0.75rem;
    width: 28px;
    height: 28px;
  }

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}

.close-icon {
  width: 100%;
  height: 100%;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>