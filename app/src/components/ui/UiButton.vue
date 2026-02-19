<script>
    export default{
        name:'UiButton',
        props:{
            variant:{
                type: String,
                default:'primary',
                validator(value){
                    return ['primary', 'secondary', 'accent'].includes(value)
                }
            },
            outline:{
                type:Boolean,
                default:false
            }
        }
    }
</script>

<template>
    <button class="button"
     :class="`button--${variant}`, {
        'button--outline':outline
    }"
     >
        <slot></slot>
    </button>
</template>

<style scoped>
.button{
    border:none;
    border-radius:4px;
    padding: 10px 20px;
    margin: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    color:white;
    transition:all 300ms ease;
}
.button--primary{
    background: #e67e22;
}
.button--primary:hover:not(:disabled){
    background:#d35400;
    transform:translateY(-5px) ;
}
.button--primary:active:not(:disabled){
    transform: scale(0.9) rotate(0.7deg);
}

.button--secondary{
    background: #9b59b6;
}
.button--secondary:hover:not(:disabled){
    background: #8e44ad;
    transform:translateY(-5px) ;
}
.button--secondary:active:not(:disabled){
    transform: scale(0.9) rotate(0.7deg);
}

.button--accent{
    background: rgba(0, 212, 255);
}
.button--accent:hover:not(:disabled){
    background: rgba(0, 180, 255);
    transform:translateY(-5px) ;
}
.button--accent:active:not(:disabled){
    transform: scale(0.9) rotate(0.7deg);
}

.button:disabled, .button--disabled{
    opacity:0.5;
    cursor: not-allowed;
}
</style>