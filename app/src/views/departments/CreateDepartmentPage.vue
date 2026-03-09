<template>
  <div class="create-department-page">
    <div class="page-header">
      <h1>Создание нового отдела</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <DepartmentForm
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
// импорт формы отделов
import DepartmentForm from './components/DepartmentForm.vue';
// API для работы с отделами
import { departmentsApi } from '@/services/departmentsApi';

export default {
  name: 'CreateDepartmentPage',
  components: {
    Button,
    DepartmentForm
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

    // функция возврата на страницу с просмотром списка отделов
    const goBack = () => {
      // переходим по указанному адресу
      router.push('/departments');
    };

    // функция для обновления объекта, вызывается, когда надо очистить ошибки
    // какого-то поля после ввода
    const updateServerErrors = (errors) => {
      serverErrors.value = errors; // обновляем реактивную переменную
    };

    // функция которая вызывается когда создаётся новый отдел
    const handleSubmit = async (departmentData) => {
      try {
        // отправляем запрос на сервер для создания отдела
        await departmentsApi.createDepartment(departmentData);
        // если всё успешно, показываем уведомление
        if (notify) {
          notify.success('Успешно', 'Отдел успешно создан');
        } else {
          alert('Отдел успешно создан');
        }
        // после успеха переходим обратно к списку отделов
        router.push('/departments');
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
.create-department-page {
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