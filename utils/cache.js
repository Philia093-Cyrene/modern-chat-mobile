const CACHE_ENABLED_KEY = 'cache_enabled'
const CACHE_PREFIX = 'cache_'
const CACHE_EXPIRY_PREFIX = 'cache_expiry_'
const DEFAULT_EXPIRY = 24 * 60 * 60 * 1000
const DATABASE_PATH = '_doc/data/db/appdb.db'
const DATABASE_LOCKED_SUFFIX = '.lock.bak'

const CACHE_KEYS = {
	FRIENDS: 'friends',
	GROUPS: 'groups',
	FRIEND_REQUESTS: 'friend_requests',
	MESSAGES: 'messages',
	GROUP_MESSAGES: 'group_messages',
	GROUP_MEMBERS: 'group_members'
}

// 缓存类型
const CACHE_TYPES = {
	LOCAL: 'local',
	DATABASE: 'database'
}

// 当前缓存类型
let currentCacheType = uni.getStorageSync('cache_type') || CACHE_TYPES.LOCAL

// 数据库实例
let dbInstance = null

// 生成随机密钥
function generateKey() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 简单加密函数
function encrypt(data, key) {
	try {
		const jsonString = JSON.stringify(data)
		let result = ''
		for (let i = 0; i < jsonString.length; i++) {
			const charCode = jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length)
			result += String.fromCharCode(charCode)
		}
		return btoa(unescape(encodeURIComponent(result)))
	} catch (e) {
		console.error('Encryption error:', e)
		return null
	}
}

// 简单解密函数
function decrypt(encryptedData, key) {
	try {
		const decoded = decodeURIComponent(escape(atob(encryptedData)))
		let result = ''
		for (let i = 0; i < decoded.length; i++) {
			const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
			result += String.fromCharCode(charCode)
		}
		return JSON.parse(result)
	} catch (e) {
		console.error('Decryption error:', e)
		return null
	}
}

// 初始化数据库
function initDatabase() {
	// #ifdef APP-PLUS
	try {
		const fs = uni.getFileSystemManager()
		
		// 确保目录存在
		const dirPath = '_doc/data/db'
		try {
			fs.accessSync(dirPath)
		} catch (e) {
			fs.mkdirSync(dirPath, { recursive: true })
		}
		
		// 打开或创建数据库
		const db = plus.sqlite.openDatabase({
			name: 'appdb',
			path: DATABASE_PATH
		})
		
		// 创建表
		db.executeSql({
			sql: 'CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, data TEXT, expiry INTEGER)'
		})
		
		dbInstance = db
		return true
	} catch (e) {
		console.error('Database initialization error:', e)
		return false
	}
	// #endif
	return false
}

// 关闭数据库
function closeDatabase() {
	// #ifdef APP-PLUS
	if (dbInstance) {
		plus.sqlite.closeDatabase({ name: 'appdb' })
		dbInstance = null
	}
	// #endif
}

