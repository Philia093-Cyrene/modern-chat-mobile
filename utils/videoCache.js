import cache from './cache.js'

const VIDEO_CACHE_KEY = 'video_cache_info'
const MAX_CACHE_SIZE = 100 * 1024 * 1024
const MAX_CACHE_ITEMS = 20
const MAX_CONCURRENT_DOWNLOADS = 3

function isCacheEnabled() {
	return typeof cache.isEnabled === 'function' && cache.isEnabled()
}

class VideoCache {
	constructor() {
		this.cacheInfo = this.loadCacheInfo()
		this.downloadingTasks = new Map()
		this.preloadQueue = []
		this.isPreloading = false
		this.activeDownloads = 0
	}

	loadCacheInfo() {
		try {
			const info = uni.getStorageSync(VIDEO_CACHE_KEY)
			return info || { items: {}, totalSize: 0, lastCleanup: Date.now() }
		} catch (e) {
			return { items: {}, totalSize: 0, lastCleanup: Date.now() }
		}
	}

	saveCacheInfo() {
		try {
			uni.setStorageSync(VIDEO_CACHE_KEY, this.cacheInfo)
		} catch (e) {
			console.error('保存视频缓存信息失败:', e)
		}
	}

	getCachePath(url) {
		const base = (typeof uni !== 'undefined' && uni.env && uni.env.USER_DATA_PATH) ? uni.env.USER_DATA_PATH : ''
		if (!base) return ''
		const hash = this.hashUrl(url)
		return `${base}/video_cache_${hash}.mp4`
	}

	hashUrl(url) {
		let hash = 0
		for (let i = 0; i < url.length; i++) {
			const char = url.charCodeAt(i)
			hash = ((hash << 5) - hash) + char
			hash = hash & hash
		}
		return Math.abs(hash).toString(16)
	}

	async checkCached(url) {
		const cacheItem = this.cacheInfo.items[url]
		if (!cacheItem || !cacheItem.path) return null

		const path = cacheItem.path
		try {
			const fileInfo = await this.getFileInfo(path)
			if (fileInfo && fileInfo.size > 0) {
				cacheItem.lastAccess = Date.now()
				this.saveCacheInfo()
				return path
			}
		} catch (e) {
			console.log('缓存文件不存在或已损坏')
		}

		delete this.cacheInfo.items[url]
		this.saveCacheInfo()
		return null
	}

	getFileInfo(filePath) {
		return new Promise((resolve) => {
			uni.getFileInfo({
				filePath,
				success: (res) => resolve(res),
				fail: () => resolve(null)
			})
		})
	}

