<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">RPC Settings</h3>
        <button class="close-btn" @click="close">
          <span class="icon icon-close"></span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">RPC Endpoint</label>
          <input type="text" class="form-input" v-model="rpcEndpoint" placeholder="Enter RPC endpoint URL" />
          <p class="form-help">
            Default: {{ defaultEndpoint }}
          </p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="test-btn" @click="testEndpoint" :disabled="isLoading">
          {{ isLoading ? 'Testing...' : 'Test Usability' }}
        </button>
        <button class="save-btn" @click="saveSettings">
          Save Changes
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
  (e: 'close'): void;
  (e: 'save', endpoint: string): void;
}>();

const config = useRuntimeConfig();
const { appState } = useStatus();
const { error } = useToast();
const { checkRPCEndpointIsOk } = useToken();
const { success } = useToast();
const isLoading = ref(false);


const defaultEndpoint = config.public.minaEndpoint;
const rpcEndpoint = computed({
  get: () => appState.value.minaEndpoint,
  set: (val) => appState.value.minaEndpoint = val
});

const close = () => {
  emit('close')
}

const saveSettings = () => {
  if (rpcEndpoint.value && rpcEndpoint.value.startsWith("http")) {
    emit('save', rpcEndpoint.value);
    close();
  } else {
    error('Invalid RPC endpoint');
  }

};

const testEndpoint = async () => {
  if (!rpcEndpoint.value || !rpcEndpoint.value.startsWith("http")) {
    error('Invalid RPC endpoint');
    return;
  }

  isLoading.value = true;
  try {
    const isOk = await checkRPCEndpointIsOk(rpcEndpoint.value);
    if (isOk) {
      success('RPC endpoint is currently available');
    } else {
      error('Failed to connect to RPC endpoint');
    }
  } catch (e) {
    error('Failed to connect to RPC endpoint');
  } finally {
    isLoading.value = false;
  }
};
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
  max-width: 480px;
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
  overflow-x: hidden;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  color: $color-text-secondary;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba($color-background, 0.5);
  border: 1px solid rgba($color-primary, 0.2);
  border-radius: $border-radius;
  color: $color-text-primary;
  font-family: var(--font-code);
  font-size: 0.75rem;
  transition: $transition-default;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba($color-primary, 0.4);
    box-shadow: 0 0 10px rgba($color-primary, 0.1);
  }

  &::placeholder {
    color: $color-text-secondary;
  }
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba($color-primary, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.test-btn {
  padding: 0.75rem 1.5rem;
  background: rgba($color-text-secondary, 0.1);
  border: 1px solid rgba($color-text-secondary, 0.2);
  border-radius: $border-radius;
  color: $color-text-primary;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  cursor: pointer;
  transition: $transition-default;
  min-width: 120px;

  &:hover:not(:disabled) {
    background: rgba($color-text-secondary, 0.2);
    border-color: rgba($color-text-secondary, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background: $color-primary;
  border: none;
  border-radius: $border-radius;
  color: $color-background;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  cursor: pointer;
  transition: $transition-default;

  &:hover {
    background: $color-primary-hover;
    box-shadow:
      0 0 20px rgba($color-primary, 0.3),
      0 0 10px rgba($color-primary, 0.2);
  }
}

.form-help {
  margin-top: 0.5rem;
  color: $color-text-secondary;
  font-size: 0.75rem;
  font-family: var(--font-code);
  overflow-wrap: break-word;
  max-width: 100%;
}

@media (max-width: 480px) {
  .modal-footer {
    flex-direction: column;
  }

  .test-btn,
  .save-btn {
    width: 100%;
  }
}
</style>