// 数据库校验
async function validateDatabase() {
	// #ifdef APP-PLUS
	try {
		const fs = uni.getFileSystemManager()
		
		// 检查数据库文件是否存在
		try {
			fs.accessSync(DATABASE_PATH)
		} catch (e) {
			// 数据库文件不存在，创建新的
			initDatabase()
			return true
		}
		
		// 获取当前用户信息
		const userInfo = uni.getStorageSync('userInfo')
		if (!userInfo || !userInfo.token) {
			// 未登录，跳过校验
			return true
		}
		
		// 与服务器进行校验
		try {
			const response = await uni.request({
				url: 'https://chat.modern-chat.top/chat/api-pc.php',
				method: 'POST',
			header: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': userInfo.token
				},
				data: {
					action: 'validate_database',
					user_id: userInfo.id
				}
			})
			
			if (response.statusCode === 200 && response.data && response.data.status === 'success') {
				// 服务器返回的校验信息
				const serverData = response.data.data
				
				// 读取本地数据库中的消息数据
				const localMessages = getLocalMessages()
				
				// 比较本地消息与服务器消息
				if (compareMessages(localMessages, serverData)) {
					// 校验通过
					return true
				} else {
					// 校验失败，重命名数据库文件
					const lockedPath = DATABASE_PATH + DATABASE_LOCKED_SUFFIX
					try {
						fs.renameSync(DATABASE_PATH, lockedPath)
						
						// 二次加密（不记录密钥）
						const lockedContent = fs.readFileSync(lockedPath, 'binary')
						const tempKey = generateKey()
						const encryptedContent = encrypt(lockedContent, tempKey)
						if (encryptedContent) {
							fs.writeFileSync(lockedPath, encryptedContent, 'binary')
						}
						
						// 重新初始化数据库
						initDatabase()
						
						// 弹出提示
						uni.showModal({
							title: '数据库错误',
							content: '原有数据库核对失败：ERROR_001，已重新记录数据库，旧数据库已锁定！！！',
							showCancel: false
						})
						
						return false
					} catch (renameError) {
						console.error('Failed to rename database:', renameError)
						// 即使重命名失败，也要创建新数据库
						initDatabase()
						return false
					}
				}
			} else {
				// 服务器校验失败，使用本地数据库
				return true
			}
		} catch (apiError) {
			console.error('API validation error:', apiError)
			// API请求失败，使用本地数据库
			return true
		}
	} catch (e) {
		console.error('Database validation error:', e)
		return false
	}
	// #endif
	return true
}

// 读取本地数据库中的消息数据
function getLocalMessages() {
	// #ifdef APP-PLUS
	if (dbInstance) {
		try {
			const messages = []
			// 查询所有消息数据
			dbInstance.executeSql({
				sql: 'SELECT * FROM cache WHERE key LIKE ? OR key LIKE ?',
				args: ['%' + CACHE_KEYS.MESSAGES + '%', '%' + CACHE_KEYS.GROUP_MESSAGES + '%'],
				success: function(res) {
					if (res.result && res.result.rows) {
						for (let i = 0; i < res.result.rows.length; i++) {
							const row = res.result.rows.item(i)
							try {
								const data = JSON.parse(row.data)
								messages.push(data)
							} catch (e) {
								console.error('Failed to parse message data:', e)
							}
						}
					}
				},
				fail: function(e) {
					console.error('Failed to get local messages:', e)
				}
			})
			return messages
		} catch (e) {
			console.error('Error getting local messages:', e)
			return []
		}
	}
	// #endif
	return []
}

// 比较本地消息与服务器消息
function compareMessages(localMessages, serverMessages) {
	// 简化实现，实际应该根据消息ID和内容进行比较
	if (!localMessages || !serverMessages) {
		return false
	}
	
	// 检查消息数量是否一致
	if (localMessages.length !== serverMessages.length) {
		return false
	}
	
	// 检查消息ID是否匹配
	const localIds = localMessages.map(msg => msg.id).sort()
	const serverIds = serverMessages.map(msg => msg.id).sort()
	
	for (let i = 0; i < localIds.length; i++) {
		if (localIds[i] !== serverIds[i]) {
			return false
		}
	}
	
	return true
}

// 设置缓存类型
function setCacheType(type) {
	if (type === CACHE_TYPES.DATABASE) {
		const initialized = initDatabase()
		if (initialized) {
			currentCacheType = CACHE_TYPES.DATABASE
			uni.setStorageSync('cache_type', CACHE_TYPES.DATABASE)
			// 验证数据库
			validateDatabase()
			return true
		}
		return false
	} else {
		currentCacheType = CACHE_TYPES.LOCAL
		uni.setStorageSync('cache_type', CACHE_TYPES.LOCAL)
		closeDatabase()
		return true
	}
}

// 获取缓存类型
function getCacheType() {
	return currentCacheType
}

function isEnabled() {
	const enabled = uni.getStorageSync(CACHE_ENABLED_KEY)
	return enabled === true || enabled === 'true'
}

