<template>
    <div>
        <p>Поиск сотрудников</p>
        <EmployeeSearch
            v-model="searchQuery"
            @search="handleSearch"
            @clear="handleClearSearch"
            :result-count="filteredEmployees.length"
        >
            <template #results="{ count }">
                <span :class="['search-badge', { 'zero': count === 0 }]">
                    {{ count }} 
                    {{ pluralize(count, ['найден', 'найдено', 'найдено']) }}
                    {{ pluralize(count, ['сотрудник', 'сотрудника', 'сотрудников']) }}
                </span>
            </template>
        </EmployeeSearch>
        <p></p>

        <div v-if="searchQuery">
            <Button @click="searchQuery = ''">
                Очистить
            </Button>

        </div>

        <div v-if="loading">
            Загрузка данных
        </div>


        <table v-else class="employees-table">
            <thead>
                <tr>
                    <th class="skrit">Номер</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Дата рождения</th>
                    <th>Подробные данные</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="employee in filteredEmployees" :key="employee?.id">
                    <td class="skrit">{{ employee.id }}</td>
                    <td>{{ employee.first_name }}</td>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.patronymic }}</td>
                    <td>{{ formatDate(employee.date_of_birth) }}</td>
                    <td class="action-cell">
                        <Button @click="viewPassportData(employee.id_passport_data)">
                            Паспорт
                        </Button>
                        <Button @click="viewRegistrationAddress(employee.id_registration_address)" >
                            Адрес
                        </Button>
                        <Button @click="viewEmployeeFiles(employee.id)"  variant="secondary">
                            Файлы
                        </Button>

                    </td>
                    <td>
                        <Button @click="handleEditEmployee(employee.id)" variant="accent">
                            Изменить
                        </Button>
                        <Button @click="confirmDeleteEmployee(employee?.id, employee?.first_name, employee?.name)" variant="danger">
                            Уволить
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


     <PassportDataModal
      v-model="showPassportModal"
      :data="selectedPassportData"
      @close="showPassportModal = false"
      @update="handleUpdatePassport"
    />
    
    <AddressModal
      v-model="showAddressModal"
      :data="selectedAddressData"
      @close="showAddressModal = false"
      @update="handleUpdateAddress"
    />
    
    <FilesModal
      v-model="showFilesModal"
      :files="selectedEmployeeFiles"
      :employee-id="selectedEmployeeId"
      @close="showFilesModal = false"
      @upload="handleUploadFile"
    />   
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="executeConfirm"
      @cancel="cancelConfirm"
    />
<EmployeeEditModal
    v-if="showEmployeeEditModal"
    :show="true" 
    :data="selectedEmployeeData"
    @close="showEmployeeEditModal = false"
    @update="handleUpdateEmployee"
/>
    
<!-- Модальное окно подтверждения удаления сотрудника -->
<Modal :show="showDeleteConfirmModal" :title="'Подтверждение удаления'" @close="cancelDeleteEmployee">
  <p>Вы уверены, что хотите удалить сотрудника <strong>"{{ deletingEmployeeName }}"</strong>?</p>
  <p class="warning-text">Будут удалены:</p>
  <ul class="warning-list">
    <li>Данные сотрудника</li>
    <li>Паспортные данные</li>
    <li>Адрес регистрации</li>
    <li>Все загруженные файлы</li>
  </ul>
  <p class="warning-text strong">Это действие необратимо!</p>
  <template #footer>
    <Button @click="cancelDeleteEmployee" variant="secondary">Отмена</Button>
    <Button @click="executeDeleteEmployee" variant="danger">Уволить сотрудника</Button>
  </template>
</Modal>
<Notification ref="notificationRef" />
</template>

<script>
import {ref, onMounted, computed } from 'vue';
import { employeesApi } from '@/services/employeesApi';
import{
    Button,
    Modal,
    Notification,
} from '@/components/index';
import PassportDataModal from './components/modals/PassportDataModal.vue';
import AddressModal from './components/modals/AddressModal.vue';
import FilesModal from './components/modals/FilesModal.vue';
import ConfirmModal from './components/modals/ConfimModal.vue';
import EmployeeEditModal from './components/modals/EmployeeEditModal.vue';
import EmployeeSearch from './EmployeeSearch.vue';

