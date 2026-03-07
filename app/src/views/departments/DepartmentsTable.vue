<template>
  <div class="departments-table-container">
    <div v-if="loading" class="loading-indicator">Загрузка отделов...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <table v-else class="departments-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Организация (ID)</th>
          <th>Родительский отдел (ID)</th>
          <th>Комментарий</th>
          <th>Дата создания</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dept in departments" :key="dept.id">
          <td>{{ dept.id }}</td>
          <td>{{ dept.name }}</td>
          <td>{{ dept.id_organization || '—' }}</td>
          <td>{{ dept.parent || '—' }}</td>
          <td>{{ dept.comment || '—' }}</td>
          <td>{{ formatDate(dept.add_at) }}</td>
          <td>
            <Button @click="editDepartment(dept.id)" variant="secondary">Редактировать</Button>
            <Button @click="deleteDepartment(dept.id)" class="deleteBtn">Удалить</Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/index';
import { departmentsApi } from '@/services/departmentsApi';
import { getCurrentInstance } from 'vue';

export default {
  name: 'DepartmentsTable',
  components: { Button },
  setup() {
    const router = useRouter();
    const departments = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    const formatDate = (dateString) => {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const fetchDepartments = async () => {
      try {
        loading.value = true;
        const data = await departmentsApi.getDepartments();
        // Сортировка по id для стабильности
        departments.value = data.sort((a, b) => a.id - b.id);
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Не удалось загрузить список отделов';
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить отделы');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false;
      }
    };

    const editDepartment = (id) => {
      router.push(`/departments/edit/${id}`);
    };

    const deleteDepartment = async (id) => {
      if (!confirm('Вы уверены, что хотите удалить отдел?')) return;
      try {
        await departmentsApi.deleteDepartment(id);
        if (notify) {
          notify.success('Успешно', 'Отдел удалён');
        } else {
          alert('Отдел удалён');
        }
        await fetchDepartments();
      } catch (err) {
        console.error(err);
        const message = err.response?.data?.message || err.message || 'Ошибка при удалении';
        if (notify) {
          notify.error('Ошибка', message);
        } else {
          alert(message);
        }
      }
    };

    onMounted(fetchDepartments);

    return {
      departments,
      loading,
      error,
      formatDate,
      editDepartment,
      deleteDepartment
    };
  }
};
</script>

<style scoped>
.departments-table-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.departments-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.departments-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.departments-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.loading-indicator {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  color: #e62222;
  text-align: center;
  padding: 20px;
}

.deleteBtn {
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin: 0 4px;
  font-size: 0.9em;
  cursor: pointer;
  color: white;
  transition: all 300ms ease;
  background: #e62222;
}
.deleteBtn:hover:not(:disabled) {
  background: #d30700;
  transform: translateY(-2px);
}
</style>