<script>
import theme from '@/utils/theme.js'

export default {
	globalData: {
		themeMode: 'light',
		colorTheme: 'default-blue'
	},
	
	onLaunch: function() {
		console.log('App Launch')
		this.initGlobalTheme()
		
		// #ifdef APP-PLUS
		// 监听系统通知点击事件
		plus.push.addEventListener('click', (msg) => {
			console.log('通知点击:', msg)
			const payload = msg.payload
			
			if (payload) {
				if (payload.type === 'friend_request') {
					// 跳转到主页面并打开好友申请页面
					uni.switchTab({
						url: '/pages/chat/chat'
					})
					// 延迟执行，确保页面已经加载完成
					setTimeout(() => {
						// 这里需要在 chat.vue 中添加一个方法来打开好友申请页面
						// 可以通过事件总线或全局变量来实现
						uni.$emit('openFriendRequests')
					}, 500)
				} else if (payload.chatId && payload.chatType) {
					// 跳转到聊天页面
					uni.switchTab({
						url: '/pages/chat/chat'
					})
					// 延迟执行，确保页面已经加载完成
					setTimeout(() => {
						// 这里需要在 chat.vue 中添加一个方法来打开指定聊天
						uni.$emit('openChat', payload.chatType, payload.chatId)
					}, 500)
				}
			}
		})
		// #endif
	},
	
	onShow: function() {
		console.log('App Show')
	},
	
	onHide: function() {
		console.log('App Hide')
	},
	
	methods: {
		initGlobalTheme() {
			this.globalData.themeMode = theme.getTheme()
			this.globalData.colorTheme = theme.getColorTheme()
		}
	}
}
</script>

<style lang="scss">
@import "@/uni.scss";

page {
	--primary-color: #12b7f5;
	--primary-hover: #0ea5d9;
	--primary-light: rgba(18, 183, 245, 0.08);
	--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	--primary-gradient-alt: linear-gradient(135deg, #12b7f5 0%, #00a2e8 100%);
	--bg-primary: #ffffff;
	--bg-secondary: #fafafa;
	--bg-tertiary: #f5f5f5;
	--bg-hover: #f0f0f0;
	--text-primary: #18181b;
	--text-secondary: #71717a;
	--text-tertiary: #a1a1aa;
	--border-color: #e4e4e7;
	--border-light: #f4f4f5;
	--shadow-sm: 0 1rpx 2rpx rgba(0, 0, 0, 0.04);
	--shadow-md: 0 4rpx 6rpx rgba(0, 0, 0, 0.05), 0 2rpx 4rpx rgba(0, 0, 0, 0.03);
	--shadow-lg: 0 10rpx 15rpx rgba(0, 0, 0, 0.08), 0 4rpx 6rpx rgba(0, 0, 0, 0.04);
	--shadow-xl: 0 20rpx 25rpx rgba(0, 0, 0, 0.1), 0 10rpx 10rpx rgba(0, 0, 0, 0.04);
	--radius-sm: 12rpx;
	--radius-md: 16rpx;
	--radius-lg: 20rpx;
	--radius-xl: 24rpx;
	--radius-2xl: 32rpx;
	--radius-full: 50%;
	--spacing-xs: 8rpx;
	--spacing-sm: 16rpx;
	--spacing-md: 24rpx;
	--spacing-lg: 32rpx;
	--spacing-xl: 40rpx;
	--spacing-2xl: 56rpx;
}

page {
	height: 100%;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
</style>
