<script>
    export default{
        name: 'UiInput',
        props:{
            error:{
            type: Boolean,
            default: false
            },
            success:{
                type:Boolean,
                default: false
            }
        }
    }
</script>

<template>
    <input type="text" :class="{
        'error':error,
        'success':success
    }" placeholder="placegolder"> 
</template>

<style scoped>
input {
    outline: none;
    width: 60vh;
    font-size: 1.2em;
    border-radius: 3px;
    border:2px solid #777777;
    padding: 10px 15px;
    background: #fafafa;
    color: #333;

    transition: 300ms ease;
}
input:hover, input:focus{
    border-color: #9b59b6;
    box-shadow: 0 0 25px #e67e22;
}
input::placeholder{
    color:#999;
    opacity: 0.7;
    transition: opticaly 300ms ease;
}

/*Если поле обязательно*/
input:required{
    border: 3px solid #b3621b;
    background: #fff4ea;
}

/*Если введена ошибка*/
input.error{
    border-color: #e74c3c;
    background: #faebeb;
}
input.error:focus, input.error:hover{
    box-shadow:  0 0 25px #e74c3c;
}

/*Подтверждение правильного действия (например пароль)*/
input.success{
    border-color: #2ecc71;
    background: #dcfce9;
}
input.success:focus, input.success:hover{
    box-shadow: 0 0 25px #50c581;
}
</style>