	async downloadVideo(url, onProgress) {
		if (this.downloadingTasks.has(url)) {
			return this.downloadingTasks.get(url)
		}

		const downloadTask = new Promise((resolve, reject) => {
			const task = uni.downloadFile({
				url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: async (saveRes) => {
								const savedFilePath = (saveRes && saveRes.savedFilePath) || ''
								if (!savedFilePath) {
									reject(new Error('保存文件失败'))
									return
								}
								try {
									// 同时保存到系统相册
									uni.saveVideoToPhotosAlbum({
										filePath: res.tempFilePath,
										success: () => {
										console.log('视频已保存到系统相册')
										// 保存成功后更新缓存信息
										this.updateCacheAfterAlbumSave(url, savedFilePath, res)
										resolve(savedFilePath)
									},
										fail: (err) => {
										console.warn('保存到系统相册失败:', err)
										// 即使保存到相册失败，也要继续保存到缓存
										this.updateCacheAfterAlbumSave(url, savedFilePath, res)
										resolve(savedFilePath)
									}
									})
								} catch (e) {
									console.warn('处理视频保存失败:', e)
									resolve(savedFilePath)
								}
							},
							fail: (err) => reject(err || new Error('保存文件失败'))
						})
					} else {
						reject(new Error(`下载失败: ${res.statusCode}`))
					}
				},
				fail: reject
			})

			if (onProgress && task.onProgressUpdate) {
				task.onProgressUpdate((res) => {
					onProgress(res.progress, res.totalBytesWritten, res.totalBytesExpectedToWrite)
				})
			}
		})

		this.downloadingTasks.set(url, downloadTask)
		
		try {
			const result = await downloadTask
			return result
		} finally {
			this.downloadingTasks.delete(url)
		}
	}

	async updateCacheAfterAlbumSave(url, savedFilePath, res) {
		try {
			let size = res.totalBytesExpectedToWrite || res.contentLength || 0
			if (!size) {
				const info = await this.getFileInfo(savedFilePath)
				size = (info && info.size) || 0
			}
			this.addCacheItem(url, savedFilePath, size)
		} catch (e) {
			console.warn('写入缓存信息失败:', e)
		}
	}

	addCacheItem(url, cachePath, size) {
		const safeSize = Number(size) || 0
		this.cacheInfo.items[url] = {
			path: cachePath,
			size: safeSize,
			timestamp: Date.now(),
			lastAccess: Date.now()
		}
		this.cacheInfo.totalSize = (this.cacheInfo.totalSize || 0) + safeSize
		this.saveCacheInfo()
		this.cleanupIfNeeded()
	}

	async cleanupIfNeeded() {
		const items = Object.entries(this.cacheInfo.items)
		
		if (items.length <= MAX_CACHE_ITEMS && this.cacheInfo.totalSize <= MAX_CACHE_SIZE) {
			return
		}

		items.sort((a, b) => a[1].lastAccess - b[1].lastAccess)
		
		while ((items.length > MAX_CACHE_ITEMS || this.cacheInfo.totalSize > MAX_CACHE_SIZE) && items.length > 0) {
			const [oldestUrl, oldestItem] = items.shift()
			const itemSize = Number(oldestItem.size) || 0

			try {
				uni.removeSavedFile({ filePath: oldestItem.path })
			} catch (e) {
				console.log('删除缓存文件失败:', e)
			}

			this.cacheInfo.totalSize = Math.max(0, (this.cacheInfo.totalSize || 0) - itemSize)
			delete this.cacheInfo.items[oldestUrl]
		}
		
		this.cacheInfo.lastCleanup = Date.now()
		this.saveCacheInfo()
	}

	async getVideoPath(url, options = {}) {
		if (!url) return null

		if (options.useNetworkOnly) {
			return { path: url, fromCache: false }
		}

		if (!isCacheEnabled()) {
			return { path: url, fromCache: false }
		}

		try {
			const cached = await this.checkCached(url)
			if (cached) {
				return { path: cached, fromCache: true }
			}
		} catch (e) {
			console.warn('检查视频缓存失败:', e)
		}

		if (options.preloadOnly) {
			return { path: url, fromCache: false }
		}

		this.cacheInBackground(url)
		return { path: url, fromCache: false }
	}

	cacheInBackground(url) {
		if (!url || !isCacheEnabled()) return
		if (this.cacheInfo.items[url] || this.downloadingTasks.has(url)) return
		if (this.preloadQueue.includes(url)) return
		this.preloadQueue.push(url)
		this.processPreloadQueue()
	}

	preloadVideo(url) {
		if (!url || !isCacheEnabled()) return
		if (this.cacheInfo.items[url] || this.downloadingTasks.has(url)) return
		if (this.preloadQueue.includes(url)) return

		this.preloadQueue.push(url)
		this.processPreloadQueue()
	}

	async processPreloadQueue() {
		if (this.isPreloading || this.preloadQueue.length === 0) {
			return
		}

		this.isPreloading = true
		
		const processNext = async () => {
			if (this.preloadQueue.length === 0) {
				this.isPreloading = false
				return
			}

			if (this.activeDownloads >= MAX_CONCURRENT_DOWNLOADS) {
				// 等待一段时间后再次检查
				setTimeout(processNext, 200)
				return
			}

			const url = this.preloadQueue.shift()
			this.activeDownloads++
			
			try {
				const cached = await this.checkCached(url)
				if (!cached) {
					await this.downloadVideo(url)
				}
			} catch (e) {
				console.error('预加载视频失败:', url, e)
				// 触发全局错误事件，通知UI更新
				if (typeof uni !== 'undefined' && uni.$emit) {
					uni.$emit('videoLoadFailed', { url })
				}
			} finally {
				this.activeDownloads--
				// 处理下一个任务
				processNext()
			}
		}

		// 启动多个并发下载
		for (let i = 0; i < MAX_CONCURRENT_DOWNLOADS && this.preloadQueue.length > 0; i++) {
			processNext()
		}
	}

	preloadVideos(urls) {
		urls.forEach(url => this.preloadVideo(url))
	}

	clearCache() {
		Object.values(this.cacheInfo.items).forEach(item => {
			try {
				uni.removeSavedFile({ filePath: item.path })
			} catch (e) {
				console.log('删除缓存文件失败:', e)
			}
		})
		
		this.cacheInfo = { items: {}, totalSize: 0, lastCleanup: Date.now() }
		this.saveCacheInfo()
		this.preloadQueue = []
	}

	getCacheStats() {
		return {
			itemCount: Object.keys(this.cacheInfo.items).length,
			totalSize: this.cacheInfo.totalSize,
			queueLength: this.preloadQueue.length,
			isPreloading: this.isPreloading
		}
	}
}

const videoCache = new VideoCache()

export default videoCache