export default {
    name:'EmployeesTable',
    components:{
        Button,
        Modal,
        Notification,
        PassportDataModal,
        AddressModal,
        FilesModal,
        ConfirmModal,
        EmployeeEditModal,
        EmployeeSearch
    },
    setup(){
        const notificationRef = ref(null);

        // Состояние для модального окна подтверждения
        const showDeleteConfirmModal = ref(false);
        const deletingEmployeeId = ref(null);
        const deletingEmployeeName = ref('');

        // Подтверждение удаления сотрудника
        const confirmDeleteEmployee = (id, firstName, name) => {
        deletingEmployeeId.value = id;
        deletingEmployeeName.value = `${firstName} ${name}`;
        showDeleteConfirmModal.value = true;
        };

        // Отмена удаления
        const cancelDeleteEmployee = () => {
        showDeleteConfirmModal.value = false;
        deletingEmployeeId.value = null;
        deletingEmployeeName.value = '';
        };

        
        const searchQuery = ref('');


        const filteredEmployees = computed(() => {
            if (!searchQuery.value.trim()) {
                return employees.value;
            }

            const query = searchQuery.value.toLowerCase().trim();
            
            return employees.value.filter(employee => {
                // Разбиваем запрос на отдельные слова
                const queryWords = query.split(/\s+/).filter(word => word.length > 0);
                
                // Собираем все данные сотрудника в одну строку для поиска
                const employeeData = [
                    employee.first_name || '',
                    employee.name || '',
                    employee.patronymic || ''
                ].join(' ').toLowerCase();
                
                // Проверяем, что ВСЕ слова из запроса встречаются в данных сотрудника
                return queryWords.every(word => employeeData.includes(word));
            });
        });


        // Обработчики поиска
        const handleSearch = (value) => {
            console.log('Поиск:', value);
        };

        const handleClearSearch = () => {
            console.log('Поиск очищен');
        };

        // Функция для склонения
        const pluralize = (count, words) => {
            const cases = [2, 0, 1, 1, 1, 2];
            return words[
                count % 100 > 4 && count % 100 < 20 
                    ? 2 
                    : cases[Math.min(count % 10, 5)]
            ];
        };

        const executeDeleteEmployee = async () => {
        if (!deletingEmployeeId.value) return;
        
        const employee = employees.value.find(e => e.id === deletingEmployeeId.value);
        if (!employee) return;
        
        const notification = notificationRef.value;
        let deleteError = null;
        
        try {
            if (notification) {
            notification.info('Удаление', 'Начинаем удаление данных сотрудника...', 2000);
            }
            
            if (employee.id) {
            try {
                const files = await employeesApi.getEmployeeFiles(employee.id);
                for (const file of files) {
                await employeesApi.deleteFile(file.id);
                }
                if (files.length > 0 && notification) {
                notification.success('Файлы', `Удалено файлов: ${files.length}`, 2000);
                }
            } catch (fileError) {
                console.error('Ошибка при удалении файлов:', fileError);
                if (notification) {
                notification.warning('Внимание', 'Не удалось удалить некоторые файлы', 3000);
                }
            }
            }
            
            if (employee.id_passport_data) {
            try {
                await employeesApi.deletePassportData(employee.id_passport_data);
                if (notification) {
                notification.success('Паспорт', 'Паспортные данные удалены', 2000);
                }
            } catch (passportError) {
                console.error('Ошибка при удалении паспортных данных:', passportError);
                if (notification) {
                notification.warning('Внимание', 'Не удалось удалить паспортные данные', 3000);
                }
            }
            }
            
            if (employee.id_registration_address) {
            try {
                await employeesApi.deleteRegistrationAddress(employee.id_registration_address);
                if (notification) {
                notification.success('Адрес', 'Адрес регистрации удален', 2000);
                }
            } catch (addressError) {
                console.error('Ошибка при удалении адреса:', addressError);
                if (notification) {
                notification.warning('Внимание', 'Не удалось удалить адрес регистрации', 3000);
                }
            }
            }
            
            await employeesApi.deleteEmployee(deletingEmployeeId.value);
            
            await loadEmployees();
            
            if (notification) {
            notification.success(
                'Успешно', 
                `Сотрудник "${deletingEmployeeName.value}" и все его данные удалены`, 
                5000
            );
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
            deleteError = error;
        } 
        
        showDeleteConfirmModal.value = false;
        deletingEmployeeId.value = null;
        deletingEmployeeName.value = '';
        
        if (deleteError) {
            const newNotification = notificationRef.value;
            if (newNotification) {
            newNotification.error(
                'Ошибка', 
                deleteError.response?.data?.message || 'Не удалось полностью удалить данные сотрудника', 
                7000
            );
            } else {
            alert('Ошибка: ' + (deleteError.response?.data?.message || 'Не удалось удалить данные'));
            }
        }
        };

        const employees = ref([]);
        const loading = ref(true);
        const error = ref(null);

        const showPassportModal = ref(false);
        const showAddressModal = ref(false);
        const showFilesModal = ref(false);

        const selectedPassportData = ref(null);
        const selectedAddressData = ref(null);
        const selectedEmployeeFiles = ref([]);
        const selectedEmployeeId = ref(null);

        const formatDate = (dateString) => {
            if (!dateString) return '—';
            return new Date(dateString).toLocaleDateString('ru-RU');
        };

        const loadEmployees = async () => {
            try {
                loading.value = true;
                employees.value = await employeesApi.getEmployees();
            } catch (err) {
                error.value = 'Не удалось загрузить список сотрудников';
                console.error(err);
            } finally {
                loading.value = false;
            }
        };

        const viewPassportData = async (passportDataId) => {
            if (!passportDataId) {
                alert('Паспортные данные отсутствуют');
                return;
            }
            
            try {
                const data = await employeesApi.getPassportData(passportDataId);
                selectedPassportData.value = data;
                showPassportModal.value = true;
            } catch (err) {
                alert('Ошибка при загрузке паспортных данных');
            }
        };

        const viewRegistrationAddress = async (addressId) => {
            if (!addressId) {
                alert('Адрес регистрации отсутствует');
                return;
            }
            
            try {
                const data = await employeesApi.getRegistrationAddress(addressId);
                selectedAddressData.value = data;
                showAddressModal.value = true;
            } catch (err) {
                alert('Ошибка при загрузке адреса регистрации');
            }
        };

        const viewEmployeeFiles = async (employeeId) => {
            try {
                selectedEmployeeId.value = employeeId;
                const files = await employeesApi.getEmployeeFiles(employeeId);
                selectedEmployeeFiles.value = files;
                showFilesModal.value = true;
            } catch (err) {
                alert('Ошибка при загрузке файлов');
            }
        };
       const handleUpdatePassport = async (data) => {
            try {
                let employeeId = selectedEmployeeId.value;
                
                if (!employeeId && data.id) {
                    const employee = employees.value.find(e => e.id_passport_data === data.id);
                    if (employee) {
                        employeeId = employee.id;
                    }
                }

                const employee = employees.value.find(e => e.id === employeeId);
                
                if (!employee) {
                    console.error('Сотрудник не найден');
                    if (notificationRef.value) {
                        notificationRef.value.error('Ошибка', 'Сотрудник не найден', 3000);
                    }
                    return;
                }

                if (!employee.id_passport_data) {
                    console.error('ID паспортных данных не найден');
                    if (notificationRef.value) {
                        notificationRef.value.error('Ошибка', 'ID паспортных данных не найден', 3000);
                    }
                    return;
                }

                const cleanData = {
                    series: String(data.series || '').replace(/\D/g, ''),
                    number: String(data.number || '').replace(/\D/g, ''),
                    date_of_issue: data.date_of_issue,
                    unit_code: data.unit_code ? String(data.unit_code).replace(/\D/g, '') : '',
                    issued_by_whom: String(data.issued_by_whom || '')
                };

                console.log('Отправка данных на обновление:', cleanData);
                console.log('ID паспортных данных:', employee.id_passport_data);

                await employeesApi.updatePassportData(employee.id_passport_data, cleanData);
                
                await loadEmployees();
                
                showPassportModal.value = false;
                
                if (notificationRef.value) {
                    notificationRef.value.success('Успех', 'Паспортные данные успешно обновлены', 3000);
                }
            } catch (error) {
                console.error('Ошибка при обновлении паспортных данных:', error);
                if (notificationRef.value) {
                    notificationRef.value.error('Ошибка', 'Ошибка при обновлении паспортных данных: ' + error.message, 5000);
                }
            }
        };
        const handleUpdateAddress = async (updatedData) => {
            try {
                await employeesApi.updateRegistrationAddress(updatedData.id, updatedData);
                await loadEmployees();
                
                if (notificationRef.value) {
                    notificationRef.value.success('Успех', 'Адрес регистрации обновлен', 3000);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                if (notificationRef.value) {
                    notificationRef.value.error('Ошибка', 'Не удалось обновить адрес', 5000);
                }
            }
        };
        
        const handleUploadFile = async (files) => {
            
            if (!selectedEmployeeId.value) {
                console.error('ID сотрудника не указан');
                return;
            }
            
            try {
                for (const file of files) {
                    const fileData = {
                        id_employees: String(selectedEmployeeId.value),
                        name: file.name,
                        file: file.path || file.name
                    };
                    
                    console.log('Сохраняем файл:', fileData);
                    
                    await employeesApi.createFile(fileData);
                }
                
                const updatedFiles = await employeesApi.getEmployeeFiles(selectedEmployeeId.value);
                console.log('Обновленный список файлов:', updatedFiles);
                selectedEmployeeFiles.value = updatedFiles;
                
            } catch (error) {
                console.error('Ошибка при загрузке файлов:', error);
            }
};
        const showEmployeeEditModal = ref(false);
        const selectedEmployeeData = ref(null);

        const handleEditEmployee = (employeeId) => {
            const employee = employees.value.find(e => e.id === employeeId);
            
            if (employee) {
                selectedEmployeeData.value = employee;
                showEmployeeEditModal.value = true;
            }
        };

        const handleUpdateEmployee = async (updatedData) => {
            try {
                await employeesApi.updateEmployee(updatedData.id, updatedData);
                await loadEmployees();
                
                if (notificationRef.value) {
                    notificationRef.value.success('Успех', 'Данные сотрудника обновлены', 3000);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                if (notificationRef.value) {
                    notificationRef.value.error('Ошибка', 'Не удалось обновить данные сотрудника', 5000);
                }
            }
        };

        onMounted(() => {
            loadEmployees();
        });

        return {
            employees,
            loading,
            error,
            searchQuery,
            filteredEmployees,
            handleSearch,
            handleClearSearch,
            pluralize,
            formatDate,
            viewPassportData,
            viewRegistrationAddress,
            viewEmployeeFiles,
            showPassportModal,
            showAddressModal,
            showFilesModal,
            selectedPassportData,
            selectedAddressData,
            selectedEmployeeFiles,
            selectedEmployeeId,
            confirmDeleteEmployee,  
            cancelDeleteEmployee,
            executeDeleteEmployee,
            showDeleteConfirmModal,
            deletingEmployeeName,
            notificationRef,
            handleUpdatePassport,
            handleUpdateAddress,
            handleEditEmployee,
            handleUpdateEmployee,
            showEmployeeEditModal,
            selectedEmployeeData,
            handleUploadFile
        };
    }
}
</script>
<style scoped>
.employees-table-container {
    padding: 20px;
    max-width: 100%;
    margin: 0 20px;
    overflow-x: auto;
}

.employees-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  table-layout: auto; /*авто ширина колонок */
}

.employees-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
  white-space: nowrap; /**заголовки не переносятся */
}

.employees-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.loading-indicator {
  text-align: center;
  padding: 40px;
  color: #666;
}

.skrit{
    display: none;
}


</style>