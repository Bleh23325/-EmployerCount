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
            @blur="validateField('first_name')"
          />
        </div>

        <div class="baseVert">
          <label>Имя <span class="required">*</span></label>
          <Input
            v-model="localEmployee.name"
            :error="errors.name"
            placeholder="Иван"
            @blur="validateField('name')"
          />
        </div>

        <div class="baseVert">
          <label>Отчество</label>
          <Input
            v-model="localEmployee.patronymic"
            :error="errors.patronymic"
            placeholder="Иванович"
            @blur="validateField('patronymic')"
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
            @blur="validateField('date_of_birth')"
          />
        </div>
      </div>
    </Block>

    <Block title="Кадровая информация">
        <div class="baseVert">
            <div class="baseGoriz">
              <span class="label">Организация <span class="required">*</span></span>
              <Selector
                v-model="localEmployee.id_organization"
                :options="organizationOptions"
                :error="errors.id_organization"
                placeholder="Выберите организацию"
                @update:modelValue="handleOrganizationChange"
                @blur="validateField('id_organization')"
              />
            </div>

            <div class="baseGoriz">
              <span class="label">Отдел <span class="required">*</span></span>
              <Selector
                v-model="localEmployee.id_department"
                :options="departmentOptions"
                :error="errors.id_department"
                placeholder="Выберите отдел"
                :disabled="!localEmployee.id_organization"
                @update:modelValue="validateField('id_department')"
                @blur="validateField('id_department')"
              />
            </div>

            <div class="baseGoriz">
              <span class="label">Должность <span class="required">*</span></span>
              <Selector
                v-model="localEmployee.id_position"
                :options="positionOptions"
                :error="errors.id_position"
                placeholder="Выберите должность"
                @update:modelValue="validateField('id_position')"
                @blur="validateField('id_position')"
              />
            </div>
        </div>
        
        <div class="baseGoriz">
            <span class="label">Оклад (установленный)</span>
            <Input 
                v-model="localEmployee.setting_the_salary" 
                type="number" 
                placeholder="Введите оклад"
                :error="errors.setting_the_salary"
                @blur="validateField('setting_the_salary')"
            />
        </div>
    </Block>

    <!-- Паспортные данные -->
    <PassportDataForm
      v-model="localEmployee.passportData"
      :errors="errors"
      @validate="validatePassportField"
    />

    <!-- Адрес регистрации -->
    <RegistrationAddressForm
      v-model="localEmployee.addressData"
      :errors="errors"
      @validate="validateAddressField"
    />

    <!-- Файлы -->
    <FileUploadForm
      v-model="localEmployee.files"
      :errors="errors"
      @validate="validateFile"
    />

    <!-- Действия -->
    <div class="form-actions">
      <Button @click="handleSubmit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Сохранение...' : 'Создать сотрудника' }}
      </Button>
      <Button @click="handleCancel" variant="secondary">Отмена</Button>
    </div>

    <!-- Уведомления -->
    <Notification ref="notificationRef" />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Block, Input, Button, Notification, Selector } from '@/components/index';
import PassportDataForm from './PassportDataForm.vue';
import RegistrationAddressForm from './RegistrationAddressForm.vue';
import FileUploadForm from './FileUploadForm.vue';
import { EmployeeValidation } from '../composables/EmployeeeValidation';
import { employeesApi } from '@/services/employeesApi';
//API для справочников
import { departmentsApi } from '@/services/departmentsApi';
import { organizationsApi } from '@/services/organizationsApi';
import { positionsApi } from '@/services/positionsApi';

