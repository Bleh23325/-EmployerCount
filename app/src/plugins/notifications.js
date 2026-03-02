import { createApp } from 'vue'
import UiNotification from '../components/ui/UiNotification.vue'

let notificationInstance = null

export default {
    install(app) {
        const notificationContainer = document.createElement('div')
        document.body.appendChild(notificationContainer)
        
        const notificationApp = createApp(UiNotification)
        notificationInstance = notificationApp.mount(notificationContainer)
        
        app.config.globalProperties.$notify = {
            success(title, message, duration) {
                notificationInstance?.success(title, message, duration)
            },
            error(title, message, duration) {
                notificationInstance?.error(title, message, duration)
            },
            warning(title, message, duration) {
                notificationInstance?.warning(title, message, duration)
            },
            info(title, message, duration) {
                notificationInstance?.info(title, message, duration)
            },
            clear() {
                notificationInstance?.clear()
            }
        }
    }
}