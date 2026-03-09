<template>
  <div class="departments-table-container">
    <div v-if="loading" class="loading-indicator">Загрузка отделов...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <table v-else class="departments-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Организация</th>
          <th>Родительский отдел</th>
          <th>Комментарий</th>
          <th>Дата создания</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dept in filteredDepartments" :key="dept.id">
          <td>{{ dept.name }}</td>
          <td>{{ dept.organizationName }}</td>
          <td>{{ dept.parentName }}</td>
          <td>{{ dept.comment || '—' }}</td>
          <td>{{ formatDate(dept.add_at) }}</td>
          <td>
            <Button @click="editDepartment(dept.id)" variant="secondary">Редактировать</Button>
            <Button @click="deleteDepartment(dept.id)" class="deleteBtn">Удалить</Button>
          </td>
        </tr>
        <tr v-if="filteredDepartments.length === 0">
          <td colspan="6" class="empty-message">Нет отделов, соответствующих фильтру</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// ref - реактивная переменная, onMuted - хук, computed - вычисляемое поле
import { ref, onMounted, computed } from 'vue';
// для навигации
import { useRouter } from 'vue-router';
// импорт кнопки
import { Button } from '@/components/index';
// API для работы с организациями и отделами
import { departmentsApi } from '@/services/departmentsApi';
import { organizationsApi } from '@/services/organizationsApi';
// доступ к текущему экземпляру
import { getCurrentInstance } from 'vue';

export default {
  name: 'DepartmentsTable',
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
    // хранит список всех отделов, полученный с сервера
    const departments = ref([]);
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

    // асинхронная функция для получения списка отделов и организаций
    const fetchDepartments = async () => {
      try {
        // включается загрузка
        loading.value = true;
        // загружаем параллельно и отделы и организации
        const [deptsData, orgsData] = await Promise.all([
          // запрос на получение отделов
          departmentsApi.getDepartments(),
          // запрос на получение организаций
          organizationsApi.getOrganizations()
        ]);

        // объект, где ключ это айди организации а значение это её название
        const orgMap = {};
        orgsData.forEach(org => { orgMap[org.id] = org.name; });

        // объект, где ключ это айди отдела а значение это его название
        const deptMap = {};
        deptsData.forEach(dept => { deptMap[dept.id] = dept.name; });

        // проходим по каждому отделу из deptsData и добавляем два новых поля:
        // organizationName это название организации к которой относится отдел
        // parentName это название родительского отдела (если у него он есть)
        const enriched = deptsData.map(dept => ({
          // копируем все исходные поля
          ...dept,
          // если orgMap содержит название для id_organization, берём его, иначе прочерк
          organizationName: orgMap[dept.id_organization] || '—',
          // если у отдела есть родитель, ищем его название в deptMap, иначе прочерк
          parentName: dept.parent ? (deptMap[dept.parent] || '—') : '—'
        }));

        // сортируем отделы по айди
        departments.value = enriched.sort((a, b) => a.id - b.id);
      } catch (err) {
        // выводим ошибку в консоль
        console.error(err);
        // записываем текст ошибки в error
        error.value = err.message || 'Не удалось загрузить список отделов';
        // для уведомления
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить отделы');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false; // загрузка окончена
      }
    };

    // computed - вычисляемое поле, которое автоматически пересчитывается при
    // изменении filter или departments
    const filteredDepartments = computed(() => {
      // если строка поиска пустая, возвращаем просто список
      if (!props.filter) return departments.value;
      // поиск по нижнему регистру
      const query = props.filter.toLowerCase();
      // возвращение тех отделов, название которых содержит query
      return departments.value.filter(dept =>
        dept.name.toLowerCase().includes(query)
      );
    });

    // переход на страницу редактирования
    const editDepartment = (id) => {
      router.push(`/departments/edit/${id}`);
    };

    // удаление отдела
    const deleteDepartment = async (id) => {
      // спрашиваем подтверждение у пользователя
      if (!confirm('Вы уверены, что хотите удалить отдел?')) return;
      try {
        // отправляем запрос на удаление отдела с данным айди
        await departmentsApi.deleteDepartment(id);
        // если удаление успешно, показ уведомления
        if (notify) {
          notify.success('Успешно', 'Отдел удалён');
        } else {
          alert('Отдел удалён');
        }
        // после удаления обновляем список отделов
        await fetchDepartments();
      } catch (err) {
        console.error(err);
        // формирование текста ошибки
        const message = err.response?.data?.message || err.message || 'Ошибка при удалении';
        if (notify) {
          notify.error('Ошибка', message);
        } else {
          alert(message);
        }
      }
    };

    // загрузка данных
    onMounted(fetchDepartments);

    // возвращаем данные и функции
    return {
      filteredDepartments, // список после поиска
      loading, // флаг загрузки
      error, // ошибка
      formatDate, // форматирование даты
      editDepartment, // переход на редактирование
      deleteDepartment // удаление
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