<script>
    export default{
        name:'UiCheckbox',
        inheritAttrs:false, //чтоыб атрибуты не вешались на корневой элемент
        props:{
            //v-model
            modelValue:{
                type:Boolean,
                default: false,
            },
            disabled:{
                type:Boolean,
                default:false
            },
            error:{
                type:Boolean,
                default:false
            },
            color:{
                type:String,
                default:'secondary',
                validator (value){
                    return ['primary', 'secondary', 'accent'].includes(value)
                }
            }
        },
        emits:['update:modelValue']
    }
</script>

<template>
    <label class="checkbox"
        :class="{
            'checkbox--disabled':disabled,
            'checkbox--error':error
        }"
        :data-color="color"
    >
        <input type="checkbox" 
            class="checkbox__input" 
            v-bind="$attrs"
            :disabled="disabled"
            :checked="modelValue"
            @change="$emit('update:modelValue', $event.target.checked)"
        >
        <span class="checkbox__custom"></span>
        <span class="checkbox__label">
            <slot></slot>
        </span>
    </label>
</template>

<style scoped>
.checkbox{
    display:inline-flex;
    align-items: center;
    cursor: pointer;
    gap:8px;
    position: relative;
    user-select: none;
    margin: 10px 20px;
}
.checkbox__input{
    position: absolute;
    opacity:0;
    width:0;
    height:0;
}
.checkbox__custom{
    width:20px;
    height:20px;
    border: 2px solid #9b59b6;
    border-radius: 4px;
    background: white;
    transition: all 300ms ease;
    position:relative;
}
.checkbox:hover .checkbox__custom{
    border-color: #e67e22;
    background: #e67e22;
}

.checkbox[data-color="primary"] .checkbox__custom {
    border-color: #e67e22;
}
.checkbox[data-color="secondary"] .checkbox__custom {
    border-color: #9b59b6;
}
.checkbox[data-color="accent"] .checkbox__custom {
    border-color: rgba(0, 212, 255, 0.63);
}

.checkbox[data-color="primary"] .checkbox__input:checked + .checkbox__custom {
    background: #e67e22;
    border-color: #e67e22;
}
.checkbox[data-color="secondary"] .checkbox__input:checked + .checkbox__custom {
    background: #9b59b6;
    border-color: #9b59b6;
}
.checkbox[data-color="accent"] .checkbox__input:checked + .checkbox__custom {
    background: rgba(0, 212, 255, 0.63);
    border-color: rgba(0, 212, 255, 0.63);
}
.checkbox__input:checked + .checkbox__custom::after{
    content: '';
    position:absolute;
    left:6px;
    top:2px;
    width:5px;
    height:10px;
    border:solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
.checkbox:hover:not(.checkbox--disabled) .checkbox__input:not(:checked) + .checkbox__custom {
    border-color: #e67e22;
    box-shadow: 0 0 5px rgba(0, 212, 255, 0.63);
}

.checkbox--error .checkbox__custom {
    border-color: #e74c3c !important;
    background: #fff5f5;
}

.checkbox--error .checkbox__input:checked + .checkbox__custom {
    background: #e74c3c !important;
    border-color: #e74c3c !important;
}

.checkbox--disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.checkbox--disabled .checkbox__custom {
    background: #f0f0f0;
    border-color: #ccc !important;
}
.checkbox__input + .checkbox__custom{
    box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.3);
}
.checkbox__label{
    color:#333;
    font-size:1em;
}
</style>