<template>
  <div class="ui-selector" :class="{ 'ui-selector--disabled': disabled }">
    <label v-if="label" class="ui-selector__label">{{ label }}</label>
    <select
      :value="modelValue"
      :disabled="disabled"
      class="ui-selector__select"
      :class="{
        'ui-selector__select--error': error,
        'ui-selector__select--success': success,
      }"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled selected>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="ui-selector__error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'UiSelector',
  props: {
    modelValue: [String, Number],
    options: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every((item) => 'value' in item && 'label' in item)
      },
    },
    label: String,
    placeholder: {
      type: String,
      default: '-- Выберите --',
    },
    disabled: Boolean,
    error: [Boolean, String],
    success: Boolean,
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped>
.ui-selector {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
}

.ui-selector__label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.ui-selector__select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.ui-selector__select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.ui-selector__select--error {
  border-color: #f44336;
}

.ui-selector__select--error:focus {
  border-color: #f44336;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
}

.ui-selector__select--success {
  border-color: #4caf50;
}

.ui-selector__select--success:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.ui-selector--disabled {
  opacity: 0.6;
}

.ui-selector--disabled .ui-selector__select {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.ui-selector__error {
  color: #f44336;
  font-size: 12px;
}
</style>
