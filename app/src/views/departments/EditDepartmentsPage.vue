<template>
  <div class="edit-department-page">
    <div class="page-header">
      <h1>Редактирование отдела</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <div v-if="loading" class="loading-indicator">Загрузка данных...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <DepartmentForm
      v-else
      :initialData="department"
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
// форма отделов
import DepartmentForm from './components/DepartmentForm.vue';
// api для работы с отделами
import { departmentsApi } from '@/services/departmentsApi';

export default {
  name: 'EditDepartmentPage',
  // регистрируем дочерние компоненты
  components: {
    Button,
    DepartmentForm
  },
  setup() {
    // даёт возможность программно переходить по страницам
    const router = useRouter();
    // ползволяет получить параметры текущего маршрута
    const route = useRoute();
    // извлекаем айди должности из адресной строки
    const departmentId = route.params.id;

    // хранит данные загруженного отдела
    const department = ref(null);
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
      router.push('/departments');
    };

    // обновить объект serverErrors, когда нужно очистить ошибки поля
    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    // загрузка данных
    const fetchDepartment = async () => {
      try {
        loading.value = true; // включается загрузка
        // отправляем запрос на получение данных по айди
        const data = await departmentsApi.getDepartment(departmentId);
        department.value = data;
      } catch (err) {
        console.error(err);
        // текст ошибки
        error.value = 'Не удалось загрузить данные отдела';
        // показ уведомления ошибки
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить данные отдела');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false; // загрузка окончена
      }
    };

    // отправка обновлённых данных на сервер
    const handleSubmit = async (departmentData) => {
      try {
        // отправляем запрос на обновление данных
        await departmentsApi.updateDepartment(departmentId, departmentData);
        if (notify) {
          // если всё успешно показываем уведомление
          notify.success('Успешно', 'Отдел успешно обновлён');
        } else {
          alert('Отдел успешно обновлён');
        }
        // возвращаемся на страницу со списком
        router.push('/departments');
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
    onMounted(fetchDepartment);

    // возвращение данных и функций
    return {
      department, // данные отделов
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
.edit-department-page {
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