function setEnabled(enabled) {
	uni.setStorageSync(CACHE_ENABLED_KEY, enabled)
	if (!enabled) {
		clearAll()
	}
}

function getCacheKey(key, suffix = '') {
	return CACHE_PREFIX + key + (suffix ? '_' + suffix : '')
}

function getExpiryKey(key, suffix = '') {
	return CACHE_EXPIRY_PREFIX + key + (suffix ? '_' + suffix : '')
}

function set(key, data, expiry = DEFAULT_EXPIRY, suffix = '') {
	if (!isEnabled()) return false
	
	try {
		const cacheKey = getCacheKey(key, suffix)
		
		if (currentCacheType === CACHE_TYPES.DATABASE) {
			// 使用数据库存储
			if (dbInstance) {
				const expiryTime = Date.now() + expiry
				const encryptedData = encrypt(data, 'database_key')
				
				dbInstance.executeSql({
					sql: 'INSERT OR REPLACE INTO cache (key, data, expiry) VALUES (?, ?, ?)',
					args: [cacheKey, encryptedData || JSON.stringify(data), expiryTime]
				})
				return true
			}
		} else {
			// 使用本地存储
			const expiryKey = getExpiryKey(key, suffix)
			
			uni.setStorageSync(cacheKey, {
				data: data,
				timestamp: Date.now()
			})
			uni.setStorageSync(expiryKey, Date.now() + expiry)
			return true
		}
	} catch (e) {
		console.error('Cache set error:', e)
		return false
	}
	return false
}

function get(key, suffix = '') {
	if (!isEnabled()) return null
	
	try {
		const cacheKey = getCacheKey(key, suffix)
		
		if (currentCacheType === CACHE_TYPES.DATABASE) {
			// 从数据库获取
			if (dbInstance) {
				let result = null
				dbInstance.executeSql({
					sql: 'SELECT * FROM cache WHERE key = ?',
					args: [cacheKey],
					success: function(res) {
						if (res.result && res.result.rows.length > 0) {
							const row = res.result.rows.item(0)
							const expiry = row.expiry
							if (expiry && Date.now() > expiry) {
								// 过期，删除
								remove(key, suffix)
								result = null
							} else {
								// 解密数据
								try {
									const decryptedData = decrypt(row.data, 'database_key')
									result = decryptedData || JSON.parse(row.data)
								} catch (e) {
									console.error('Failed to decrypt data:', e)
									result = JSON.parse(row.data)
								}
							}
						}
					},
					fail: function(e) {
						console.error('Failed to get data from database:', e)
						result = null
					}
				})
				return result
			}
		} else {
			// 从本地存储获取
			const expiryKey = getExpiryKey(key, suffix)
			
			const expiry = uni.getStorageSync(expiryKey)
			if (expiry && Date.now() > expiry) {
				remove(key, suffix)
				return null
			}
			
			const cached = uni.getStorageSync(cacheKey)
			if (cached && cached.data) {
				return cached.data
			}
		}
	} catch (e) {
		console.error('Cache get error:', e)
		return null
	}
	return null
}

function remove(key, suffix = '') {
	try {
		const cacheKey = getCacheKey(key, suffix)
		
		if (currentCacheType === CACHE_TYPES.DATABASE) {
			// 从数据库删除
			if (dbInstance) {
				dbInstance.executeSql({
					sql: 'DELETE FROM cache WHERE key = ?',
					args: [cacheKey]
				})
				return true
			}
		} else {
			// 从本地存储删除
			const expiryKey = getExpiryKey(key, suffix)
			uni.removeStorageSync(cacheKey)
			uni.removeStorageSync(expiryKey)
			return true
		}
	} catch (e) {
		console.error('Cache remove error:', e)
		return false
	}
	return false
}

