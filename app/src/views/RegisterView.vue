<template>
  <div class="auth-container">
    <UiBlock title="Создать аккаунт!">
      <p class="auth-subtitle">Зарегистрируйтесь, чтобы начать</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <UiInput
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Введите имя пользователя"
            :error="errors.username"
            :success="!errors.username && form.username.length > 0"
            required
            @input="clearError('username')"
          />
        </div>

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
            placeholder="Придумайте пароль"
            :error="errors.password"
            :success="!errors.password && isPasswordStrong"
            required
            @input="clearError('password')"
          />
          <div v-if="form.password && !isPasswordStrong" class="password-hint">
            Пароль должен содержать минимум 8 символов, заглавную букву и цифру
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Подтверждение пароля</label>
          <UiInput
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            :error="errors.confirmPassword"
            :success="!errors.confirmPassword && form.confirmPassword && passwordsMatch"
            required
            @input="clearError('confirmPassword')"
          />
        </div>

        <div v-if="errors.general" class="general-error">{{ errors.general }}</div>

        <UiButton type="submit" variant="primary" :disabled="isLoading" full-width>
          {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </UiButton>

        <div class="login-prompt">
          <span>Уже есть аккаунт?</span>
          <router-link to="/login">
            <UiButton variant="secondary">Войти</UiButton>
          </router-link>
        </div>
      </form>
    </UiBlock>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import UiBlock from '@/components/UiBlock.vue'
import UiInput from '@/components/UiInput.vue'
import UiButton from '@/components/UiButton.vue'

export default {
  name: 'RegisterView',
  components: {
    UiBlock,
    UiInput,
    UiButton,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const isLoading = ref(false)

    const form = reactive({
      username: '',
      login: '',
      password: '',
      confirmPassword: '',
    })

    const errors = reactive({
      username: '',
      login: '',
      password: '',
      confirmPassword: '',
      general: '',
    })

    const passwordsMatch = computed(() => {
      return form.password === form.confirmPassword
    })

    const isPasswordStrong = computed(() => {
      const password = form.password
      if (!password) return false
      return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    })

    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.login = ''
      errors.password = ''
      errors.confirmPassword = ''

      if (!form.username) {
        errors.username = 'Имя пользователя обязательно'
        isValid = false
      } else if (form.username.length < 3) {
        errors.username = 'Имя должно содержать минимум 3 символа'
        isValid = false
      }

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
      } else if (form.password.length < 6) {
        errors.password = 'Пароль должен содержать минимум 6 символов'
        isValid = false
      }

      if (!form.confirmPassword) {
        errors.confirmPassword = 'Подтвердите пароль'
        isValid = false
      } else if (!passwordsMatch.value) {
        errors.confirmPassword = 'Пароли не совпадают'
        isValid = false
      }

      return isValid
    }

    const clearError = (field) => {
      errors[field] = ''
    }

    const handleRegister = async () => {
      if (!validateForm()) return

      isLoading.value = true
      errors.general = ''

      try {
        await authStore.register({
          username: form.username,
          login: form.login,
          password: form.password,
        })

        alert('Регистрация успешна! Теперь вы можете войти.')
        router.push('/login')
      } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          errors.general = 'Нет подключения к серверу. Проверьте соединение.'
        } else if (error.status === 422) {
          errors.general = 'Пользователь с таким email уже существует'
        } else {
          errors.general = error.message || 'Ошибка при регистрации'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      isLoading,
      passwordsMatch,
      isPasswordStrong,
      handleRegister,
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

.password-hint {
  margin-top: 5px;
  color: #666;
  font-size: 0.8rem;
  font-style: italic;
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

.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}
</style>
