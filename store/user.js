const USER_INFO_KEY = 'userInfo'
const IS_LOGGED_IN_KEY = 'isLoggedIn'

const userStore = {
	state: {
		userInfo: uni.getStorageSync(USER_INFO_KEY) || null,
		isLoggedIn: uni.getStorageSync(IS_LOGGED_IN_KEY) || false
	},
	
	getters: {
		userInfo: (state) => state.userInfo,
		isLoggedIn: (state) => state.isLoggedIn,
		userId: (state) => state.userInfo?.id || null,
		username: (state) => state.userInfo?.username || '',
		avatar: (state) => state.userInfo?.avatar || ''
	},
	
	mutations: {
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo
			uni.setStorageSync(USER_INFO_KEY, userInfo)
		},
		
		SET_LOGGED_IN(state, status) {
			state.isLoggedIn = status
			uni.setStorageSync(IS_LOGGED_IN_KEY, status)
		},
		
		CLEAR_USER(state) {
			state.userInfo = null
			state.isLoggedIn = false
			uni.removeStorageSync(USER_INFO_KEY)
			uni.removeStorageSync(IS_LOGGED_IN_KEY)
		}
	},
	
	actions: {
		login({ commit }, userInfo) {
			commit('SET_USER_INFO', userInfo)
			commit('SET_LOGGED_IN', true)
		},
		
		logout({ commit }) {
			commit('CLEAR_USER')
		},
		
		updateUserInfo({ commit, state }, updateData) {
			const newUserInfo = { ...state.userInfo, ...updateData }
			commit('SET_USER_INFO', newUserInfo)
		}
	}
}

export function checkLogin() {
	const isLoggedIn = uni.getStorageSync(IS_LOGGED_IN_KEY)
	const userInfo = uni.getStorageSync(USER_INFO_KEY)
	
	if (!isLoggedIn || !userInfo) {
		uni.showToast({
			title: '登录已过期，请重新登录',
			icon: 'none'
		})
		uni.redirectTo({
			url: '/pages/login/login'
		})
		return false
	}
	
	return true
}

export function getUserInfo() {
	const userInfo = uni.getStorageSync(USER_INFO_KEY)
	return userInfo && typeof userInfo === 'object' && userInfo !== null ? userInfo : {}
}

export function setUserInfo(userInfo) {
	uni.setStorageSync(USER_INFO_KEY, userInfo)
	uni.setStorageSync(IS_LOGGED_IN_KEY, true)
}

export function clearUserInfo() {
	uni.removeStorageSync(USER_INFO_KEY)
	uni.removeStorageSync(IS_LOGGED_IN_KEY)
}

export default userStore