function clearAll() {
	try {
		if (currentCacheType === CACHE_TYPES.DATABASE) {
			// 清理数据库
			if (dbInstance) {
				dbInstance.executeSql({
					sql: 'DELETE FROM cache'
				})
				return true
			}
		} else {
			// 清理本地存储
			const info = uni.getStorageInfoSync()
			const keys = info.keys || []
			
			keys.forEach(key => {
				if (key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRY_PREFIX)) {
					uni.removeStorageSync(key)
				}
			})
			
			return true
		}
	} catch (e) {
		console.error('Cache clear all error:', e)
		return false
	}
	return false
}

function getCacheSize() {
	try {
		if (currentCacheType === CACHE_TYPES.DATABASE) {
			// 计算数据库缓存大小
			if (dbInstance) {
				let totalSize = 0
				dbInstance.executeSql({
					sql: 'SELECT data FROM cache',
					success: function(res) {
						if (res.result && res.result.rows) {
							for (let i = 0; i < res.result.rows.length; i++) {
								const row = res.result.rows.item(i)
								if (row.data) {
									totalSize += row.data.length
								}
							}
						}
					},
					fail: function(e) {
						console.error('Failed to get database cache size:', e)
					}
				})
				return totalSize
			}
		} else {
			// 计算本地存储缓存大小
			const info = uni.getStorageInfoSync()
			const keys = info.keys || []
			let totalSize = 0
			
			keys.forEach(key => {
				if (key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRY_PREFIX)) {
					const value = uni.getStorageSync(key)
					if (value) {
						totalSize += JSON.stringify(value).length
					}
				}
			})
			
			return totalSize
		}
	} catch (e) {
		console.error('Get cache size error:', e)
		return 0
	}
	return 0
}

function formatSize(bytes) {
	if (bytes < 1024) return bytes + ' B'
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
	return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function getMessagesKey(chatId, chatType) {
	return chatType === 'group' ? CACHE_KEYS.GROUP_MESSAGES : CACHE_KEYS.MESSAGES
}

function setMessages(chatId, chatType, messages) {
	const key = getMessagesKey(chatId, chatType)
	return set(key, messages, DEFAULT_EXPIRY, String(chatId))
}

function getMessages(chatId, chatType) {
	const key = getMessagesKey(chatId, chatType)
	return get(key, String(chatId))
}

function clearMessages(chatId, chatType) {
	const key = getMessagesKey(chatId, chatType)
	return remove(key, String(chatId))
}

function clearAllMessages() {
	try {
		if (currentCacheType === CACHE_TYPES.DATABASE) {
			// 清理数据库中的消息
			if (dbInstance) {
				dbInstance.executeSql({
					sql: 'DELETE FROM cache WHERE key LIKE ? OR key LIKE ?',
					args: ['%' + CACHE_KEYS.MESSAGES + '%', '%' + CACHE_KEYS.GROUP_MESSAGES + '%']
				})
				return true
			}
		} else {
			// 清理本地存储中的消息
			const info = uni.getStorageInfoSync()
			const keys = info.keys || []
			
			keys.forEach(k => {
				if (k.startsWith(CACHE_PREFIX + CACHE_KEYS.MESSAGES + '_') ||
					k.startsWith(CACHE_PREFIX + CACHE_KEYS.GROUP_MESSAGES + '_') ||
					k.startsWith(CACHE_EXPIRY_PREFIX + CACHE_KEYS.MESSAGES + '_') ||
					k.startsWith(CACHE_EXPIRY_PREFIX + CACHE_KEYS.GROUP_MESSAGES + '_')) {
					uni.removeStorageSync(k)
				}
			})
			
			return true
		}
	} catch (e) {
		console.error('Clear all messages error:', e)
		return false
	}
	return false
}

export default {
	isEnabled,
	setEnabled,
	set,
	get,
	remove,
	clearAll,
	getCacheSize,
	formatSize,
	CACHE_KEYS,
	setMessages,
	getMessages,
	clearMessages,
	clearAllMessages,
	CACHE_TYPES,
	setCacheType,
	getCacheType,
	initDatabase,
	validateDatabase
}
