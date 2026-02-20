<template>
    <div class="select">
        <label v-if="label" class="select__label">{{ label }}</label>
        
        <div class="select__wrapper">
            <select 
                class="select__native"
                :value="modelValue"
                @change="$emit('update:modelValue', $event.target.value)"
                v-bind="$attrs"
            >
                <option value="" disabled selected>  Выберите вариант  </option>
                <option 
                    v-for="option in options" 
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
            
            <span class="select__arrow">▼</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UiSelect',
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        options: {
            type: Array,
            required: true,
            validator(value) {
                return value.every(option => 
                    option.hasOwnProperty('value') && 
                    option.hasOwnProperty('label')
                )
            }
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Выберите вариант'
        }
    },
    emits: ['update:modelValue']
}
</script>

<style scoped>
.select {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin:10px 20px;
}

.select__label {
    font-size: 0.9em;
    color: #666;
}

.select__wrapper {
    position: relative;
    width: 100%;
}

.select__native {
    width: 100%;
    padding: 10px 35px 10px 15px;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    color: #333;
    appearance: none;
    cursor: pointer;
    transition: all 300ms ease;
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.select__native:hover {
    border-color: #e67e22;
}

.select__native:focus {
    outline: none;
    border-color: #9b59b6;
    box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
}

.select__arrow {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    pointer-events: none;
    font-size: 12px;
}

/* Стили для disabled */
.select__native:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
}
</style>