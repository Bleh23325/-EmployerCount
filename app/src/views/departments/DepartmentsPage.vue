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
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import DepartmentsTable from './DepartmentsTable.vue';
import { Button, Block, Input } from '@/components/index';

export default {
  name: 'DepartmentsPage',
  components: {
    DepartmentsTable,
    Button,
    Block,
    Input
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');

    const goToCreateDepartment = () => {
      router.push('/departments/create');
    };

    return {
      searchQuery,
      goToCreateDepartment
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