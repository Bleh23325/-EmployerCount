<template>
    <Block>
        <h1>Учет сотрудников</h1>
    </Block>
    <Block>
        <div class="baseGoriz">
            <nav>
                <router-link to="/employees">Сотрудники</router-link>
            </nav>
            <nav>
                <router-link to="/organizations">Организации</router-link>
            </nav>
            <nav>
                <router-link to="/departments">Отделы</router-link>
            </nav>
            <nav>
                <router-link to="/positions">Должности</router-link>
            </nav>
        </div>
    </Block>
    <Block>
        <router-view/>
    </Block>
</template>

<script>
import{
    Block,
    Button,
    Input,
    Modal,
    Notification,
    Selector
} from '@/components/index';

export default{
    name:'App',
    components:{
        Block,
        Button,
        Input,
        Modal,
        Modal,
        Notification,
        Selector
    },
}
</script>
<style scoped>
nav {
  padding: 20px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin-right: 10px;
}

nav a.router-link-exact-active {
  color: #9b59b6;
}
</style>