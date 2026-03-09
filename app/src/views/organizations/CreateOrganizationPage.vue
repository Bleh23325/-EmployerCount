<template>
  <div class="create-organization-page">
    <div class="page-header">
      <h1>Создание новой организации</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <OrganizationForm 
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
// импорт формы организаций
import OrganizationForm from './components/OrganizationForm.vue';
// API для работы с организациями
import { organizationsApi } from '@/services/organizationsApi';

export default {
  name: 'CreateOrganizationPage',
  components: {
    Button,
    OrganizationForm
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

    // функция возврата на страницу с просмотром списка организаций
    const goBack = () => {
      // переходим по указанному адресу
      router.push('/organizations');
    };

    // функция для обновления объекта, вызывается, когда надо очистить ошибки
    // какого-то поля после ввода
    const updateServerErrors = (errors) => {
      serverErrors.value = errors; // обновляем реактивную переменную
    };

     // функция которая вызывается когда создаётся новая организация
   const handleSubmit = async (organizationData) => {
  try {
    // для правильной работы отправки дат
    const payload = {
      ...organizationData,
      add_at: new Date().toISOString(), // текущая дата
      update_at: null,
      delete_at: null
    };
    // отправляем запрос на сервер для создания организации
    await organizationsApi.createOrganization(payload);
    // если всё успешно, показываем уведомление
    if (notify) {
      notify.success('Успешно', 'Организация успешно создана');
    } else {
      alert('Организация успешно создана');
    }
    // после успеха переходим обратно к списку организаций
    router.push('/organizations');
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

// возвращает всё
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
.create-organization-page {
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