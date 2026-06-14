<template>
	<view class="login-container" :class="{ 'theme-dark': themeMode === 'dark' }" :style="cssVariables">
		<view class="login-box">
			<view class="header">
				<image class="logo" src="@/static/logo.jpg" mode="aspectFit"></image>
				<text class="title">Modern Chat</text>
			</view>
			
			<view class="tab-bar">
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'login' }"
					@click="switchTab('login')"
				>
					登录
				</view>
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'register' }"
					@click="switchTab('register')"
				>
					注册
				</view>
			</view>
			
			<view class="server-bar">
				<text class="server-label">服务器</text>
				<view class="server-tabs">
					<view 
						class="server-tab" 
						:class="{ active: selectedServerId === 'default' }"
						@click="selectedServerId = 'default'"
					>默认</view>
					<view 
						class="server-tab" 
						:class="{ active: selectedServerId === 'custom' }"
						@click="selectedServerId = 'custom'"
					>自定义</view>
				</view>
				<view v-if="selectedServerId === 'custom'" class="server-input">
					<input 
						type="text" 
						v-model="customServerUrl" 
						placeholder="https://你的服务器.com"
						placeholder-class="placeholder"
					/>
				</view>
				<text v-else class="server-url">{{ displayServerUrl }}</text>
			</view>
			
			<view v-if="activeTab === 'login'" class="form">
				<view class="form-group">
					<text class="label">邮箱</text>
					<view class="input-wrapper">
						<input 
							type="text" 
							v-model="loginForm.email" 
							placeholder="请输入邮箱"
							placeholder-class="placeholder"
						/>
					</view>
				</view>
				
				<view class="form-group">
					<text class="label">密码</text>
					<view class="input-wrapper">
						<input 
							:type="showLoginPassword ? 'text' : 'password'" 
							v-model="loginForm.password" 
							placeholder="请输入密码"
							placeholder-class="placeholder"
						/>
						<view class="input-suffix" @click="showLoginPassword = !showLoginPassword">
							<text class="icon">{{ showLoginPassword ? '隐藏' : '显示' }}</text>
						</view>
					</view>
				</view>
				
				<button class="btn-primary" :disabled="loginLoading" @click="handleLogin">
					<text v-if="loginLoading">登录中...</text>
					<text v-else>登 录</text>
				</button>
			</view>
			
			<view v-else class="form">
				<view class="form-group">
					<text class="label">用户名</text>
					<view class="input-wrapper">
						<input 
							type="text" 
							v-model="registerForm.username" 
							placeholder="请输入用户名"
							placeholder-class="placeholder"
						/>
					</view>
				</view>
				
				<view class="form-group">
					<text class="label">邮箱</text>
					<view class="input-wrapper">
						<input 
							type="text" 
							v-model="registerForm.email" 
							placeholder="请输入邮箱"
							placeholder-class="placeholder"
						/>
					</view>
				</view>
				
				<view class="form-group">
					<text class="label">手机号</text>
					<view class="input-wrapper sms-input-wrapper">
						<input 
							type="number" 
							v-model="registerForm.phone" 
							placeholder="请输入手机号"
							placeholder-class="placeholder"
							maxlength="11"
						/>
						<view 
							class="sms-btn" 
							:class="{ disabled: smsCountdown > 0 || !isPhoneValid }"
							@click="sendSmsCode"
						>
							<text v-if="smsCountdown > 0">{{ smsCountdown }}s</text>
							<text v-else>获取验证码</text>
						</view>
					</view>
				</view>
				
				<view class="form-group">
					<text class="label">短信验证码</text>
					<view class="input-wrapper">
						<input 
							type="number" 
							v-model="registerForm.smsCode" 
							placeholder="请输入短信验证码"
							placeholder-class="placeholder"
							maxlength="6"
						/>
					</view>
				</view>
				
				<view class="form-group">
					<text class="label">密码</text>
					<view class="input-wrapper">
						<input 
							:type="showRegPassword ? 'text' : 'password'" 
							v-model="registerForm.password" 
							placeholder="请输入密码（至少6位）"
							placeholder-class="placeholder"
						/>
						<view class="input-suffix" @click="showRegPassword = !showRegPassword">
							<text class="icon">{{ showRegPassword ? '隐藏' : '显示' }}</text>
						</view>
					</view>
				</view>
				
				<view class="form-group">
					<text class="label">确认密码</text>
					<view class="input-wrapper">
						<input 
							:type="showConfirmPassword ? 'text' : 'password'" 
							v-model="registerForm.confirmPassword" 
							placeholder="请再次输入密码"
							placeholder-class="placeholder"
						/>
						<view class="input-suffix" @click="showConfirmPassword = !showConfirmPassword">
							<text class="icon">{{ showConfirmPassword ? '隐藏' : '显示' }}</text>
						</view>
					</view>
				</view>
				
				<button class="btn-primary" :disabled="registerLoading" @click="handleRegister">
					<text v-if="registerLoading">注册中...</text>
					<text v-else>注 册</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import api, { getApiBaseUrl, setApiBaseUrl } from '@/utils/api.js'
