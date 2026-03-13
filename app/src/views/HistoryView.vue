<template>
  <div class="history-container">
    <UiBlock title="История изменений">
      <!-- Состояние загрузки -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка истории изменений...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="error">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
        <div class="error-details" v-if="errorDetails">
          <pre>{{ errorDetails }}</pre>
        </div>
        <UiButton @click="fetchHistory" variant="primary">Повторить загрузку</UiButton>
      </div>

      <!-- Пусто -->
      <div v-else-if="historyItems.length === 0" class="empty">
        <div class="empty-icon">📋</div>
        <p>История изменений пуста</p>
      </div>

      <!-- Таблица с историей -->
      <div v-else class="history-table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>Дата и время</th>
              <th>Объект операции</th>
              <th>Кто изменил</th>
              <th>Изменённые поля</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in historyItems" :key="item.id" :class="getRowClass(item)">
              <td>{{ formatDate(item.date_and_time_of_the_operation) }}</td>
              <td>
                <span class="object-badge" :class="getObjectClass(item.the_object_of_operation)">
                  {{ item.the_object_of_operation }}
                </span>
              </td>
              <td>{{ getUserName(item.who_changed_it) }}</td>
              <td>
                <button
                  v-if="item.changed_fields && Object.keys(item.changed_fields).length > 0"
                  class="view-fields-btn"
                  @click="toggleFields(item.id)"
                >
                  {{ expandedFields[item.id] ? 'Скрыть' : 'Показать' }} ({{ Object.keys(item.changed_fields).length }})
                </button>
                <span v-else>—</span>

                <div v-if="expandedFields[item.id] && item.changed_fields" class="changed-fields">
                  <div v-for="(value, key) in item.changed_fields" :key="key" class="field-item">
                    <strong>{{ key }}:</strong>
                    <div class="field-values">
                      <span class="old-value">было: {{ formatValue(value.old) }}</span>
                      <span class="new-value">стало: {{ formatValue(value.new) }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <button
                  class="delete-btn"
                  @click="confirmDelete(item)"
                  :disabled="deletingId === item.id"
                >
                  {{ deletingId === item.id ? 'Удаление...' : 'Удалить' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiBlock>

    <!-- Модальное окно подтверждения удаления -->
    <UiModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="Подтверждение удаления"
      @update:show="showDeleteModal = false"
    >
      <p>Вы уверены, что хотите удалить запись истории?</p>
      <p class="modal-details">
        <strong>Дата:</strong> {{ formatDate(selectedItem?.date_and_time_of_the_operation) }}<br>
        <strong>Объект:</strong> {{ selectedItem?.the_object_of_operation }}
      </p>

      <template #footer>
        <UiButton @click="showDeleteModal = false" variant="secondary">Отмена</UiButton>
        <UiButton @click="handleDelete" variant="accent" :disabled="isDeleting">
          {{ isDeleting ? 'Удаление...' : 'Удалить' }}
        </UiButton>
      </template>
    </UiModal>

    <!-- Уведомления -->
    <div class="notifications">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
        @click="removeNotification(notification.id)"
      >
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import UiBlock from '@/components/UiBlock.vue'
import UiButton from '@/components/UiButton.vue'
import UiModal from '@/components/UiModal.vue'
import api from '@/services/api'

const historyItems = ref([])
const loading = ref(true)
const error = ref(null)
const errorDetails = ref(null)
const deletingId = ref(null)
const isDeleting = ref(false)
const showDeleteModal = ref(false)
const selectedItem = ref(null)
const expandedFields = reactive({})

// Уведомления
const notifications = ref([])

const addNotification = (message, type = 'success') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  setTimeout(() => {
    removeNotification(id)
  }, 5000)
}

const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

// Загрузка данных
const fetchHistory = async () => {
  loading.value = true
  error.value = null
  errorDetails.value = null

  try {
    historyItems.value = await api.get('/history')
  } catch (err) {
    console.error('Ошибка загрузки истории:', err)
    error.value = err.message || 'Не удалось загрузить историю изменений'

    if (err.data) {
      errorDetails.value = JSON.stringify(err.data, null, 2)
    }

    if (err.status === 401) {
      error.value = 'Не авторизован. Пожалуйста, войдите в систему.'
    } else if (err.status === 500) {
      error.value = 'Ошибка сервера. Попробуйте позже.'
    }
  } finally {
    loading.value = false
  }
}

// Подтверждение удаления
const confirmDelete = (item) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

// Удаление записи
const handleDelete = async () => {
  if (!selectedItem.value) return

  isDeleting.value = true
  deletingId.value = selectedItem.value.id

  try {
    console.log('Отправка DELETE запроса для ID:', selectedItem.value.id)

    const response = await api.delete(`/history/${selectedItem.value.id}`)

    console.log('Ответ от сервера:', response)

    // Удаляем из списка
    historyItems.value = historyItems.value.filter(item => item.id !== selectedItem.value.id)

    // Уведомление об успехе
    addNotification('Запись успешно удалена', 'success')

    // Закрываем модалку
    showDeleteModal.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Ошибка удаления:', err)

    // Уведомление об ошибке
    let errorMessage = err.message || 'Не удалось удалить запись'

    if (err.status === 401) {
      errorMessage = 'Не авторизован. Пожалуйста, войдите в систему.'
    } else if (err.status === 403) {
      errorMessage = 'Нет прав для удаления этой записи'
    } else if (err.status === 404) {
      errorMessage = 'Запись не найдена'
    } else if (err.status === 500) {
      errorMessage = 'Ошибка сервера. Попробуйте позже'
    }

    addNotification(errorMessage, 'error')
  } finally {
    isDeleting.value = false
    deletingId.value = null
  }
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Получение имени пользователя (заглушка)
const getUserName = (userId) => {
  if (!userId) return 'Система'
  // Здесь можно добавить маппинг ID → имя
  return `Пользователь ${userId}`
}

// Форматирование значения
const formatValue = (value) => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

// Класс для строки таблицы
const getRowClass = (item) => {
  const operation = item.the_object_of_operation?.toLowerCase() || ''
  if (operation.includes('delete')) return 'row-delete'
  if (operation.includes('update')) return 'row-update'
  if (operation.includes('insert')) return 'row-insert'
  return ''
}

// Класс для бейджа объекта
const getObjectClass = (objectName) => {
  const name = objectName?.toLowerCase() || ''
  if (name.includes('employee')) return 'badge-employee'
  if (name.includes('passport')) return 'badge-passport'
  if (name.includes('file')) return 'badge-file'
  if (name.includes('registration')) return 'badge-registration'
  return ''
}

// Показать/скрыть поля
const toggleFields = (id) => {
  expandedFields[id] = !expandedFields[id]
}

// Инициализация
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('error') === 'unauthorized') {
    error.value = 'Не авторизован. Пожалуйста, войдите в систему.'
    loading.value = false
  } else {
    fetchHistory()
  }
})
</script>

