<template>
  <div class="auth-container">
    <UiBlock :title="blockTitle">
      <p class="auth-subtitle">{{ blockSubtitle }}</p>

      <!-- Шаг 1: Ввод email -->
      <template v-if="step === 'email'">
        <form @submit.prevent="handleEmailSubmit" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <UiInput
              id="email"
              v-model="emailForm.email"
              type="email"
              placeholder="Введите ваш email"
              :error="emailErrors.email"
              :success="!emailErrors.email && emailForm.email.length > 0"
              required
              @input="clearEmailError('email')"
            />
          </div>

          <div v-if="emailErrors.general" class="general-error">{{ emailErrors.general }}</div>

          <UiButton type="submit" variant="primary" :disabled="isLoading" full-width>
            {{ isLoading ? 'Проверка...' : 'Продолжить' }}
          </UiButton>

          <div class="back-to-login">
            <router-link to="/login">
              <UiButton variant="secondary">Вернуться ко входу</UiButton>
            </router-link>
          </div>
        </form>
      </template>

      <template v-else-if="step === 'not-found'">
        <div class="not-found-container">
          <div class="not-found-icon"></div>
          <p class="not-found-message">
            Пользователь с email <strong>{{ emailForm.email }}</strong> не зарегистрирован
          </p>

          <div class="not-found-actions">
            <router-link to="/register">
              <UiButton variant="primary">Зарегистрироваться</UiButton>
            </router-link>
            <button @click="goBackToEmail" class="text-button">Попробовать другой email</button>
          </div>
        </div>
      </template>

      <template v-else-if="step === 'password'">
        <p class="email-info">
          Для аккаунта: <strong>{{ emailForm.email }}</strong>
        </p>

        <form @submit.prevent="handlePasswordSubmit" class="auth-form">
          <div class="form-group">
            <label for="newPassword">Новый пароль</label>
            <UiInput
              id="newPassword"
              v-model="passwordForm.password"
              type="password"
              placeholder="Придумайте новый пароль"
              :error="passwordErrors.password"
              :success="!passwordErrors.password && passwordForm.password && isPasswordStrong"
              required
              @input="clearPasswordError('password')"
            />
            <div v-if="passwordForm.password && !isPasswordStrong" class="password-hint">
              Пароль должен содержать минимум 8 символов, заглавную букву и цифру
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Подтверждение пароля</label>
            <UiInput
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="Повторите новый пароль"
              :error="passwordErrors.confirmPassword"
              :success="
                !passwordErrors.confirmPassword && passwordForm.confirmPassword && passwordsMatch
              "
              required
              @input="clearPasswordError('confirmPassword')"
            />
          </div>

          <div v-if="passwordErrors.sameAsOld" class="general-error">
            {{ passwordErrors.sameAsOld }}
          </div>
          <div v-if="passwordErrors.general" class="general-error">
            {{ passwordErrors.general }}
          </div>

          <UiButton type="submit" variant="primary" :disabled="isLoading" full-width>
            {{ isLoading ? 'Сохранение...' : 'Сохранить новый пароль' }}
          </UiButton>

          <div class="back-to-email">
            <button type="button" @click="goBackToEmail" class="text-button">
              ← Вернуться к вводу email
            </button>
          </div>
        </form>
      </template>

      <template v-else-if="step === 'success'">
        <div class="success-container">
          <div class="success-icon">✓</div>
          <p class="success-message">Пароль успешно изменен!</p>
          <p class="success-info">Теперь вы можете войти в систему с новым паролем.</p>

          <router-link to="/login">
            <UiButton variant="primary">Войти в аккаунт</UiButton>
          </router-link>
        </div>
      </template>
    </UiBlock>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import UiBlock from '@/components/UiBlock.vue'
import UiInput from '@/components/UiInput.vue'
import UiButton from '@/components/UiButton.vue'

