<template>
  <view class="video-player-container" v-if="visible">
    <view class="video-overlay" @click="onOverlayClick">
      <view class="video-wrapper" @click.stop>
        <video
          v-if="!hasError && videoSrc"
          id="videoPlayer"
          class="video-element"
          :src="videoSrc"
          :controls="true"
          :autoplay="autoPlay"
          :show-center-play-btn="true"
          :enable-progress-gesture="true"
          :show-fullscreen-btn="true"
          :show-play-btn="true"
          :show-loading="true"
          play-btn-position="center"
          object-fit="contain"
          preload="auto"
          @play="onPlay"
          @pause="onPause"
          @ended="onEnded"
          @error="onError"
          @waiting="onWaiting"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @loadeddata="onLoadedData"
        ></video>

        <view class="loading-indicator" v-if="isLoading">
          <view class="loading-content">
            <view class="spinner"></view>
            <text class="loading-text">{{ loadingText || '加载中...' }}</text>
            <view class="progress-bar-wrap">
              <view class="progress-bar-track">
                <view class="progress-bar-fill" :style="{ width: loadProgress + '%' }"></view>
              </view>
              <text class="progress-bar-text" v-if="loadProgress < 100">{{ loadProgress }}%</text>
            </view>
          </view>
        </view>

        <view class="error-view" v-if="hasError">
          <view class="error-icon-wrap">
            <text class="error-icon">▶</text>
          </view>
          <text class="error-title">视频加载失败</text>
          <text class="error-desc">请检查网络后重试，或尝试直接使用网络播放</text>
          <view class="error-actions">
            <view class="retry-btn" @click.stop="retry">重试</view>
            <view class="retry-btn secondary" @click.stop="retryWithNetwork">使用网络播放</view>
          </view>
        </view>

        <view class="cache-badge" v-if="fromCache && !hasError && !isLoading">
          <text class="cache-icon">💾</text>
          <text class="cache-text">已缓存</text>
        </view>
        
        <view class="caching-badge" v-if="isCaching && !hasError && !isLoading">
          <view class="caching-spinner"></view>
          <text class="caching-text">缓存中 {{ cacheProgress }}%</text>
        </view>
      </view>

      <view class="close-btn" @click.stop="handleCloseClick">
        <text class="close-icon">✕</text>
      </view>
      <view class="close-hint" v-if="!hasError && !isLoading">点击空白处或按返回键关闭</view>
    </view>
  </view>
</template>

<script>
import videoCache from '@/utils/videoCache.js'

