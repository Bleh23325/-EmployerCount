<template>
  <Block>
    <h2>Управление отделами</h2>
  </Block>
  <Block>
    <Button variant="primary" @click="goToCreateDepartment">
      + Создать отдел
    </Button>
    <DepartmentsTable />
  </Block>
</template>

<script>
import { useRouter } from 'vue-router';
import DepartmentsTable from './DepartmentsTable.vue';
import { Button, Block } from '@/components/index';

export default {
  name: 'DepartmentsPage',
  components: {
    DepartmentsTable,
    Button,
    Block
  },
  setup() {
    const router = useRouter();

    const goToCreateDepartment = () => {
      router.push('/departments/create');
    };

    return {
      goToCreateDepartment
    };
  }
};
</script>

<style scoped></style>