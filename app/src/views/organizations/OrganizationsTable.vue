<template>
  <div class="organizations-table-container">
    <div v-if="loading" class="loading-indicator">Загрузка...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <table v-else class="organizations-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Комментарий</th>
          <th>Дата создания</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="org in filteredOrganizations" :key="org.id">
          <td>{{ org.name }}</td>
          <td>{{ org.comment || '—' }}</td>
          <td>{{ formatDate(org.add_at) }}</td>
          <td>
            <Button @click="editOrganization(org.id)" variant="secondary">Редактировать</Button>
            <Button @click="deleteOrganization(org.id)" class="deleteBtn">Удалить</Button>
          </td>
        </tr>
        <tr v-if="filteredOrganizations.length === 0">
          <td colspan="4" class="empty-message">Нет организаций, соответствующих фильтру</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// ref - реактивная переменная, onMuted - хук, computed - вычисляемое поле
import { ref, onMounted, computed } from 'vue';
// импорт кнопки
import { Button } from '@/components/index';
// API для работы с организациями
import { organizationsApi } from '@/services/organizationsApi';
// для навигации
import { useRouter } from 'vue-router';
// доступ к текущему экземпляру
import { getCurrentInstance } from 'vue';

export default {
  name: 'OrganizationsTable',
  components: { Button },
  // props это свойства, которые можно передать в этот компонент из родительской
  // страницы
  props: {
    // filter это строка для поиска по названию
    filter: {
      type: String, // тип - строка
      default: '' // значение по умолчанию, т.е. пустая строка
    }
  },
  // props - объек со значениями переданных свойств 
  setup(props) {
    // экземпляр роутера для переходов
    const router = useRouter();
    // хранит список всех организаций, полученный с сервера
    const organizations = ref([]);
    // флаг загрузки, true-идёт загрузка, false-окончена
    const loading = ref(true);
    // текст ошибки
    const error = ref(null);
     // получаем доступ к глобальному экземпляру для уведомлений
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;


    // преобразует строку с датой в локальный формат (дд.мм.гггг)
    const formatDate = (dateString) => {
      if (!dateString) return '—'; // если даты нет, возвращаем прочерк
      // создаём объект Date и форматируем на русский формат
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    // загрузка данных с сервера
    const fetchOrganizations = async () => {
      try {
        // включается загрузка
        loading.value = true;
        // ожидание ответа от API
        organizations.value = await organizationsApi.getOrganizations();
      } catch (err) {
        // логируем ошибку в консоль
        console.error(err);
        // записываем текст ошибки в error
        error.value = err.message || 'Не удалось загрузить список организаций';
        // уведомление об ошибке
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить организации');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false; // окончание загрузки
      }
    };

    // поиск по названию, computed - вычисляемое значение, пересчитывается 
    // автоматически при изменении filter или organizations
    const filteredOrganizations = computed(() => {
      // если пусто, возвращаем просто список без изменений
      if (!props.filter) return organizations.value;
      // переводим поисковый запрос к нижнему регистру
      const query = props.filter.toLowerCase();
      // возвращаем организацию, где название содержит query
      return organizations.value.filter(org =>
        org.name.toLowerCase().includes(query)
      );
    });

    // переход на страницу редактирования организации
    const editOrganization = (id) => {
      // переход по адресу + айдишник
      router.push(`/organizations/edit/${id}`);
    };

    // удаление организации по её айди
    const deleteOrganization = async (id) => {
      // спрашиваем у пользователя подтверждение
      if (!confirm('Вы уверены, что хотите удалить организацию?')) return;
      try {
        // отправляем запрос на удаление
        await organizationsApi.deleteOrganization(id);
        // после удаления обновляем список
        await fetchOrganizations();
      } catch (err) {
        alert('Ошибка при удалении: ' + err.message);
      }
    };

    // загружаем список после выполнения кода
    onMounted(fetchOrganizations);

    // возвращение данных и функций
    return {
      filteredOrganizations, // список после поиска
      loading, // флаг загрузки
      error, // текст ошибки
      formatDate, // форматирование даты
      editOrganization, // переход на редактирование
      deleteOrganization // удаление
    };
  }
};
</script>

<style scoped>

.empty-message {
  text-align: center;
  padding: 20px;
  color: #999;
}

.organizations-table-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.organizations-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.organizations-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.organizations-table td {
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