export default {
  name: 'ForgotPasswordView',
  components: {
    UiBlock,
    UiInput,
    UiButton,
  },
  setup() {
    const step = ref('email')
    const isLoading = ref(false)

    const emailForm = reactive({
      email: '',
    })

    const emailErrors = reactive({
      email: '',
      general: '',
    })

    const passwordForm = reactive({
      password: '',
      confirmPassword: '',
    })

    const passwordErrors = reactive({
      password: '',
      confirmPassword: '',
      sameAsOld: '',
      general: '',
    })

    const blockTitle = computed(() => {
      if (step.value === 'email') return 'Восстановление пароля'
      if (step.value === 'not-found') return 'Аккаунт не найден'
      if (step.value === 'password') return 'Новый пароль'
      if (step.value === 'success') return 'Готово!'
      return 'Восстановление пароля'
    })

    const blockSubtitle = computed(() => {
      if (step.value === 'email') return 'Введите ваш email для восстановления доступа'
      if (step.value === 'password') return 'Придумайте новый пароль'
      return ''
    })

    const passwordsMatch = computed(() => {
      return passwordForm.password === passwordForm.confirmPassword
    })

    const isPasswordStrong = computed(() => {
      const password = passwordForm.password
      if (!password) return false
      return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    })

    const clearEmailError = (field) => {
      emailErrors[field] = ''
    }

    const clearPasswordError = (field) => {
      passwordErrors[field] = ''
    }

    const validateEmail = () => {
      let isValid = true
      emailErrors.email = ''

      if (!emailForm.email) {
        emailErrors.email = 'Email обязателен'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
        emailErrors.email = 'Введите корректный email'
        isValid = false
      }

      return isValid
    }

    const validatePassword = () => {
      let isValid = true
      passwordErrors.password = ''
      passwordErrors.confirmPassword = ''
      passwordErrors.sameAsOld = ''

      if (!passwordForm.password) {
        passwordErrors.password = 'Пароль обязателен'
        isValid = false
      } else if (passwordForm.password.length < 6) {
        passwordErrors.password = 'Пароль должен содержать минимум 6 символов'
        isValid = false
      }

      if (!passwordForm.confirmPassword) {
        passwordErrors.confirmPassword = 'Подтвердите пароль'
        isValid = false
      } else if (!passwordsMatch.value) {
        passwordErrors.confirmPassword = 'Пароли не совпадают'
        isValid = false
      }

      if (passwordForm.password === 'oldpassword123') {
        passwordErrors.sameAsOld = 'Придумайте новый пароль, а не последний'
        isValid = false
      }

      return isValid
    }

    const checkAccountExists = async (email) => {
      try {
        console.log('Проверяем email:', email)
        const response = await fetch(
          `http://localhost:5000/api/auth-sessions/check/${encodeURIComponent(email)}`,
        )

        if (response.ok) {
          const data = await response.json()
          console.log('Результат проверки:', data)
          return data.exists
        }
        return false
      } catch (error) {
        console.error('Ошибка при проверке email:', error)
        return false
      }
    }

    const handleEmailSubmit = async () => {
      if (!validateEmail()) return

      isLoading.value = true
      emailErrors.general = ''

      try {
        const accountExists = await checkAccountExists(emailForm.email)

        if (accountExists) {
          step.value = 'password'
        } else {
          step.value = 'not-found'
        }
      } catch (error) {
        console.log('Ошибка при смене пароля:', error)
        emailErrors.general = 'Нет подключения к серверу. Проверьте соединение.'
      } finally {
        isLoading.value = false
      }
    }

    const handlePasswordSubmit = async () => {
      if (!validatePassword()) return

      isLoading.value = true
      passwordErrors.general = ''

      try {
        const response = await fetch('http://localhost:5000/api/auth-sessions/update-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: emailForm.email,
            password: passwordForm.password,
          }),
        })

        if (response.ok) {
          step.value = 'success'
        } else {
          const data = await response.json()
          passwordErrors.general = data.message || 'Ошибка при смене пароля'
        }
      } catch (error) {
        console.log('Ошибка при смене пароля:', error)
        passwordErrors.general = 'Нет подключения к серверу. Проверьте соединение.'
      } finally {
        isLoading.value = false
      }
    }

    const goBackToEmail = () => {
      step.value = 'email'
      passwordForm.password = ''
      passwordForm.confirmPassword = ''
      Object.keys(passwordErrors).forEach((key) => (passwordErrors[key] = ''))
    }

    return {
      step,
      isLoading,
      blockTitle,
      blockSubtitle,
      emailForm,
      emailErrors,
      passwordForm,
      passwordErrors,
      passwordsMatch,
      isPasswordStrong,
      handleEmailSubmit,
      handlePasswordSubmit,
      clearEmailError,
      clearPasswordError,
      goBackToEmail,
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

.email-info {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.email-info strong {
  color: #ff8c00;
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

.back-to-login,
.back-to-email {
  text-align: center;
  margin-top: 20px;
}

.text-button {
  background: none;
  border: none;
  color: #3498db;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px 10px;
}

.text-button:hover {
  color: #ff8c00;
}

.not-found-container {
  text-align: center;
  padding: 20px 0;
}

.not-found-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.not-found-message {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
  line-height: 1.5;
}

.not-found-message strong {
  color: #f44336;
}

.not-found-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.success-container {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 70px;
  height: 70px;
  background-color: #4caf50;
  color: white;
  font-size: 40px;
  line-height: 70px;
  border-radius: 50%;
  margin: 0 auto 20px;
  text-align: center;
}

.success-message {
  color: #333;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
}

.success-info {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}
</style>
