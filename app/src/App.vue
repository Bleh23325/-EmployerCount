<template>
    <Block>
        <h1>Учет сотрудников</h1>
        <p>это пример и потом это удалиться, так что сделайте копию!</p>
    </Block>
    <Block>
        это блок окторый надо прописывать под каждый элементом, он разделяет логисекие части
    </Block>
    <Block>
        <div class="baseVert">
            пример инпута
            <Input  placeholder="Введите свой текст"/>
            пример инпута который обязательный
            <Input required  placeholder="Введите свой текст"/>
            пример инпута c ошибкой
            <Input error  placeholder="Введите свой текст"/>
            пример инпута верный ввод
            <Input success  placeholder="Введите свой текст"/>
        </div>
    </Block>
    <Block>
        туткнопки
        <div class="baseVert">
            активные обычные кнопки
            <div class = "baseGoriz">
                <Button variant="primary">кнопка первичной важности</Button>
                <Button variant="secondary">кнопка вторичной важности</Button>
                <Button variant="accent">кнопка нетакуся</Button>
            </div>
            неактивные такие же кнопки, те выключенные (так можно со всеми кнопками)
            <div class = baseGoriz>
                <Button disabled>если не прописать вариант кнопка будет оранжевая</Button>
                <Button variant="secondary" disabled>Неактивная кнопка</Button>
            </div>
        </div>
    </Block>
    <Block>
        чекбоксы
    </Block>
    <Block>
        Модфльные окна
    </Block>
    <Block>
        выбирашки
    </Block>
</template>
<script>
import Input from './components/ui/UiInput.vue'
import Button from './components/ui/UiButton.vue'
import Block from './components/ui/UiBlock.vue'
import Checkbox from './components/ui/UiCheckbox.vue'
import Modal from './components/ui/UiModal.vue'
import Selector from './components/ui/UiSelector.vue'

export default{
    components:{
        Button,
        Input,
        Checkbox,
        Selector,
        Block,
        Modal
    }
}
</script>
<style scoped>
.baseVert{
    display: flex;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap:20px;
    flex-wrap: wrap;
}
.baseGoriz{
    display: flex;
    gap:20px;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
}
</style>