export default {
  name: 'EmployeeForm',
  components: {
    Block,
    Input,
    Button,
    Notification,
    Selector,
    PassportDataForm,
    RegistrationAddressForm,
    FileUploadForm
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const router = useRouter();
    const { 
      errors, 
      validateEmployee, 
      validatePassportData, 
      validateAddress, 
      validateFile,
      clearErrors,
      formatErrorMessages 
    } = EmployeeValidation();
    
    const notificationRef = ref(null);
    const isSubmitting = ref(false);
    
    const today = new Date().toISOString().split('T')[0];

    // Данные сотрудника
    const localEmployee = reactive({
      first_name: '',
      name: '',
      patronymic: '',
      date_of_birth: '',
      id_organization: '',
      id_department: '',
      id_position: '',
      setting_the_salary: '',
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

    // Справочники
    const organizations = ref([]);
    const departments = ref([]);
    const positions = ref([]);

    // Опции для селектора организаций
    const organizationOptions = computed(() => {
      if (!organizations.value || !Array.isArray(organizations.value)) return [];
      return organizations.value.map(org => ({
        value: org.id,
        label: org.name || org.title || 'Без названия'
      }));
    });

    // Опции для селектора должностей
    const positionOptions = computed(() => {
      if (!positions.value || !Array.isArray(positions.value)) return [];
      return positions.value.map(pos => ({
        value: pos.id,
        label: pos.name || pos.title || 'Без названия'
      }));
    });

    // Фильтруем отделы по выбранной организации
    const departmentOptions = computed(() => {
      
      if (!localEmployee.id_organization) {
        return [];
      }
      
      if (!departments.value || !Array.isArray(departments.value)) {
        console.warn('departments.value не массив:', departments.value);
        return [];
      }
      
      if (departments.value.length === 0) {
        return [];
      }
      
      const selectedOrgId = Number(localEmployee.id_organization);
      
      
      const filtered = departments.value.filter(dept => {
        const deptOrgId = Number(dept.id_organization);
        const match = deptOrgId === selectedOrgId;
        
        
        return match;
      });
      
      // Преобразуем в опции для Selector
      const options = filtered.map(dept => ({
        value: dept.id,
        label: dept.name
      }));
      
      
      return options;
    });

    // Сброс отдела при смене организации
    const handleOrganizationChange = (value) => {
      
      localEmployee.id_organization = value;
      localEmployee.id_department = '';
      
      validateField('id_organization');
      
    };

    // Загружаем справочники
    const loadDictionaries = async () => {
      try {
        
        const [orgs, depts, pos] = await Promise.all([
          organizationsApi.getOrganizations(),
          departmentsApi.getDepartments(),
          positionsApi.getPositions()
        ]);
        
        
        // Присваиваем значения
        organizations.value = orgs || [];
        departments.value = depts || [];
        positions.value = pos || [];
        
        // Принудительно вызываем пересчет computed
        const options = departmentOptions.value;
        
      } catch (error) {
        console.error('Ошибка загрузки справочников:', error);
      }
    };

    onMounted(() => {
      loadDictionaries();
    });

    // Валидация отдельного поля
    const validateField = (fieldName) => {
      const employeeData = {
        first_name: localEmployee.first_name,
        name: localEmployee.name,
        patronymic: localEmployee.patronymic,
        date_of_birth: localEmployee.date_of_birth,
        id_organization: localEmployee.id_organization,
        id_department: localEmployee.id_department,
        id_position: localEmployee.id_position,
        setting_the_salary: localEmployee.setting_the_salary
      };
      
      validateEmployee(employeeData);
    };

    // Валидация поля паспорта
    const validatePassportField = (fieldName) => {
      validatePassportData(localEmployee.passportData);
    };

    // Валидация поля адреса
    const validateAddressField = (fieldName) => {
      validateAddress(localEmployee.addressData);
    };

    // Валидация всей формы
    const validateForm = () => {
      const employeeData = {
        first_name: localEmployee.first_name,
        name: localEmployee.name,
        patronymic: localEmployee.patronymic,
        date_of_birth: localEmployee.date_of_birth,
        id_organization: localEmployee.id_organization,
        id_department: localEmployee.id_department,
        id_position: localEmployee.id_position,
        setting_the_salary: localEmployee.setting_the_salary
      };

      const isEmployeeValid = validateEmployee(employeeData);
      const isPassportValid = validatePassportData(localEmployee.passportData);
      const isAddressValid = validateAddress(localEmployee.addressData);
      
      return isEmployeeValid && isPassportValid && isAddressValid;
    };

    // Отправка формы
    const handleSubmit = async () => {
      clearErrors();

      if (!validateForm()) {
        if (notificationRef.value) {
          const errorMessage = formatErrorMessages(3);
          notificationRef.value.error(
            'Ошибка валидации',
            errorMessage || 'Пожалуйста, исправьте ошибки в форме',
            5000
          );
        }
        return;
      }

      isSubmitting.value = true;

      try {
        const result = await employeesApi.createFullEmployee({
          first_name: localEmployee.first_name,
          name: localEmployee.name,
          patronymic: localEmployee.patronymic,
          date_of_birth: localEmployee.date_of_birth,
          id_organization: localEmployee.id_organization,
          id_department: localEmployee.id_department,
          id_position: localEmployee.id_position,
          setting_the_salary: localEmployee.setting_the_salary,
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
      organizationOptions,
      departmentOptions,
      positionOptions,
      handleSubmit,
      handleCancel,
      handleOrganizationChange,
      validateField,
      validatePassportField,
      validateAddressField,
      validateFile,
      formatErrorMessages
    };
  }
};
</script>

<style scoped>
.employee-form {
  max-width: 800px;
  margin: 0 auto;
}

.baseGoriz {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  align-items: center;
}

.baseVert {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  min-width: 150px;
  font-weight: 500;
}

.required {
  color: red;
  margin-left: 3px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>