import { APP_VERSION, APP_VERSION_CODE } from '@/utils/version.js'
import theme from '@/utils/theme.js'

const PRESET_SERVERS = [
	{ id: 'default', name: '默认服务器', url: 'https://chat.modern-chat.top/chat' },
	{ id: 'custom', name: '自定义服务器', url: '' }
]

export default {
	data() {
		return {
			activeTab: 'login',
			showLoginPassword: false,
			showRegPassword: false,
			showConfirmPassword: false,
			loginLoading: false,
			registerLoading: false,
			smsCountdown: 0,
			smsTimer: null,
			presetServers: PRESET_SERVERS,
			selectedServerId: 'default',
			customServerUrl: '',
			loginForm: {
				email: '',
				password: ''
			},
			registerForm: {
				username: '',
				email: '',
				phone: '',
				smsCode: '',
				password: '',
				confirmPassword: ''
			},
			themeMode: 'light',
			currentColorTheme: 'default-blue'
		}
	},
	computed: {
		displayServerUrl() {
			if (this.selectedServerId === 'default') {
				return 'https://chat.modern-chat.top/chat/api.php'
			}
			return getApiBaseUrl()
		},
		isPhoneValid() {
			return /^1[3-9]\d{9}$/.test(this.registerForm.phone)
		},
		currentThemeColors() {
			const themeConfig = theme.getThemeById(this.currentColorTheme)
			return themeConfig[this.themeMode] || themeConfig.light
		},
		cssVariables() {
			const colors = this.currentThemeColors
			return `
				--primary-color: ${colors.primaryColor};
				--primary-hover: ${colors.primaryHover};
				--primary-light: ${colors.primaryLight};
				--primary-gradient: ${colors.primaryGradient};
				--primary-gradient-alt: ${colors.primaryGradientAlt};
				--bg-primary: ${colors.bgPrimary};
				--bg-secondary: ${colors.bgSecondary};
				--bg-tertiary: ${colors.bgTertiary};
				--bg-hover: ${colors.bgHover};
				--text-primary: ${colors.textPrimary};
				--text-secondary: ${colors.textSecondary};
				--text-tertiary: ${colors.textTertiary};
				--border-color: ${colors.borderColor};
				--border-light: ${colors.borderLight};
				--shadow-sm: ${colors.shadowSm};
				--shadow-md: ${colors.shadowMd};
				--shadow-lg: ${colors.shadowLg};
				--shadow-xl: ${colors.shadowXl};
			`
		}
	},
	onLoad() {
		this.initTheme()
		this.initServerSelection()
		this.checkForceUpdate()
	},
	onUnload() {
		if (this.smsTimer) {
			clearInterval(this.smsTimer)
		}
	},
	methods: {
		initTheme() {
			this.themeMode = theme.getTheme()
			this.currentColorTheme = theme.getColorTheme()
		},
		initServerSelection() {
			const current = getApiBaseUrl()
			const defaultBase = PRESET_SERVERS[0].url + '/api.php'
			if (current === defaultBase) {
				this.selectedServerId = 'default'
				this.customServerUrl = ''
				return
			}
			const matched = PRESET_SERVERS.find(p => p.url && current.startsWith(p.url))
			if (matched && matched.id !== 'custom') {
				this.selectedServerId = matched.id
				this.customServerUrl = ''
				return
			}
			this.selectedServerId = 'custom'
			this.customServerUrl = current.replace(/\/api\.php(\?.*)?$/i, '').replace(/\/+$/, '')
		},
		
		async checkForceUpdate() {
			try {
				const baseUrl = getApiBaseUrl()
				const versionUrl = baseUrl.replace(/\?.*$/, '') + '?resource=version&action=app'
				
				const [err, res] = await new Promise(resolve => {
					uni.request({
						url: versionUrl,
						method: 'GET',
						timeout: 10000,
						success: r => resolve([null, r]),
						fail: e => resolve([e, null])
					})
				})
				
				if (err || !res || res.statusCode !== 200) {
					this.checkAutoLogin()
					return
				}
				
				const data = res.data
				const minCode = parseInt(data.minVersionCode ?? data.min_version_code ?? '', 10)
				
				if (!isNaN(minCode) && minCode > 0 && APP_VERSION_CODE < minCode) {
					const url = data.downloadUrl || data.download_url || ''
					const content = (data.forceNote || data.note || data.releaseNote || '当前版本已停止维护，请更新后继续使用。') + '\n\n当前版本：' + APP_VERSION + (data.version ? '\n最新版本：' + data.version : '')
					
					uni.showModal({
						title: '请更新到最新版本',
						content: content,
						showCancel: false,
						confirmText: '立即更新',
						success: (r) => {
							if (r.confirm) {
								if (url) {
									this.downloadAndInstall(url)
								} else {
									uni.showModal({
										title: '暂无下载地址',
										content: '请从官方渠道获取最新版本',
										showCancel: false,
										success: () => {
											// #ifdef APP-PLUS
											plus.runtime.quit()
											// #endif
										}
									})
								}
							}
						}
					})
				} else {
					this.checkAutoLogin()
				}
			} catch (e) {
				this.checkAutoLogin()
			}
		},
		
		downloadAndInstall(downloadUrl) {
			// #ifdef APP-PLUS
			uni.showLoading({ title: '准备下载...', mask: true })
			const task = uni.downloadFile({
				url: downloadUrl,
				success: (res) => {
					uni.hideLoading()
					if (res.statusCode === 200 && res.tempFilePath) {
						plus.runtime.install(
							res.tempFilePath,
							{ force: true },
							() => {
								uni.showModal({
									title: '安装完成',
									content: '更新已安装，应用将重启',
									showCancel: false,
									success: () => {
										plus.runtime.restart()
									}
								})
							},
							(e) => {
								uni.showModal({
									title: '安装失败',
									content: '更新安装失败，请手动下载安装',
									showCancel: false
								})
							}
						)
					} else {
						uni.showModal({
							title: '下载失败',
							content: '文件下载失败，请稍后重试',
							showCancel: false
						})
					}
				},
				fail: () => {
					uni.hideLoading()
					uni.showModal({
						title: '下载失败',
						content: '网络请求失败，请检查网络后重试',
						showCancel: false
					})
				}
			})
			
			task.onProgressUpdate((res) => {
				uni.showLoading({ title: `下载中 ${res.progress}%`, mask: true })
			})
			// #endif
			
			// #ifndef APP-PLUS
			uni.showModal({
				title: '请更新',
				content: '当前版本已过期，请从官方渠道下载最新版本',
				showCancel: false
			})
			// #endif
		},
		
		applyServerSelection() {
			if (this.selectedServerId === 'custom') {
				const url = this.customServerUrl.trim()
				if (!url) {
					uni.showToast({ title: '请输入服务器地址', icon: 'none' })
					return false
				}
				setApiBaseUrl(url)
			} else {
				const preset = this.presetServers.find(p => p.id === this.selectedServerId)
				if (preset && preset.url) {
					setApiBaseUrl(preset.url)
				}
			}
			return true
		},
		
		async checkAutoLogin() {
			const isLoggedIn = uni.getStorageSync('isLoggedIn')
			const userInfo = uni.getStorageSync('userInfo')
			
			if (isLoggedIn && userInfo && userInfo.id) {
				try {
					// 尝试检查会话状态，验证是否仍然有效
					await api.user.getInfo(userInfo.id)
					// 会话有效，直接进入聊天页面
					uni.redirectTo({
						url: '/pages/chat/chat'
					})
				} catch (err) {
					// 会话无效，清除本地存储
					console.log('会话已过期，需要重新登录:', err)
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync('isLoggedIn')
					uni.removeStorageSync('vkey')
				}
			}
		},
		
		switchTab(tab) {
			this.activeTab = tab
		},
		
		getApiBaseUrl,
		
		validateEmail(email) {
			const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return re.test(email)
		},
		
		async sendSmsCode() {
			if (this.smsCountdown > 0) return
			if (!this.isPhoneValid) {
				uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
				return
			}
			
			if (!this.applyServerSelection()) return
			
			try {
				uni.showLoading({ title: '发送中...', mask: true })
				await api.sms.send(this.registerForm.phone)
				uni.hideLoading()
				
				uni.showToast({ title: '验证码已发送', icon: 'success' })
				
				this.smsCountdown = 60
				this.smsTimer = setInterval(() => {
					this.smsCountdown--
					if (this.smsCountdown <= 0) {
						clearInterval(this.smsTimer)
						this.smsTimer = null
					}
				}, 1000)
			} catch (err) {
				uni.hideLoading()
				uni.showToast({ title: err.message || '发送失败', icon: 'none' })
			}
		},
		
		async handleLogin() {
			if (!this.loginForm.email) {
				uni.showToast({ title: '请输入邮箱', icon: 'none' })
				return
			}
			
			if (!this.validateEmail(this.loginForm.email)) {
				uni.showToast({ title: '邮箱格式不正确', icon: 'none' })
				return
			}
			
			if (!this.loginForm.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}
			
			if (!this.applyServerSelection()) return
			
			this.loginLoading = true
			
			try {
				const res = await api.auth.login(this.loginForm.email, this.loginForm.password)
				
				const userInfo = res.data
				uni.setStorageSync('userInfo', userInfo)
				uni.setStorageSync('isLoggedIn', true)
				
				if (userInfo.id) {
					try {
						const vkeyRes = await api.vkey.generate(userInfo.id)
						if (vkeyRes.success && vkeyRes.data && vkeyRes.data.vkey) {
							uni.setStorageSync('vkey', vkeyRes.data.vkey)
							userInfo.vkey = vkeyRes.data.vkey
							uni.setStorageSync('userInfo', userInfo)
						}
					} catch (e) {
						console.log('获取vkey失败:', e)
					}
				}
				
				uni.showToast({ title: '登录成功', icon: 'success' })
				
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/chat/chat?refresh=1'
					})
				}, 1000)
			} catch (err) {
				uni.showToast({ title: err.message || '登录失败', icon: 'none' })
			} finally {
				this.loginLoading = false
			}
		},
		
		async handleRegister() {
			if (!this.registerForm.username) {
				uni.showToast({ title: '请输入用户名', icon: 'none' })
				return
			}
			
			if (this.registerForm.username.length < 3) {
				uni.showToast({ title: '用户名至少 3 个字符', icon: 'none' })
				return
			}
			
			if (!this.registerForm.email) {
				uni.showToast({ title: '请输入邮箱', icon: 'none' })
				return
			}
			
			if (!this.validateEmail(this.registerForm.email)) {
				uni.showToast({ title: '邮箱格式不正确', icon: 'none' })
				return
			}
			
			if (!this.registerForm.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' })
				return
			}
			
			if (!this.isPhoneValid) {
				uni.showToast({ title: '手机号格式不正确', icon: 'none' })
				return
			}
			
			if (!this.registerForm.smsCode) {
				uni.showToast({ title: '请输入短信验证码', icon: 'none' })
				return
			}
			
			if (!this.registerForm.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}
			
			if (this.registerForm.password.length < 6) {
				uni.showToast({ title: '密码至少 6 位', icon: 'none' })
				return
			}
			
			if (this.registerForm.password !== this.registerForm.confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' })
				return
			}
			
			if (!this.applyServerSelection()) return
			
			this.registerLoading = true
			
			try {
				await api.auth.register(
					this.registerForm.username,
					this.registerForm.email,
					this.registerForm.password,
					this.registerForm.phone,
					this.registerForm.smsCode
				)
				
				uni.showToast({ title: '注册成功', icon: 'success' })
				
				this.activeTab = 'login'
				this.loginForm.email = this.registerForm.email
				this.registerForm = {
					username: '',
					email: '',
					phone: '',
					smsCode: '',
					password: '',
					confirmPassword: ''
				}
				
				if (this.smsTimer) {
					clearInterval(this.smsTimer)
					this.smsTimer = null
				}
				this.smsCountdown = 0
			} catch (err) {
				uni.showToast({ title: err.message || '注册失败', icon: 'none' })
			} finally {
				this.registerLoading = false
			}
		}
	}
}
</script>