<style scoped>
.history-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  position: relative;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ff8c00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 40px;
  color: #f44336;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-message {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.error-details {
  background: #ffebee;
  padding: 15px;
  border-radius: 4px;
  margin: 20px auto;
  max-width: 600px;
  text-align: left;
  font-size: 0.9rem;
  overflow-x: auto;
}

.empty {
  text-align: center;
  padding: 60px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.history-table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 0.9rem;
}

.history-table th {
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

.history-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.history-table tr:hover {
  background: #f9f9f9;
}

.row-delete {
  background-color: rgba(244, 67, 54, 0.05);
}
.row-update {
  background-color: rgba(33, 150, 243, 0.05);
}
.row-insert {
  background-color: rgba(76, 175, 80, 0.05);
}

.object-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-employee {
  background: #e3f2fd;
  color: #1976d2;
}
.badge-passport {
  background: #f3e5f5;
  color: #7b1fa2;
}
.badge-file {
  background: #e8f5e8;
  color: #388e3c;
}
.badge-registration {
  background: #fff3e0;
  color: #f57c00;
}

.view-fields-btn {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  text-decoration: underline;
}

.view-fields-btn:hover {
  color: #ff8c00;
}

.changed-fields {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.85rem;
}

.field-item {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.field-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.field-values {
  display: flex;
  gap: 20px;
  margin-top: 4px;
}

.old-value {
  color: #f44336;
  text-decoration: line-through;
}

.new-value {
  color: #4caf50;
  font-weight: 500;
}

.delete-btn {
  padding: 6px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s;
}

.delete-btn:hover:not(:disabled) {
  background: #d32f2f;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-details {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;;
  border-radius: 4px;
  line-height: 1.6;
}

.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  animation: slideIn 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  min-width: 300px;
}

.notification.success {
  background: #4caf50;
}

.notification.error {
  background: #f44336;
}

.notification.warning {
  background: #ff9800;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .history-table {
    font-size: 0.8rem;
  }

  .history-table th,
  .history-table td {
    padding: 8px;
  }

  .field-values {
    flex-direction: column;
    gap: 5px;
  }

  .notifications {
    left: 20px;
    right: 20px;
  }

  .notification {
    min-width: auto;
  }

}
</style>
