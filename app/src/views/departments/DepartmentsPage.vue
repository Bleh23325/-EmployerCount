<template>
  <Block>
    <h2>Управление отделами</h2>
  </Block>
  <Block>
    <div class="toolbar">
      <div></div>
      <Button variant="primary" @click="goToCreateDepartment">
        + Создать отдел
      </Button>
      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по названию..."
        class="search-input"
      />
    </div>
    <DepartmentsTable :filter="searchQuery"/>
  </Block>
</template>

<script>
// для навигации
import { useRouter } from 'vue-router';
// создаёт реактивную переменную
import { ref } from 'vue';
// таблица отделов
import DepartmentsTable from './DepartmentsTable.vue';
// импорт кнопки, блок и поле ввода
import { Button, Block, Input } from '@/components/index';

export default {
  name: 'DepartmentsPage',
  // регистрируем дочерние компоненты чтобы они были доступны
  components: {
    DepartmentsTable,
    Button,
    Block,
    Input
  },
  // точка входа для composition api
  setup() {
    // получаем объект роутера для переходов
    const router = useRouter();
     // реактивная переменная в которой хранится текст поиска, нач. значение -пустая строка
    const searchQuery = ref('');

    // переход на страницу создания новой должности
    const goToCreateDepartment = () => {
      router.push('/departments/create');
    };

    // возвращаем всё
    return {
      searchQuery, // для связи с полем ввода через v-model
      goToCreateDepartment // обработчик клика по кнопке
    };
  }
};
</script>

<style scoped>

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  max-width: 300px;
  justify-self: end;
}

</style>