<style lang="scss">
page {
	background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
	min-height: 100vh;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.login-container {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
	background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
}

.login-container.theme-dark {
	background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%);
}

.login-box {
	background: var(--bg-primary);
	border-radius: 32rpx;
	box-shadow: var(--shadow-xl);
	padding: 60rpx 50rpx;
	width: 100%;
	max-width: 680rpx;
	animation: slideUp 0.5s ease-out;
}

.server-bar {
	margin-bottom: 44rpx;
	padding: 20rpx 24rpx;
	background: var(--bg-secondary);
	border-radius: 16rpx;
	border: 1rpx solid var(--primary-light);
	
	.server-label {
		display: block;
		font-size: 22rpx;
		color: var(--text-tertiary);
		margin-bottom: 12rpx;
		letter-spacing: 1rpx;
	}
	
	.server-tabs {
		display: flex;
		gap: 16rpx;
		
		.server-tab {
			padding: 12rpx 24rpx;
			background: var(--bg-primary);
			border-radius: 12rpx;
			font-size: 24rpx;
			color: var(--text-secondary);
			border: 1rpx solid transparent;
			transition: all 0.25s ease;
			
			&.active {
				background: var(--primary-light);
				color: var(--primary-color);
				border-color: var(--primary-color);
				font-weight: 500;
			}
			
			&:active {
				opacity: 0.85;
			}
		}
	}
	
	.server-input {
		margin-top: 16rpx;
		
		input {
			width: 100%;
			padding: 16rpx 20rpx;
			font-size: 24rpx;
			background: var(--bg-primary);
			border-radius: 12rpx;
			border: 1rpx solid var(--border-color);
			color: var(--text-primary);
			transition: border-color 0.2s ease;
			
			&:focus {
				border-color: var(--primary-color);
			}
		}
	}
	
	.server-url {
		display: block;
		margin-top: 12rpx;
		font-size: 20rpx;
		color: var(--text-tertiary);
		word-break: break-all;
		line-height: 1.4;
	}
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(60rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.header {
	text-align: center;
	margin-bottom: 50rpx;
	
	.logo {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 20rpx;
	}
	
	.title {
		display: block;
		font-size: 44rpx;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: 2rpx;
	}
}

.tab-bar {
	display: flex;
	margin-bottom: 24rpx;
	background: var(--bg-secondary);
	border-radius: 16rpx;
	padding: 6rpx;
	
	.tab-item {
		flex: 1;
		text-align: center;
		padding: 22rpx 0;
		font-size: 28rpx;
		font-weight: 500;
		color: var(--text-secondary);
		border-radius: 12rpx;
		transition: all 0.3s ease;
		
		&.active {
			background: var(--bg-primary);
			color: var(--primary-color);
			box-shadow: var(--shadow-sm);
			font-weight: 600;
		}
	}
}

.form-group {
	margin-bottom: 36rpx;
	
	.label {
		display: block;
		margin-bottom: 12rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: var(--text-primary);
	}
	
	.input-wrapper {
		display: flex;
		align-items: center;
		background: var(--bg-secondary);
		border-radius: 16rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
		
		&:focus-within {
			background: var(--bg-primary);
			border-color: var(--primary-color);
			box-shadow: 0 0 0 4rpx var(--primary-light);
		}
		
		input {
			flex: 1;
			padding: 24rpx 28rpx;
			font-size: 28rpx;
			color: var(--text-primary);
			background: transparent;
		}
		
		.input-suffix {
			padding: 0 28rpx;
			
			.icon {
				font-size: 24rpx;
				color: var(--primary-color);
			}
		}
	}
	
	.sms-input-wrapper {
		.sms-btn {
			padding: 16rpx 24rpx;
			background: var(--primary-gradient-alt);
			border-radius: 12rpx;
			margin-right: 16rpx;
			transition: all 0.3s ease;
			
			text {
				font-size: 24rpx;
				color: #fff;
				white-space: nowrap;
			}
			
			&.disabled {
				background: var(--border-color);
				opacity: 0.7;
			}
			
			&:active:not(.disabled) {
				transform: scale(0.95);
			}
		}
	}
}

.placeholder {
	color: var(--text-tertiary);
}

.btn-primary {
	width: 100%;
	height: 88rpx;
	background: var(--primary-gradient-alt);
	color: #ffffff;
	border: none;
	border-radius: 16rpx;
	font-size: 30rpx;
	font-weight: 600;
	margin-top: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(18, 183, 245, 0.4);
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 12rpx rgba(18, 183, 245, 0.4);
	}
	
	&[disabled] {
		opacity: 0.6;
		box-shadow: none;
	}
}
</style>