export default {
  name: 'VideoPlayer',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      videoSrc: '',
      isPlaying: false,
      isLoading: false,
      loadingText: '加载中...',
      loadProgress: 0,
      loadProgressTimer: null,
      currentTime: 0,
      duration: 0,
      fromCache: false,
      videoContext: null,
      hasError: false,
      useNetworkOnly: false,
      isCaching: false,
      cacheProgress: 0,
      cacheDownloadTask: null
    }
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.useNetworkOnly = false
        this.isLoading = true
        this.loadProgress = 0
        this.loadingText = '加载中...'
        this.startLoadProgressSimulate()
        this.initVideo()
      } else {
        this.stopLoadProgressSimulate()
        this.cleanup()
      }
    },
    src(newVal) {
      if (newVal && this.visible) {
        this.initVideo()
      }
    }
  },

  methods: {
    async initVideo() {
      if (!this.src) return

      this.isLoading = true
      this.loadingText = '准备播放...'
      this.hasError = false

      try {
        const result = await videoCache.getVideoPath(this.src, {
          useNetworkOnly: this.useNetworkOnly
        })

        if (result && result.path) {
          this.videoSrc = result.path
          this.fromCache = result.fromCache || false
          this.loadingText = result.fromCache ? '从缓存加载...' : '正在加载...'
          
          if (!this.fromCache && !this.useNetworkOnly) {
            this.startCachingInBackground()
          }
        } else {
          this.videoSrc = this.src
          this.fromCache = false
          this.loadingText = '正在加载...'
          
          if (!this.useNetworkOnly) {
            this.startCachingInBackground()
          }
        }

        this.$nextTick(() => {
          try {
            this.videoContext = uni.createVideoContext('videoPlayer', this)
          } catch (e) {
            console.warn('createVideoContext 失败，视频将使用默认控制:', e)
          }
        })
      } catch (e) {
        console.warn('初始化视频失败，尝试直接使用网络地址:', e)
        this.hasError = false
        this.videoSrc = this.src || ''
        this.fromCache = false
        this.loadingText = '网络加载中...'
        
        if (!this.useNetworkOnly) {
          this.startCachingInBackground()
        }
        
        this.$nextTick(() => {
          try {
            this.videoContext = uni.createVideoContext('videoPlayer', this)
          } catch (err) {}
        })
      }
    },

    startCachingInBackground() {
      if (!this.src || this.fromCache) return
      
      const cacheInfo = videoCache.getCacheStats()
      if (videoCache.cacheInfo.items && videoCache.cacheInfo.items[this.src]) {
        return
      }
      
      this.isCaching = true
      this.cacheProgress = 0
      
      this.cacheDownloadTask = uni.downloadFile({
        url: this.src,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (saveRes) => {
                const savedPath = saveRes.savedFilePath
                if (savedPath) {
                  const size = res.totalBytesExpectedToWrite || 0
                  videoCache.addCacheItem(this.src, savedPath, size)
                  this.isCaching = false
                  this.cacheProgress = 100
                }
              },
              fail: () => {
                this.isCaching = false
              }
            })
          } else {
            this.isCaching = false
          }
        },
        fail: () => {
          this.isCaching = false
        }
      })
      
      if (this.cacheDownloadTask && this.cacheDownloadTask.onProgressUpdate) {
        this.cacheDownloadTask.onProgressUpdate((res) => {
          this.cacheProgress = res.progress
        })
      }
    },

    stopCaching() {
      if (this.cacheDownloadTask) {
        try {
          this.cacheDownloadTask.abort()
        } catch (e) {}
        this.cacheDownloadTask = null
      }
      this.isCaching = false
      this.cacheProgress = 0
    },

    startLoadProgressSimulate() {
      this.stopLoadProgressSimulate()
      this.loadProgress = 0
      const step = () => {
        if (!this.visible || !this.isLoading) return
        if (this.loadProgress >= 90) return
        this.loadProgress += Math.random() * 8 + 4
        if (this.loadProgress > 90) this.loadProgress = 90
        this.loadProgressTimer = setTimeout(step, 200)
      }
      this.loadProgressTimer = setTimeout(step, 300)
    },

    stopLoadProgressSimulate() {
      if (this.loadProgressTimer) {
        clearTimeout(this.loadProgressTimer)
        this.loadProgressTimer = null
      }
    },

    onPlay() {
      this.isPlaying = true
      this.isLoading = false
      this.loadProgress = 100
      this.stopLoadProgressSimulate()
      this.$emit('play')
      if (!this.fromCache && this.src) {
        videoCache.preloadVideo(this.src)
      }
    },

    onPause() {
      this.isPlaying = false
      this.$emit('pause')
    },

    onEnded() {
      this.isPlaying = false
      this.currentTime = 0
      this.$emit('ended')
    },

    onError(e) {
      this.hasError = true
      this.isLoading = false
      this.loadProgress = 0
      this.stopLoadProgressSimulate()
      this.isPlaying = false
      console.error('视频播放错误:', e)
      this.$emit('error', e)
    },

    retry() {
      this.hasError = false
      this.useNetworkOnly = false
      this.isLoading = true
      this.loadProgress = 0
      this.loadingText = '重新加载...'
      this.startLoadProgressSimulate()
      this.initVideo()
    },

    retryWithNetwork() {
      this.hasError = false
      this.useNetworkOnly = true
      this.isLoading = true
      this.loadProgress = 0
      this.loadingText = '使用网络地址加载...'
      this.startLoadProgressSimulate()
      this.initVideo()
    },

    onWaiting() {
      if (!this.fromCache) {
        this.isLoading = true
        this.loadingText = '缓冲中...'
      }
      this.$emit('waiting')
    },

    onTimeUpdate(e) {
      if (e.detail) {
        this.currentTime = e.detail.currentTime || 0
        this.duration = e.detail.duration || 0
      }
      this.$emit('timeupdate', e)
    },

    onLoadedMetadata(e) {
      this.isLoading = false
      this.loadProgress = 100
      this.stopLoadProgressSimulate()
      if (e.detail) {
        this.duration = e.detail.duration || 0
      }
      this.$emit('loadedmetadata', e)
      if (!this.fromCache && this.src) {
        videoCache.preloadVideo(this.src)
      }
    },

    onLoadedData(e) {
      this.isLoading = false
      this.loadProgress = 100
      this.stopLoadProgressSimulate()
      this.$emit('loadeddata', e)
    },

    onOverlayClick() {
      this.handleCloseClick()
    },

    handleCloseClick() {
      if (!this.visible) return
      this.cleanup()
      this.$emit('close')
    },

    close() {
      this.handleCloseClick()
    },

    cleanup() {
      this.stopLoadProgressSimulate()
      this.stopCaching()
      if (this.videoContext) {
        try {
          this.videoContext.pause()
          this.videoContext.stop()
        } catch (e) {
          console.log('清理视频失败:', e)
        }
        this.videoContext = null
      }
      this.videoSrc = ''
      this.isPlaying = false
      this.isLoading = false
      this.loadProgress = 0
      this.currentTime = 0
      this.hasError = false
      this.isCaching = false
      this.cacheProgress = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.video-player-container {
  position: fixed;
  inset: 0;
  z-index: 2000;
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #2a2a2e 0%, #1e1e22 50%, #16161a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-element {
  width: 100%;
  height: 100%;
  max-height: 100vh;
}

.close-btn {
  position: absolute;
  top: calc(env(safe-area-inset-top) + 20rpx);
  right: 32rpx;
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.2s ease;

  &:active {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0.95);
  }

  .close-icon {
    color: #fff;
    font-size: 36rpx;
    font-weight: 300;
  }
}

