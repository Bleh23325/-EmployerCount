<template>
  <div class="positions-table-container">
    <div v-if="loading" class="loading-indicator">Загрузка должностей...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <table v-else class="positions-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Отдел</th>
          <th>Комментарий</th>
          <th>Дата создания</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pos in positions" :key="pos.id">
          <td>{{ pos.name }}</td>
          <td>{{ pos.departmentName }}</td>
          <td>{{ pos.comment || '—' }}</td>
          <td>{{ formatDate(pos.add_at) }}</td>
          <td>
            <Button @click="editPosition(pos.id)" variant="secondary">Редактировать</Button>
            <Button @click="deletePosition(pos.id)" class="deleteBtn">Удалить</Button>
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
import { positionsApi } from '@/services/positionsApi';
import { departmentsApi } from '@/services/departmentsApi';
import { getCurrentInstance } from 'vue';

export default {
  name: 'PositionsTable',
  components: { Button },
  setup() {
    const router = useRouter();
    const positions = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    const formatDate = (dateString) => {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const fetchPositions = async () => {
      try {
        loading.value = true;
        
        const [positionsData, departmentsData] = await Promise.all([
          positionsApi.getPositions(),
          departmentsApi.getDepartments()
        ]);

        const deptMap = {};
        departmentsData.forEach(dept => { deptMap[dept.id] = dept.name; });

        const enriched = positionsData.map(pos => ({
          ...pos,
          departmentName: deptMap[pos.id_department] || '—'
        }));

        positions.value = enriched.sort((a, b) => a.id - b.id);
      } catch (err) {
        console.error(err);
        error.value = err.message || 'Не удалось загрузить список должностей';
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить должности');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false;
      }
    };

    const editPosition = (id) => {
      router.push(`/positions/edit/${id}`); 
    };

    const deletePosition = async (id) => {
      if (!confirm('Вы уверены, что хотите удалить должность?')) return;
      try {
        await positionsApi.deletePosition(id);
        if (notify) {
          notify.success('Успешно', 'Должность удалена');
        } else {
          alert('Должность удалена');
        }
        await fetchPositions();
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

    onMounted(fetchPositions);

    return {
      positions,
      loading,
      error,
      formatDate,
      editPosition,
      deletePosition
    };
  }
};
</script>

<style scoped>
.positions-table-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.positions-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.positions-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.positions-table td {
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