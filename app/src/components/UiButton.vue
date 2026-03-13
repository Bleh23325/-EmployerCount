<template>
  <button
    :class="[
      'ui-button',
      `ui-button--${variant}`,
      {
        'ui-button--disabled': disabled,
        'ui-button--full-width': fullWidth,
      },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
}
</script>

<style scoped>
.ui-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.ui-button--primary {
  background-color: #ff8c00;
  color: white;
}

.ui-button--primary:hover:not(:disabled) {
  background-color: #e67e00;
}

.ui-button--secondary {
  background-color: #6c5ce7;
  color: white;
}

.ui-button--secondary:hover:not(:disabled) {
  background-color: #5b4bc4;
}

.ui-button--accent {
  background-color: #00bcd4;
  color: white;
}

.ui-button--accent:hover:not(:disabled) {
  background-color: #00acc1;
}

.ui-button--disabled,
.ui-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-button--full-width {
  width: 100%;
}
</style>
