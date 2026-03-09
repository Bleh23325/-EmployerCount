<template>
  <div class="create-position-page">
    <div class="page-header">
      <h1>Создание новой должности</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <PositionForm
      @submit="handleSubmit"
      @cancel="goBack"
      :serverErrors="serverErrors"
      @update:serverErrors="updateServerErrors"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'; // для навигации
// ref создаёт реактивные переменные, getCurrentInstance позволяет получить
// доступ к глобальным свойствам Vue
import { ref, getCurrentInstance } from 'vue';
// импорт кнопки 
import { Button } from '@/components/index';
// импорт формы должностей
import PositionForm from './components/PositionForm.vue';
// API для работы с должностями
import { positionsApi } from '@/services/positionsApi';

export default {
  name: 'CreatePositionPage',
  components: {
    Button,
    PositionForm
  },
  setup() {
    // создаём экземпляр роутера чтобы иметь возможность переходить по адресам
    const router = useRouter();
    // реактивная переменная для хранения ошибок валидации с сервера
    const serverErrors = ref({});
    // получаем доступ к текущему экземпляру Vue
    const instance = getCurrentInstance();
    // получаем плагин уведомлений, а если его нет, то notify будет undefined
    // и тогда будет использоваться alert
    const notify = instance?.appContext.config.globalProperties.$notify;

    // функция возврата на страницу с просмотром списка должностец
    const goBack = () => {
      // переходим по указанному адресу
      router.push('/positions');
    };

    // функция для обновления объекта, вызывается, когда надо очистить ошибки
    // какого-то поля после ввода
    const updateServerErrors = (errors) => {
      serverErrors.value = errors; // обновляем реактивную переменную
    };

    // функция которая вызывается когда создаётся новая должность
    const handleSubmit = async (positionData) => {
      try {
        // отправляем запрос на сервер для создания должности
        await positionsApi.createPosition(positionData);
        // если всё успешно, показываем уведомление
        if (notify) {
          notify.success('Успешно', 'Должность успешно создана');
        } else {
          alert('Должность успешно создана');
        }
        // после успеха переходим обратно к списку должностей
        router.push('/positions');
      } catch (err) {
        console.error(err);
        // проверяем, есть ли в ответе сервера поле errors
        if (err.response?.data?.errors) {
          // если есть, сохраняем их в serverErrors чтобы передать обратно в форму
          serverErrors.value = err.response.data.errors;
          // показ уведомления о том что нужно проверить поля
          if (notify) {
            notify.error('Ошибка', 'Проверьте правильность заполнения полей');
          }
        } else {
          // иначе это общая ошибка, формирование текста сообщения
          const message = err.response?.data?.message || err.message || 'Произошла ошибка';
          if (notify) {
            notify.error('Ошибка', message);
          } else {
            alert('Ошибка: ' + message);
          }
        }
      }
    };

    // возвращаем из setup всё, что нужно исполльзовать в шаблоне
    return {
      goBack,
      handleSubmit,
      serverErrors,
      updateServerErrors
    };
  }
};
</script>

<style scoped>
.create-position-page {
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