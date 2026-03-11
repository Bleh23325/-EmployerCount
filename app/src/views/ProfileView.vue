<template>
  <div class="profile-container">
    <UiBlock title="Профиль пользователя">
      <div v-if="loading" class="loading">Загрузка...</div>

      <div v-else-if="error" class="error">
        {{ error }}
        <UiButton @click="fetchProfile" variant="primary"> Повторить </UiButton>
      </div>

      <div v-else-if="userData" class="profile-info">
        <div class="info-item"><strong>Имя пользователя:</strong> {{ userData.username }}</div>
        <div class="info-item"><strong>Email:</strong> {{ userData.email }}</div>
        <div class="info-item">
          <strong>Дата регистрации:</strong> {{ formatDate(userData.createdAt) }}
        </div>

        <UiButton @click="logout" variant="secondary" class="logout-btn"> Выйти </UiButton>
      </div>
    </UiBlock>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'
import UiBlock from '@/components/UiBlock.vue'
import UiButton from '@/components/UiButton.vue'

export default {
  name: 'ProfileView',
  components: {
    UiBlock,
    UiButton,
  },

  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchProfile = async () => {
      loading.value = true
      error.value = null

      try {
        userData.value = await api.get('/user/profile')
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        error.value = 'Не удалось загрузить профиль'

        if (err.status === 401) {
          authStore.logout()
          router.push('/login')
        }
      } finally {
        loading.value = false
      }
    }

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    onMounted(() => {
      fetchProfile()
    })

    return {
      userData,
      loading,
      error,
      fetchProfile,
      logout,
      formatDate,
    }
  },
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.logout-btn {
  margin-top: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
}
</style>