.loading-indicator {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 20;
  pointer-events: none;
  animation: fadeIn 0.15s ease;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 24rpx;
  backdrop-filter: blur(10px);
}

.loading-indicator .spinner {
  width: 100rpx;
  height: 100rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.15);
  border-top-color: #12b7f5;
  border-right-color: #12b7f5;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loading-indicator .loading-text {
  margin-top: 32rpx;
  color: rgba(255, 255, 255, 0.95);
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
}

.progress-bar-wrap {
  margin-top: 36rpx;
  width: 85%;
  max-width: 520rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.progress-bar-track {
  width: 100%;
  height: 16rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #12b7f5, #0ea5d9, #12b7f5);
  background-size: 200% 100%;
  border-radius: 8rpx;
  transition: width 0.2s ease;
  animation: shimmer 1.5s linear infinite;
}

.progress-bar-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 26rpx;
  font-weight: 500;
}

.error-view {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  padding: 48rpx;

  .error-icon-wrap {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
  }

  .error-icon {
    color: rgba(255, 255, 255, 0.5);
    font-size: 48rpx;
    margin-left: 8rpx;
  }

  .error-title {
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 12rpx;
  }

  .error-desc {
    color: rgba(255, 255, 255, 0.7);
    font-size: 26rpx;
    margin-bottom: 32rpx;
  }

  .error-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
  }

  .retry-btn {
    padding: 20rpx 48rpx;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
    border-radius: 40rpx;
    transition: all 0.2s ease;
  }

  .retry-btn.secondary {
    background: transparent;
    border: 1rpx solid rgba(255, 255, 255, 0.4);
  }

  .retry-btn:active {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(0.98);
  }

  .retry-btn.secondary:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.close-hint {
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom) + 24rpx);
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 22rpx;
  z-index: 50;
  pointer-events: none;
}

.cache-badge {
  position: absolute;
  top: calc(env(safe-area-inset-top) + 100rpx);
  right: 32rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: rgba(18, 183, 245, 0.9);
  border-radius: 24rpx;
  z-index: 10;
  animation: slideInRight 0.3s ease;

  .cache-icon {
    font-size: 24rpx;
  }

  .cache-text {
    color: #fff;
    font-size: 22rpx;
    font-weight: 500;
  }
}

.caching-badge {
  position: absolute;
  top: calc(env(safe-area-inset-top) + 100rpx);
  right: 32rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  background: rgba(255, 152, 0, 0.9);
  border-radius: 24rpx;
  z-index: 10;
  animation: slideInRight 0.3s ease;

  .caching-spinner {
    width: 28rpx;
    height: 28rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .caching-text {
    color: #fff;
    font-size: 22rpx;
    font-weight: 500;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
