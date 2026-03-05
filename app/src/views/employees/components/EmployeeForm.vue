<template>
  <div class="employee-form">
    <!-- Основные данные сотрудника -->
    <Block title="Основные данные">
      <div class="baseGoriz">
        <div class="baseVert">
          <label>Фамилия <span class="required">*</span></label>
          <Input
            v-model="localEmployee.first_name"
            :error="errors.first_name"
            placeholder="Иванов"
          />
        </div>

        <div class="baseVert">
          <label>Имя <span class="required">*</span></label>
          <Input
            v-model="localEmployee.name"
            :error="errors.name"
            placeholder="Иван"
          />
        </div>

        <div class="baseVert">
          <label>Отчество</label>
          <Input
            v-model="localEmployee.patronymic"
            :error="errors.patronymic"
            placeholder="Иванович"
          />
        </div>
      </div>

      <div class="baseGoriz">
        <div class="baseVert">
          <label>Дата рождения <span class="required">*</span></label>
          <Input
            v-model="localEmployee.date_of_birth"
            type="date"
            :error="errors.date_of_birth"
            :max="today"
          />
        </div>
      </div>
    </Block>

    <!-- Паспортные данные -->
    <PassportDataForm
      v-model="localEmployee.passportData"
      :errors="errors"
    />

    <!-- Адрес регистрации -->
    <RegistrationAddressForm
      v-model="localEmployee.addressData"
      :errors="errors"
    />

    <!-- Файлы -->
    <FileUploadForm
      v-model="localEmployee.files"
      :errors="errors"
    />

    <!-- Действия -->
    <div class="form-actions">
      <Button @click="handleSubmit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Сохранение...' : 'Создать сотрудника' }}
      </Button>
      <Button @click="handleCancel" variant="secondary">Отмена</Button>
    </div>

    <!-- Уведомления -->
    <Notification
      ref="notificationRef"
    />
  </div>
</template>

<script>
import { ref, reactive, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { Block, Input, Button, Notification } from '@/components/index';
import PassportDataForm from './PassportDataForm.vue';
import RegistrationAddressForm from './RegistrationAddressForm.vue';
import FileUploadForm from './FileUploadForm.vue';
import { EmployeeValidation } from '../composables/EmployeeeValidation';
import { employeesApi } from '@/services/employeesApi';

export default {
  name: 'EmployeeForm',
  components: {
    Block,
    Input,
    Button,
    Notification,
    PassportDataForm,
    RegistrationAddressForm,
    FileUploadForm
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {


    
    const router = useRouter();
    const { errors, validateAll, clearErrors } = EmployeeValidation();
    
    const notificationRef = ref(null);
    const isSubmitting = ref(false);
    
    const today = new Date().toISOString().split('T')[0];

    // Данные формы
    const localEmployee = reactive({
      first_name: '',
      name: '',
      patronymic: '',
      date_of_birth: '',
      passportData: {
        series: '',
        number: '',
        date_of_issue: '',
        unit_code: '',
        issued_by_whom: ''
      },
      addressData: {
        region: '',
        locality: '',
        street: '',
        house: '',
        building: '',
        apartament: ''
      },
      files: []
    });

    // Отправка формы
    const handleSubmit = async () => {
      // Очищаем старые ошибки
      clearErrors();


  // Если валидация прошла - отправляем
  isSubmitting.value = true;

  try {
    const result = await employeesApi.createFullEmployee({
      first_name: localEmployee.first_name,
      name: localEmployee.name,
      patronymic: localEmployee.patronymic,
      date_of_birth: localEmployee.date_of_birth,
      passportData: localEmployee.passportData,
      addressData: localEmployee.addressData,
      files: localEmployee.files
    });
        
        if (notificationRef.value) {
          notificationRef.value.success(
            'Успешно!',
            'Сотрудник успешно создан',
            3000
          );
        }
        
        console.log('Результат создания:', result);
        
        setTimeout(() => {
          router.push('/employees');
        }, 1500);
        
      } catch (error) {
        if (notificationRef.value) {
          notificationRef.value.error(
            'Ошибка',
            error.response?.data?.message || error.message || 'Ошибка при создании сотрудника',
            5000
          );
        }
        console.error('Error creating employee:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleCancel = () => {
      emit('cancel');
      router.push('/employees');
    };

    return {
      localEmployee,
      errors,
      isSubmitting,
      today,
      notificationRef,
      handleSubmit,
      handleCancel
    };
  }
};
</script>