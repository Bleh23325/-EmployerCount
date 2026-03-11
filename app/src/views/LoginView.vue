<template>
  <div class="auth-container">
    <UiBlock title="Добро пожаловать!">
      <p class="auth-subtitle">Войдите в систему, чтобы продолжить</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login">Email</label>
          <UiInput
            id="login"
            v-model="form.login"
            type="email"
            placeholder="Введите ваш email"
            :error="errors.login"
            :success="!errors.login && form.login.length > 0"
            required
            @input="clearError('login')"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <UiInput
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Введите пароль"
            :error="errors.password"
            :success="!errors.password && form.password.length > 0"
            required
            @input="clearError('password')"
          />
        </div>

        <div v-if="errors.general" class="general-error">{{ errors.general }}</div>

        <div class="form-options">
          <UiCheckbox v-model="rememberMe" color="primary"> Запомнить меня </UiCheckbox>
          <router-link to="/forgot-password" class="forgot-link">Забыли пароль?</router-link>
        </div>

        <UiButton type="submit" variant="primary" :disabled="isLoading" full-width>
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </UiButton>

        <div class="register-prompt">
          <span>Нет аккаунта?</span>
          <router-link to="/register">
            <UiButton variant="secondary">Зарегистрироваться</UiButton>
          </router-link>
        </div>
      </form>
    </UiBlock>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import UiBlock from '@/components/UiBlock.vue'
import UiInput from '@/components/UiInput.vue'
import UiButton from '@/components/UiButton.vue'
import UiCheckbox from '@/components/UiCheckbox.vue'

export default {
  name: 'LoginView',
  components: {
    UiBlock,
    UiInput,
    UiButton,
    UiCheckbox,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const rememberMe = ref(false)

    const form = reactive({
      login: '',
      password: '',
    })

    const errors = reactive({
      login: '',
      password: '',
      general: '',
    })

    const validateForm = () => {
      let isValid = true
      errors.login = ''
      errors.password = ''

      if (!form.login) {
        errors.login = 'Email обязателен'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.login)) {
        errors.login = 'Введите корректный email'
        isValid = false
      }

      if (!form.password) {
        errors.password = 'Пароль обязателен'
        isValid = false
      }

      return isValid
    }

    const clearError = (field) => {
      errors[field] = ''
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      isLoading.value = true
      errors.general = ''

      try {
        await authStore.login(form, rememberMe.value)
        router.push('/profile')
      } catch (error) {
        console.log('Полная ошибка:', error)
        console.log('Статус ошибки:', error.status)
        console.log('Сообщение ошибки:', error.message)

        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          errors.general = 'Нет подключения к серверу. Проверьте соединение.'
        } else if (error.status === 401) {
          errors.general = 'Неверный email или пароль'
        } else {
          errors.general = error.message || 'Ошибка при входе'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      isLoading,
      rememberMe,
      handleLogin,
      clearError,
    }
  },
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 1rem;
}

.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.general-error {
  background-color: #ffebee;
  color: #f44336;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.forgot-link {
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-link:hover {
  color: #ff8c00;
  text-decoration: underline;
}

.register-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}
</style>
