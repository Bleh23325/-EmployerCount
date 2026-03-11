<template>
  <div class="ui-input-wrapper" :class="{ 'full-width': fullWidth }">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'ui-input',
        `ui-input--${variant}`,
        {
          'ui-input--error': error,
          'ui-input--success': success,
          'ui-input--full-width': fullWidth,
        },
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <span v-if="error" class="ui-input__error-message">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'UiInput',
  props: {
    modelValue: [String, Number],
    type: {
      type: String,
      default: 'text',
    },
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    error: [Boolean, String],
    success: Boolean,
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'secondary'].includes(value),
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'blur', 'focus'],
}
</script>

<style scoped>
.ui-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ui-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.ui-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.ui-input--error {
  border-color: #f44336;
}

.ui-input--error:focus {
  border-color: #f44336;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
}

.ui-input--success {
  border-color: #4caf50;
}

.ui-input--success:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.ui-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.ui-input__error-message {
  color: #f44336;
  font-size: 12px;
}

.full-width {
  width: 100%;
}

.ui-input--full-width {
  width: 100%;
}
</style>
