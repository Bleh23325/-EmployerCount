<script>
    export default{
        name: 'UiBlock'
    }
</script>

<template>
    <div class="block">
        <slot></slot>
    </div>
</template>

<style scoped>
.block{
    background: #fff;
    border-radius: 8px;
    padding:40px;
    margin:10px 60px;
}
</style>