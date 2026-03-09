<template>
  <div class="create-employee-page">
    <div class="page-header">
      <h1>Создание нового сотрудника</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <EmployeeForm @submit="handleSubmit" @cancel="goBack" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { Button } from '@/components/index';
import EmployeeForm from './components/EmployeeForm.vue';

export default {
  name: 'CreateEmployeePage',
  components: {
    Button,
    EmployeeForm
  },
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.push('/employees');
    };

    const handleSubmit = (employeeData) => {
      console.log('Employee created:', employeeData);
    };

    return {
      goBack,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.create-employee-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}
</style>