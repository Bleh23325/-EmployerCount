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

    <Block title="Кадровая информация">
        <div class="baseVert">
            <div class="baseGoriz">
              Организация
              <Selector
                v-model="localEmployee.id_organization"
                :options="organizationOptions"
              />
            </div>

            <div class="baseGoriz">
              Отдел
              <Selector
                v-model="localEmployee.id_department"
                :options="departmentOptions"
              />
            </div>

            <div class="baseGoriz">
              Должность
              <Selector
                v-model="localEmployee.id_position"
                :options="positionOptions"
              />
            </div>
        </div>
        
        <div class="baseGoriz">
            <label>Оклад (установленный)</label>
            <Input 
                v-model="localEmployee.setting_the_salary" 
                type="number" 
                placeholder="Введите оклад"
            />
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
    const { errors, clearErrors } = EmployeeValidation();
    
    const notificationRef = ref(null);
    const isSubmitting = ref(false);
    
    const today = new Date().toISOString().split('T')[0];

    const organizationOptions = computed(() => {
        return organizations.value.map(org => ({
            value: org.id,
            label: org.name
        }));
    });

    const departmentOptions = computed(() => {
        return departments.value.map(dept => ({
            value: dept.id,
            label: dept.name
        }));
    });

    const positionOptions = computed(() => {
        return positions.value.map(pos => ({
            value: pos.id,
            label: pos.name
        }));
    });

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

    const organizations = ref([]);
    const departments = ref([]);
    const positions = ref([]);

    // Фильтруем отделы по выбранной организации
    const filteredDepartments = computed(() => {
      if (!localEmployee.id_organization) return [];
      return departments.value.filter(
        dept => dept.id_organization === localEmployee.id_organization
      );
    });

    // Загружаем справочники
    const loadDictionaries = async () => {
      try {
        organizations.value = await employeesApi.getOrganizations();
        departments.value = await employeesApi.getDepartments();
        positions.value = await employeesApi.getPositions();
        console.log('Справочники загружены:', {
          organizations: organizations.value,
          departments: departments.value,
          positions: positions.value
        });
      } catch (error) {
        console.error('Ошибка загрузки справочников:', error);
      }
    };

    onMounted(() => {
      loadDictionaries();
    });

    // Отправка формы
    const handleSubmit = async () => {
      clearErrors();

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
      organizations,
      departments,
      positions,
      filteredDepartments,
      handleSubmit,
      handleCancel,
      organizationOptions,
      departmentOptions,
      positionOptions, 
    };
  }
};
</script>