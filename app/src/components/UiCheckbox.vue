<template>
  <label
    class="ui-checkbox"
    :class="[`ui-checkbox--${color}`, { 'ui-checkbox--disabled': disabled }]"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="ui-checkbox__checkmark"></span>
    <span class="ui-checkbox__label"><slot /></span>
  </label>
</template>

<script>
export default {
  name: 'UiCheckbox',
  props: {
    modelValue: Boolean,
    disabled: Boolean,
    error: Boolean,
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent'].includes(value),
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped>
.ui-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.ui-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.ui-checkbox__checkmark {
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.ui-checkbox:hover .ui-checkbox__checkmark {
  border-color: #999;
}

.ui-checkbox input:checked ~ .ui-checkbox__checkmark {
  background-color: #ff8c00;
  border-color: #ff8c00;
}

.ui-checkbox--secondary input:checked ~ .ui-checkbox__checkmark {
  background-color: #6c5ce7;
  border-color: #6c5ce7;
}

.ui-checkbox--accent input:checked ~ .ui-checkbox__checkmark {
  background-color: #00bcd4;
  border-color: #00bcd4;
}

.ui-checkbox__checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.ui-checkbox input:checked ~ .ui-checkbox__checkmark:after {
  display: block;
}

.ui-checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-checkbox--disabled input:checked ~ .ui-checkbox__checkmark {
  background-color: #ccc;
  border-color: #ccc;
}
</style>
