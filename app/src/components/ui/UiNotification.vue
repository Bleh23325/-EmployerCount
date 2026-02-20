<template>
    <Teleport to="body">
        <div class="notifications-container">
            <transition-group name="notification">
                <div 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    class="notification"
                    :class="`notification--${notification.type}`"
                >
                    <div class="notification__icon">
                        <span v-if="notification.type === 'success'">✓</span>
                        <span v-else-if="notification.type === 'error'">✕</span>
                        <span v-else-if="notification.type === 'warning'">⚠</span>
                        <span v-else>ℹ</span>
                    </div>
                    
                    <div class="notification__content">
                        <div class="notification__title">{{ notification.title }}</div>
                        <div class="notification__message">{{ notification.message }}</div>
                    </div>
                    
                    <button 
                        class="notification__close"
                        @click="removeNotification(notification.id)"
                    >
                        ✕
                    </button>
                </div>
            </transition-group>
        </div>
    </Teleport>
</template>

<script>
export default {
    name: 'UiNotification',
    data() {
        return {
            notifications: []
        }
    },
    methods: {
        addNotification(notification) {
            const id = Date.now() + Math.random()
            const defaultNotification = {
                id,
                type: 'info',
                title: 'Уведомление',
                message: '',
                duration: 5000
            }
            
            const newNotification = { ...defaultNotification, ...notification }
            this.notifications.push(newNotification)
            
            if (newNotification.duration > 0) {
                setTimeout(() => {
                    this.removeNotification(id)
                }, newNotification.duration)
            }
        },
        
        removeNotification(id) {
            const index = this.notifications.findIndex(n => n.id === id)
            if (index !== -1) {
                this.notifications.splice(index, 1)
            }
        },
        
        success(title, message, duration) {
            this.addNotification({ type: 'success', title, message, duration })
        },
        
        error(title, message, duration) {
            this.addNotification({ type: 'error', title, message, duration })
        },
        
        warning(title, message, duration) {
            this.addNotification({ type: 'warning', title, message, duration })
        },
        
        info(title, message, duration) {
            this.addNotification({ type: 'info', title, message, duration })
        },
        
        clear() {
            this.notifications = []
        }
    }
}
</script>

<style scoped>
.notifications-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    pointer-events: none;
}

.notification {
    pointer-events: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-left: 4px solid;
    animation: slideIn 0.3s ease;
}

/* Типы уведомлений */
.notification--success {
    border-left-color: #2ecc71;
}
.notification--success .notification__icon {
    background: #2ecc71;
    color: white;
}

.notification--error {
    border-left-color: #e74c3c;
}
.notification--error .notification__icon {
    background: #e74c3c;
    color: white;
}

.notification--warning {
    border-left-color: #e67e22;
}
.notification--warning .notification__icon {
    background: #e67e22;
    color: white;
}

.notification--info {
    border-left-color: #3498db;
}
.notification--info .notification__icon {
    background: #3498db;
    color: white;
}

.notification__icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
}

.notification__content {
    flex: 1;
}

.notification__title {
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.notification__message {
    color: #666;
    font-size: 0.9em;
    line-height: 1.4;
}

.notification__close {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    line-height: 1;
    transition: color 300ms ease;
    flex-shrink: 0;
}

.notification__close:hover {
    color: #333;
}


.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>