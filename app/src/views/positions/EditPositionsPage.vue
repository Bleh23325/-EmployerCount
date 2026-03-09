<template>
  <div class="edit-position-page">
    <div class="page-header">
      <h1>Редактирование должности</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <div v-if="loading" class="loading-indicator">Загрузка данных...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <PositionForm
      v-else
      :initialData="position"
      @submit="handleSubmit"
      @cancel="goBack"
      :serverErrors="serverErrors"
      @update:serverErrors="updateServerErrors"
    />
  </div>
</template>

<script>
// useRouter для навигации, useRoute для получения параметров из URL
import { useRouter, useRoute } from 'vue-router';
// ref - реактивная переменная, onMounted - хук, getCurrentInstance - доступ
// к глобальным свойствам
import { ref, onMounted, getCurrentInstance } from 'vue';
// импорт кнопки
import { Button } from '@/components/index';
// форма должности
import PositionForm from './components/PositionForm.vue';
// api для работы с должностями
import { positionsApi } from '@/services/positionsApi';

export default {
  name: 'EditPositionPage',
  // регистрируем дочерние компоненты
  components: {
    Button,
    PositionForm
  },
  setup() {
    // даёт возможность программно переходить по страницам
    const router = useRouter();
    // ползволяет получить параметры текущего маршрута
    const route = useRoute();
    // извлекаем айди должности из адресной строки
    const positionId = route.params.id;

    // хранит данные загруженной должности
    const position = ref(null);
    // флаг загрузки
    const loading = ref(true);
    // текст ошибки
    const error = ref(null);
    // объект с ошибками валидации от сервера
    const serverErrors = ref({});
    // из глобальных свойств получаем планиг уведомлений
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    // вернуться на страницу со списком
    const goBack = () => {
      router.push('/positions');
    };

    // обновить объект serverErrors, когда нужно очистить ошибки поля
    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    // загрузка данных
    const fetchPosition = async () => {
      try {
        loading.value = true; // включается загрузка
        // отправляем запрос на получение данных по айди
        const data = await positionsApi.getPosition(positionId);
        // сохраняем полученное в position
        // добавляем поле id_department, если нет - null
        position.value = {
          ...data,
          id_department: data.id_department || null 
        };
      } catch (err) {
        console.error(err);
        // текст ошибки
        error.value = 'Не удалось загрузить данные должности';
        // показ уведомления ошибки
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить данные должности');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false; // загрузка окончена
      }
    };

    // отправка обновлённых данных на сервер
    const handleSubmit = async (positionData) => {
      try {
        // отправляем запрос на обновление данных
        await positionsApi.updatePosition(positionId, positionData);
        // если всё успешно показываем уведомление
        if (notify) {
          notify.success('Успешно', 'Должность успешно обновлена');
        } else {
          alert('Должность успешно обновлена');
        }
        // возвращаемся на страницу со списком
        router.push('/positions');
      } catch (err) {
        console.error(err);
        if (err.response?.data?.errors) {
          // сохраняем ошибки в serverErrors чтобы передать их обратно в форму
          serverErrors.value = err.response.data.errors;
          // показываем уведомление о проверке полей
          if (notify) {
            notify.error('Ошибка', 'Проверьте правильность заполнения полей');
          }
        } else {
          // иначе это общая ошибка
          const message = err.response?.data?.message || err.message || 'Произошла ошибка';
          if (notify) {
            notify.error('Ошибка', message);
          } else {
            alert('Ошибка: ' + message);
          }
        }
      }
    };

    // загрузка данных
    onMounted(fetchPosition);

    // возвращение данных и функций
    return {
      position, // данные должности
      loading, // флаг загрузки
      error, // текст ошибки
      serverErrors, // ошибки сервера
      goBack, // функция возврата
      handleSubmit, // функция отправки обновления
      updateServerErrors // функция обновления ошибок
    };
  }
};
</script>

<style scoped>
.edit-position-page {
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
</style>