<template>
  <div class="positions-table-container">
    <div v-if="loading" class="loading-indicator">Загрузка должностей...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <table v-else class="positions-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Дата создания</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pos in filteredPositions" :key="pos.id">
          <td>{{ pos.name }}</td>
          <td>{{ formatDate(pos.add_at) }}</td>
          <td>
            <Button @click="editPosition(pos.id)" variant="secondary">Редактировать</Button>
            <Button @click="deletePosition(pos.id)" class="deleteBtn">Удалить</Button>
          </td>
        </tr>
        <tr v-if="filteredPositions.length === 0">
          <td colspan="3" class="empty-message">Нет должностей, соответствующих фильтру</td>
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
// API для работы с должностями
import { positionsApi } from '@/services/positionsApi';
// доступ к текущему экземпляру
import { getCurrentInstance } from 'vue';

export default {
  name: 'PositionsTable',
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
    // хранит список всех должностей, полученный с сервера
    const positions = ref([]);
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
    const fetchPositions = async () => {
      try {
        // включается загрузка
        loading.value = true;
        // ожидание ответа от API
        const data = await positionsApi.getPositions();
        // сортировка по айди
        positions.value = data.sort((a, b) => a.id - b.id);
      } catch (err) {
        // логируем ошибку в консоль
        console.error(err);
        // записываем текст ошибки в error
        error.value = err.message || 'Не удалось загрузить список должностей';
        // уведомление об ошибке
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить должности');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false; // окончание загрузки
      }
    };

    // поиск по названию, computed - вычисляемое значение, пересчитывается 
    // автоматически при изменении filter или positions
    const filteredPositions = computed(() => {
      // если пусто, возвращаем просто список без изменений
      if (!props.filter) return positions.value;
      // переводим поисковый запрос к нижнему регистру
      const query = props.filter.toLowerCase();
      // возвращаем должность, где название содержит query
      return positions.value.filter(pos =>
        pos.name.toLowerCase().includes(query)
      );
    });

    // переход на страницу редактирования должности
    const editPosition = (id) => {
      // переход по адресу + айдишник
      router.push(`/positions/edit/${id}`);
    };

    // удаление должности по его айди
    const deletePosition = async (id) => {
      // спрашиваем у пользователя подтверждение
      if (!confirm('Вы уверены, что хотите удалить должность?')) return;
      try {
        // отправляем запрос на удаление
        await positionsApi.deletePosition(id);
        if (notify) {
          notify.success('Успешно', 'Должность удалена');
        } else {
          alert('Должность удалена');
        }
        // после удаления обновляем список
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

    // загружаем список после выполнения кода
    onMounted(fetchPositions);

    // возвращение данных и функций
    return {
      filteredPositions, // список после поиска
      loading, // флаг загрузки
      error, // текст ошибки
      formatDate, // форматирование даты
      editPosition, // переход на редактирование
      deletePosition // удаление
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