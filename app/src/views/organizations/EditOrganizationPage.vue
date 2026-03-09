<template>
  <div class="edit-organization-page">
    <div class="page-header">
      <h1>Редактирование организации</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <div v-if="loading" class="loading-indicator">Загрузка данных...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <OrganizationForm 
      v-else
      :initialData="organization"
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
// форма организаций
import OrganizationForm from './components/OrganizationForm.vue';
// api для работы с организациями
import { organizationsApi } from '@/services/organizationsApi';

export default {
  name: 'EditOrganizationPage',
  // регистрируем дочерние компоненты
  components: {
    Button,
    OrganizationForm
  },
  setup() {
    // даёт возможность программно переходить по страницам
    const router = useRouter();
    // ползволяет получить параметры текущего маршрута
    const route = useRoute();
    // извлекаем айди должности из адресной строки
    const organizationId = route.params.id;

    // хранит данные загруженной организации
    const organization = ref(null);
    // флаг загрузки
    const loading = ref(true);
    // текст ошибки
    const error = ref(null);
    // объект с ошибками валидации от сервера
    const serverErrors = ref({});
    // из глобальных свойств получаем плагин уведомлений
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    // вернуться на страницу со списком
    const goBack = () => {
      router.push('/organizations');
    };

    // обновить объект serverErrors, когда нужно очистить ошибки поля
    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    // загрузка данных
    const fetchOrganization = async () => {
      try {
        loading.value = true; // включается загрузка
        // отправляем запрос на получение данных по айди
        organization.value = await organizationsApi.getOrganization(organizationId);
      } catch (err) {
        console.error(err);
        // текст ошибки
        error.value = 'Не удалось загрузить данные организации';
        // показ уведомления ошибки
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить данные организации');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false; // загрузка окончена
      }
    };

    // отправка обновлённых данных на сервер
    const handleSubmit = async (organizationData) => {
      try {
        // отправляем запрос на обновление данных
        await organizationsApi.updateOrganization(organizationId, organizationData);
        // если всё успешно показываем уведомление
        if (notify) {
          notify.success('Успешно', 'Организация успешно обновлена');
        } else {
          alert('Организация успешно обновлена');
        }
        // возвращаемся на страницу со списком
        router.push('/organizations');
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
    onMounted(fetchOrganization);

    // возвращение данных и функций
    return {
      organization, // данные организации
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
.edit-organization-page {
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