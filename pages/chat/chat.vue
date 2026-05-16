<template>
	<view class="chat-container" :class="{ 'theme-dark': themeMode === 'dark' }" :style="[cssVariables, { fontFamily: currentFontFamily }]">
		<!-- 主界面：带右滑手势 -->
		<view 
			class="main-wrap" 
			v-if="!currentChat"
			@touchstart="onProfileDrawerTouchStart"
			@touchend="onProfileDrawerTouchEnd"
			:class="{ 'drawer-open': showProfileDrawer }"
		>
			<view class="profile-drawer-mask" v-if="showProfileDrawer" @click="showProfileDrawer = false"></view>
			<view class="profile-drawer" :class="{ open: showProfileDrawer }">
				<view class="profile-drawer-header" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="profile-drawer-avatar" @click="changeAvatar">
				<image v-if="userInfo.avatar" class="avatar-img" :src="getAvatarUrl(userInfo.avatar)" mode="aspectFill" @error="handleAvatarError"></image>
				<text v-else>{{ userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U' }}</text>
				<view class="avatar-edit-overlay">
					<text class="edit-icon">✎</text>
				</view>
			</view>
				<text class="profile-drawer-name">{{ userInfo.username || '用户' }}</text>
				<text class="profile-drawer-email">{{ userInfo.email || '' }}</text>
			</view>
				<view class="profile-drawer-body">
					<view class="profile-drawer-item" @click="openScanLogin">
						<text>扫码登录网页端</text>
						<text class="item-arrow">›</text>
					</view>
					<view class="profile-drawer-item version-item" @click="checkUpdate">
						<text>检查更新</text>
						<text class="version-badge">{{ appVersion }}</text>
					</view>
					<view class="profile-drawer-item theme-item">
						<text>深色模式</text>
						<view class="toggle-wrap" :class="{ on: themeMode === 'dark' }" @click="toggleThemeView">
							<view class="toggle-thumb"></view>
						</view>
					</view>
					<view class="profile-drawer-item color-theme-item" @click="showColorPalette = true">
						<text>调色盘</text>
						<view class="color-theme-preview">
							<view class="color-preview-dot" :style="{ background: currentThemeColors.primaryColor }"></view>
							<text class="color-theme-name">{{ currentThemeName }}</text>
							<text class="item-arrow">›</text>
						</view>
					</view>
					<view class="profile-drawer-item font-item" @click="openFontPalette">
						<text>字体库</text>
						<view class="font-preview-info">
							<text class="font-preview-name">{{ currentFontName }}</text>
							<text class="item-arrow">›</text>
						</view>
					</view>
					<view class="profile-drawer-item cache-item">
						<text>本地缓存</text>
						<view class="cache-item-right">
							<view class="cache-chevron" v-if="cacheEnabled" @click.stop="cacheSectionExpanded = !cacheSectionExpanded">
								<text class="chevron-icon" :class="{ collapsed: !cacheSectionExpanded }">▼</text>
							</view>
							<view class="toggle-wrap" :class="{ on: cacheEnabled }" @click="toggleCacheView">
								<view class="toggle-thumb"></view>
							</view>
						</view>
					</view>
					<view class="profile-drawer-cache-info" v-if="cacheEnabled && cacheSectionExpanded">
						<text class="cache-size">缓存大小: {{ cacheSizeText }}</text>
						<view class="cache-actions">
							<view class="cache-btn" @click="clearCache">清除缓存</view>
							<view class="cache-btn" @click="clearMessagesCache">清除聊天记录</view>
						</view>
					</view>
					<view class="profile-drawer-footer">
						<view class="profile-drawer-item" @click="showProfileDrawer = false">
							<text>关闭</text>
						</view>
						<view class="profile-drawer-item logout" @click="handleLogout">
							<text>退出登录</text>
						</view>
					</view>
				</view>
			</view>
			<view class="sidebar" :class="{ 'sidebar-shifted': showProfileDrawer }">
			<view class="sidebar-header" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="header-content">
					<view class="header-title">Modern Chat</view>
					<view class="header-actions">
						<view class="action-btn" @click="showAddFriend = true">
							<image class="icon-img" src="/static/icons/add-user.svg" mode="aspectFit"/>
						</view>
						<view class="action-btn" @click="showCreateGroup = true">
							<image class="icon-img" src="/static/icons/add-group.svg" mode="aspectFit"/>
						</view>
					</view>
				</view>
			</view>
			
			<view class="tab-bar">
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'friends' }"
					@click="activeTab = 'friends'"
				>
					好友
					<view class="badge" v-if="friendRequestsCount > 0">{{ friendRequestsCount }}</view>
				</view>
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'groups' }"
					@click="activeTab = 'groups'"
				>
					群聊
				</view>
			</view>
			
			<scroll-view 
				class="chat-list" 
				scroll-y 
				:style="{ height: listHeight + 'px' }"
				@refresherrefresh="onRefresh"
				:refresher-enabled="true"
				:refresher-triggered="isRefreshing"
				:refresher-background="themeMode === 'dark' ? '#16161a' : '#f5f5f5'"
				:refresher-default-style="themeMode === 'dark' ? 'white' : 'black'"
			>
				<view v-if="activeTab === 'friends'">
					<view 
						class="chat-item" 
						v-for="friend in friends" 
						:key="'f' + friend.id"
						@click="openChat('friend', friend)"
					>
						<view class="chat-avatar">
							<text>{{ friend.username ? friend.username.charAt(0).toUpperCase() : 'U' }}</text>
						</view>
						<view class="chat-info">
							<view class="chat-name">{{ friend.username }}</view>
							<view class="chat-last-message" v-html="escapeHtml(friend.last_message) || '暂无消息'"></view>
						</view>
						<view class="chat-meta">
						<view class="unread-badge" v-if="friend.unread > 0">{{ friend.unread > 99 ? '99+' : friend.unread }}</view>
					</view>
					</view>
					
					<view class="empty-state" v-if="friends.length === 0 && !isLoading">
						<image class="empty-icon empty-icon-img" src="/static/icons/users.svg" mode="aspectFit"/>
						<text class="empty-text">暂无好友</text>
						<view class="empty-btn" @click="showAddFriend = true">添加好友</view>
					</view>
				</view>
				
				<view v-else>
					<view 
						class="chat-item" 
						v-for="group in groups" 
						:key="'g' + group.id"
						@click="openChat('group', group)"
					>
						<view class="chat-avatar group">
							<image class="avatar-icon" src="/static/icons/users.svg" mode="aspectFit"/>
						</view>
						<view class="chat-info">
							<view class="chat-name">{{ group.name }}</view>
							<view class="chat-last-message" v-html="escapeHtml(group.last_message) || '暂无消息'"></view>
						</view>
						<view class="chat-meta">
						<view class="unread-badge" v-if="group.unread > 0">{{ group.unread > 99 ? '99+' : group.unread }}</view>
					</view>
					</view>
					
					<view class="empty-state" v-if="groups.length === 0 && !isLoading">
						<image class="empty-icon empty-icon-img" src="/static/icons/users.svg" mode="aspectFit"/>
						<text class="empty-text">暂无群聊</text>
						<view class="empty-btn" @click="showCreateGroup = true">创建群聊</view>
					</view>
				</view>
				
				<view class="loading-state" v-if="isLoading">
					<view class="loading-spinner"></view>
					<text class="loading-text">加载中...</text>
				</view>
			</scroll-view>
			
			<view class="sidebar-footer" :style="{ paddingBottom: safeAreaBottom + 'px' }">
				<view class="footer-icon" :class="{ active: activeTab === 'friends' }" @click="activeTab = 'friends'">
					<image class="footer-icon-img" src="/static/icons/chat.svg" mode="aspectFit"/>
				</view>
				<view class="footer-icon" @click="showFriendRequests = true">
					<image class="footer-icon-img" src="/static/icons/mail.svg" mode="aspectFit"/>
					<view class="footer-badge" v-if="friendRequestsCount > 0">{{ friendRequestsCount }}</view>
				</view>
			</view>
			</view>
		</view>
		
		<view class="chat-area" v-else>
			<view class="chat-header" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="header-content">
					<view class="back-btn" @click="closeChat">
						<image class="back-icon" src="/static/icons/back.svg" mode="aspectFit"/>
					</view>
					<view class="chat-header-info">
						<view class="chat-header-name">{{ currentChat.name }}</view>
					</view>
					<view class="header-actions">
						<view class="action-btn" @click="showChatInfo = true">
							<image class="icon-img" src="/static/icons/more.svg" mode="aspectFit"/>
						</view>
					</view>
				</view>
			</view>
			
			<scroll-view 
				class="messages-container" 
				scroll-y 
				:scroll-top="scrollTop"
				:style="{ height: messageHeight + 'px' }"
				:scroll-with-animation="true"
			>
				<view 
					class="message" 
					:class="{ sent: msg.sender_id == userId, received: msg.sender_id != userId }"
					v-for="(msg, index) in messages" 
					:key="msg.id || 'temp_' + index"
					@touchstart="onMessageTouchStart($event, msg, index)"
					@touchend="onMessageTouchEnd"
					@touchcancel="onMessageTouchEnd"
				>
					<view class="message-avatar" v-if="msg.sender_id != userId">
						<text>{{ msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : 'U' }}</text>
					</view>
					<view class="message-content">
						<view class="message-sender" v-if="currentChat.type === 'group' && msg.sender_id != userId">
							{{ msg.sender_name }}
						</view>
						<view v-if="msg.recalled" class="message-recalled">
							<text>{{ msg.sender_id == userId ? '您' : msg.sender_name }} 撤回了一条消息</text>
						</view>
						<view v-else-if="isImageMessage(msg) && !msg.imageLoadFailed" class="message-image-wrapper" @longpress="showImageOptions(msg)">
							<view class="image-loading" v-if="!msg.imageLoaded">
								<view class="image-loading-placeholder">
									<view class="image-loading-spinner"></view>
								</view>
							</view>
							<image
								class="message-image"
								:class="{ 'image-loaded': msg.imageLoaded }"
								:src="getMessageImageUrl(msg)"
								mode="widthFix"
								@click="previewImage(getMessageImageUrl(msg))"
								@load="handleImageLoad(msg)"
								@error="handleImageError(msg)"
							></image>
						</view>
						<view v-else-if="msg.imageLoadFailed" class="message-image-error" @click="retryLoadImage(msg)">
							<image class="error-icon" src="/static/icons/image.svg" mode="aspectFit"/>
							<text class="error-text">文件已被清理</text>
							<text class="error-retry-hint">点击重试</text>
						</view>
						<view v-else-if="isVideoMessage(msg)" class="message-video-wrapper" @click="playVideo(msg)" @longpress="showVideoOptions(msg)">
							<image v-if="!msg.videoCoverFailed" class="video-cover" :src="getVideoCover(msg)" mode="aspectFill" @error="handleVideoCoverError(msg)"></image>
							<view v-else class="message-video-error">
								<image class="error-icon" src="/static/icons/video.svg" mode="aspectFit"/>
								<text class="error-text">文件已被清理</text>
							</view>
							<view class="video-play-overlay" v-if="!msg.videoCoverFailed">
								<view class="video-play-icon"><view class="video-play-triangle"></view></view>
							</view>
							<view class="video-duration-badge" v-if="msg.video_duration && !msg.videoCoverFailed">{{ formatVideoDuration(msg.video_duration) }}</view>
						</view>
						<view v-else-if="isAudioMessage(msg)" class="message-audio-wrapper" @click="playAudio(msg)" @longpress="showAudioOptions(msg)">
							<image v-if="!msg.audioLoadFailed" class="audio-icon" :src="isPlayingAudio(msg) ? '/static/icons/pause.svg' : '/static/icons/play.svg'" mode="aspectFit"/>
							<view v-else class="message-audio-error">
								<image class="error-icon" src="/static/icons/mic.svg" mode="aspectFit"/>
								<text class="error-text">语音已被清理</text>
							</view>
							<view v-if="!msg.audioLoadFailed" class="audio-info">
								<view class="audio-waveform">
									<view class="wave-bar" v-for="i in 20" :key="i" :style="{ height: isPlayingAudio(msg) ? getWaveHeight(i) + 'rpx' : '8rpx' }"></view>
								</view>
								<text class="audio-duration">{{ formatAudioDuration(msg.audio_duration || 0) }}</text>
							</view>
						</view>
						<view v-else-if="isFileMessage(msg)" class="message-file-wrapper" @click="downloadFile(msg)" @longpress="showFileOptions(msg)">
							<image v-if="!msg.fileLoadFailed" class="file-icon" src="/static/icons/file.svg" mode="aspectFit"/>
							<view v-else class="message-file-error">
								<image class="error-icon" src="/static/icons/file.svg" mode="aspectFit"/>
								<text class="error-text">文件已被清理</text>
							</view>
							<view v-if="!msg.fileLoadFailed" class="file-info">
								<text class="file-name">{{ msg.file_name || '文件' }}</text>
								<text class="file-size">{{ formatFileSize(msg.file_size) }}</text>
							</view>
						</view>
						<view v-else class="message-text">
							<text v-for="(part, index) in parseMessageContent(msg.content)" :key="index" 
								:class="{ 'message-link': part.type === 'link' }"
								@tap="part.type === 'link' && handleLinkClick(part.content)">
								{{ part.content }}
							</text>
						</view>
						<view v-if="msg.uploadProgress !== undefined && msg.uploadProgress < 100 && msg.status === 'uploading'" class="message-upload-progress">
							<progress class="upload-progress-bar" :percent="msg.uploadProgress" stroke-width="4" activeColor="#12b7f5" backgroundColor="rgba(255,255,255,0.3)"/>
							<text class="upload-progress-text">{{ msg.uploadProgress }}%</text>
						</view>
						<view class="message-footer">
							<view class="message-time">{{ formatTime(msg.created_at) }}</view>
							<view class="message-status" v-if="msg.sender_id == userId">
								<text v-if="msg.status === 'uploading'" class="status-icon uploading">↑</text>
								<text v-else-if="msg.status === 'sending'" class="status-icon">⏳</text>
								<text v-else-if="msg.status === 'sent'" class="status-icon">✓</text>
								<text v-else-if="msg.status === 'read'" class="status-icon read">✓✓</text>
								<text v-else class="status-icon">✓</text>
							</view>
						</view>
					</view>
					<view class="message-avatar" v-if="msg.sender_id == userId">
						<text>{{ userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U' }}</text>
					</view>
				</view>
				
				<view class="empty-state" v-if="messages.length === 0 && !isLoading">
					<image class="empty-icon empty-icon-img" src="/static/icons/chat.svg" mode="aspectFit"/>
					<text class="empty-text">暂无消息</text>
				</view>
			</scroll-view>
			
			<view class="input-area" :style="{ paddingBottom: safeAreaBottom + 'px' }">
				<view class="input-container">
					<view class="input-wrapper">
						<textarea 
							v-model="inputMessage" 
							placeholder="输入消息..."
							:adjust-position="true"
							:auto-height="true"
							:maxlength="2000"
						></textarea>
						<view class="char-count" :class="{ warning: inputMessage.length > 1800 }">
							{{ inputMessage.length }}/2000
						</view>
					</view>
					<view class="input-actions">
						<view class="send-btn" @click="sendMessage" :class="{ active: inputMessage.trim() }">发送</view>
						<view class="more-popover-wrap">
							<view class="more-actions-popover" v-if="showMoreActions">
								<view class="btn-icon record-btn" hover-class="record-btn-hover" @tap.stop="onRecordFromMenu">
									<image class="record-icon-img" :class="{ recording: isRecording }" src="/static/icons/mic.svg" mode="aspectFit"/>
								</view>
								<view class="btn-icon" @click="onChooseImage">
									<image class="btn-icon-img" src="/static/icons/image.svg" mode="aspectFit"/>
								</view>
								<view class="btn-icon" @click="onChooseVideo">
									<image class="btn-icon-img" src="/static/icons/video.svg" mode="aspectFit"/>
								</view>
							</view>
							<view class="btn-icon plus-btn" @click="showMoreActions = !showMoreActions">
								<text class="plus-icon">+</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="popup-overlay" v-if="showAddFriend" @click="showAddFriend = false"></view>
		<view class="popup" :class="{ open: showAddFriend }">
			<view class="popup-header">
				<text class="popup-title">添加好友</text>
				<view class="popup-close" @click="showAddFriend = false">✕</view>
			</view>
			<view class="popup-content">
				<view class="form-group">
					<text class="label">搜索用户</text>
					<input 
						type="text" 
						v-model="searchKeyword" 
						placeholder="输入邮箱或用户名搜索"
						@confirm="searchUser"
					/>
				</view>
				<view class="search-results" v-if="searchResults.length > 0">
					<view class="search-item" v-for="user in searchResults" :key="user.id">
						<view class="user-avatar">
							<text>{{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}</text>
						</view>
						<view class="user-info">
							<text class="user-name">{{ user.username }}</text>
							<text class="user-email">{{ user.email }}</text>
						</view>
						<view class="add-btn" @click="sendFriendRequest(user.id)">添加</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="popup-overlay" v-if="showCreateGroup" @click="showCreateGroup = false"></view>
		<view class="popup" :class="{ open: showCreateGroup }">
			<view class="popup-header">
				<text class="popup-title">创建群聊</text>
				<view class="popup-close" @click="showCreateGroup = false">✕</view>
			</view>
			<view class="popup-content">
				<view class="form-group">
					<text class="label">群名称</text>
					<input 
						type="text" 
						v-model="newGroupName" 
						placeholder="请输入群名称"
					/>
				</view>
				<button class="popup-btn" @click="createGroup">创建</button>
			</view>
		</view>
		
		<view class="popup-overlay" v-if="showFriendRequests" @click="showFriendRequests = false"></view>
		<view class="popup" :class="{ open: showFriendRequests }">
			<view class="popup-header">
				<text class="popup-title">好友请求</text>
				<view class="popup-close" @click="showFriendRequests = false">✕</view>
			</view>
			<view class="popup-content">
				<view class="request-item" v-for="req in friendRequests" :key="req.request_id || req.id">
					<view class="user-avatar">
						<text>{{ req.username ? req.username.charAt(0).toUpperCase() : 'U' }}</text>
					</view>
					<view class="user-info">
						<text class="user-name">{{ req.username }}</text>
						<text class="user-email">{{ req.email }}</text>
					</view>
					<view class="request-actions">
						<view class="accept-btn" @click="acceptRequest(req.request_id || req.id)">接受</view>
						<view class="reject-btn" @click="rejectRequest(req.request_id || req.id)">拒绝</view>
					</view>
				</view>
				<view class="empty-state small" v-if="friendRequests.length === 0">
					<text class="empty-text">暂无好友请求</text>
				</view>
			</view>
		</view>
		
		<view class="popup-overlay" v-if="showChatInfo" @click="showChatInfo = false"></view>
		<view class="popup" :class="{ open: showChatInfo }">
			<view class="popup-header">
				<text class="popup-title">{{ currentChat ? (currentChat.type === 'group' ? '群聊信息' : '聊天信息') : '聊天信息' }}</text>
				<view class="popup-close" @click="showChatInfo = false">✕</view>
			</view>
			<view class="popup-content">
				<view class="chat-info-section" v-if="currentChat">
					<view class="info-item">
						<text class="info-label">名称</text>
						<text class="info-value">{{ currentChat.name }}</text>
					</view>
					<view class="info-item" v-if="currentChat.type === 'group'">
						<text class="info-label">成员数量</text>
						<text class="info-value">{{ groupMembers.length }}人</text>
					</view>
				</view>
				
				<view class="section-title" v-if="currentChat && currentChat.type === 'group'">群成员</view>
				<scroll-view class="members-list" v-if="currentChat && currentChat.type === 'group'" scroll-y>
					<view class="member-item" v-for="member in groupMembers" :key="member.id">
						<view class="member-avatar">
							<text>{{ member.username ? member.username.charAt(0).toUpperCase() : 'U' }}</text>
						</view>
						<view class="member-info">
							<text class="member-name">{{ member.username }}</text>
							<text class="member-role" v-if="member.is_owner">群主</text>
							<text class="member-role" v-else-if="member.is_admin">管理员</text>
						</view>
					</view>
				</scroll-view>
				
				<view class="action-buttons" v-if="currentChat && currentChat.type === 'group'">
					<view class="action-btn primary" @click="showInviteMembersDialog">
						<text>👥+ 邀请好友</text>
					</view>
					<view class="action-btn" @click="leaveGroup">
						<text>🚪 退出群聊</text>
					</view>
				</view>
			</view>
		</view>

		<view class="popup-overlay" v-if="showInviteMembers" @click="showInviteMembers = false"></view>
		<view class="popup" :class="{ open: showInviteMembers }">
			<view class="popup-header">
				<text class="popup-title">邀请好友加入群聊</text>
				<view class="popup-close" @click="showInviteMembers = false">✕</view>
			</view>
			<view class="popup-content">
				<scroll-view class="friends-list" scroll-y>
					<view class="friend-item" v-for="friend in availableFriends" :key="friend.id">
						<view class="friend-avatar">
							<text>{{ friend.username ? friend.username.charAt(0).toUpperCase() : 'U' }}</text>
						</view>
						<view class="friend-info">
							<text class="friend-name">{{ friend.username }}</text>
						</view>
						<view class="invite-checkbox" :class="{ checked: selectedFriends.includes(friend.id) }" @click="toggleFriendSelection(friend.id)">
							<text v-if="selectedFriends.includes(friend.id)">✓</text>
						</view>
					</view>
					<view class="empty-state small" v-if="availableFriends.length === 0">
						<text class="empty-text">没有可邀请的好友</text>
					</view>
				</scroll-view>
				<view class="invite-actions">
					<view class="invite-btn" @click="inviteFriends" :disabled="selectedFriends.length === 0">
						邀请 ({{ selectedFriends.length }})
					</view>
				</view>
			</view>
		</view>
		
		<view class="toast" v-if="toastMessage">{{ toastMessage }}</view>
		
		<!-- 下载进度条 -->
		<view class="download-progress-overlay" v-if="showDownloadProgress">
			<view class="download-progress-card">
				<text class="download-progress-title">正在下载更新</text>
				<progress class="download-progress-bar" :percent="downloadProgress" stroke-width="6" activeColor="#12b7f5" backgroundColor="#e4e4e7"/>
				<text class="download-progress-percent">{{ downloadProgress }}%</text>
			</view>
		</view>
		
		<!-- 全屏视频播放 -->
		<VideoPlayer
			:visible="videoPlayerVisible"
			:src="videoPlayerSrc"
			:auto-play="true"
			@close="closeVideoPlayer"
			@ended="closeVideoPlayer"
			@error="handleVideoPlayerError"
		/>
		
		<!-- 更新说明弹窗 -->
		<view class="popup-overlay" v-if="showReleaseNotes" @click="closeReleaseNotes"></view>
		<view class="popup release-notes-popup" :class="{ open: showReleaseNotes }">
			<view class="popup-header">
				<text class="popup-title">{{ releaseNotesData ? releaseNotesData.title : '' }}</text>
				<view class="popup-close" @click="closeReleaseNotes">✕</view>
			</view>
			<view class="popup-content" v-if="releaseNotesData">
				<text class="release-notes-subtitle">包含的功能更新：</text>
				<view class="release-notes-list">
					<view class="release-notes-item" v-for="(item, index) in releaseNotesData.items" :key="index">
						<text class="release-notes-num">{{ index + 1 }}.</text>
						<text class="release-notes-text">{{ item }}</text>
					</view>
				</view>
				<view class="release-notes-btn" @click="closeReleaseNotes">知道了</view>
			</view>
		</view>
		
		<!-- 消息菜单 -->
		<view class="message-menu-overlay" v-if="showMessageMenu" @click="closeMessageMenu"></view>
		<view class="message-menu" v-if="showMessageMenu && selectedMessage">
			<view 
				class="menu-item" 
				v-if="getCopyableText(selectedMessage)"
				@click="onCopyClick"
			>
				复制消息
			</view>
			<view 
				class="menu-item" 
				v-if="canRecallMessage(selectedMessage)"
				@click="onRecallClick"
			>
				撤回消息
			</view>
			<view 
				class="menu-item" 
				v-if="selectedMessage.sender_id == userId"
				@click="onDeleteClick"
			>
				删除消息
			</view>
			<view class="menu-item" @click="closeMessageMenu">取消</view>
		</view>
		
		<view class="upload-manager-btn" v-if="hasActiveUploads" @click="showUploadManager = true">
			<view class="upload-btn-icon">
				<view class="upload-spinner"></view>
			</view>
			<text class="upload-btn-text">{{ activeUploadCount }}个上传中</text>
		</view>
		
		<view class="popup-overlay" v-if="showUploadManager" @click="showUploadManager = false"></view>
		<view class="popup upload-manager-popup" :class="{ open: showUploadManager }">
			<view class="popup-header">
				<text class="popup-title">上传任务</text>
				<view class="popup-close" @click="showUploadManager = false">✕</view>
			</view>
			<view class="popup-content">
				<view class="upload-task-item" v-for="(task, index) in uploadTasks" :key="task.id">
					<view class="upload-task-info">
						<text class="upload-task-name">{{ task.fileName }}</text>
						<text class="upload-task-size">{{ formatFileSize(task.fileSize) }}</text>
					</view>
					<view class="upload-task-progress-wrap">
						<progress class="upload-task-progress" :percent="task.progress" stroke-width="4" activeColor="#12b7f5" backgroundColor="#e4e4e7"/>
						<text class="upload-task-percent">{{ task.progress }}%</text>
					</view>
					<view class="upload-task-status">
						<text v-if="task.status === 'uploading'" class="status-uploading">上传中</text>
						<text v-else-if="task.status === 'sending'" class="status-sending">发送中</text>
						<text v-else-if="task.status === 'completed'" class="status-completed">已完成</text>
						<text v-else-if="task.status === 'failed'" class="status-failed">失败</text>
					</view>
					<view class="upload-task-actions">
						<view v-if="task.status === 'uploading'" class="upload-task-cancel" @click="cancelUploadTask(task.id)">取消</view>
						<view v-else-if="task.status === 'failed'" class="upload-task-retry" @click="retryUploadTask(task)">重试</view>
						<view v-else-if="task.status === 'completed'" class="upload-task-remove" @click="removeUploadTask(task.id)">移除</view>
					</view>
				</view>
				<view class="empty-state small" v-if="uploadTasks.length === 0">
					<text class="empty-text">暂无上传任务</text>
				</view>
			</view>
		</view>
		
		<view class="popup-overlay" v-if="showScanLogin" @click="showScanLogin = false"></view>
		<view class="popup scan-login-popup" :class="{ open: showScanLogin }">
			<view class="popup-header">
				<text class="popup-title">扫码登录网页端</text>
				<view class="popup-close" @click="showScanLogin = false">✕</view>
			</view>
			<view class="popup-content">
				<view class="scan-login-info" v-if="scanLoginInfo">
					<view class="scan-login-icon">
						<text class="icon-desktop">🖥</text>
					</view>
					<text class="scan-login-title">网页端登录请求</text>
					<text class="scan-login-ip">登录IP: {{ scanLoginInfo.ip || '获取中...' }}</text>
					<text class="scan-login-hint">请确认是否允许登录</text>
				</view>
				
				<view class="scan-login-loading" v-if="scanLoginLoading">
					<view class="scan-loading-spinner"></view>
					<text class="scan-loading-text">{{ scanLoginLoadingText }}</text>
				</view>
				
				<view class="scan-login-error" v-if="scanLoginError">
					<text class="error-text">{{ scanLoginError }}</text>
					<view class="retry-btn" @click="retryScanLogin">重试</view>
				</view>
				
				<view class="scan-login-actions" v-if="!scanLoginLoading && !scanLoginError && scanLoginInfo">
					<view class="scan-btn reject" @click="rejectScanLogin">拒绝</view>
					<view class="scan-btn confirm" @click="confirmScanLogin">确认登录</view>
				</view>
				
				<view class="scan-login-success" v-if="scanLoginSuccess">
					<text class="success-icon">✓</text>
					<text class="success-text">登录成功！</text>
					<text class="success-hint">网页端已成功登录</text>
				</view>
			</view>
		</view>
		
		<view class="popup-overlay" v-if="showColorPalette" @click="showColorPalette = false"></view>
		<view class="popup color-palette-popup" :class="{ open: showColorPalette }">
			<view class="popup-header">
				<text class="popup-title">调色盘</text>
				<view class="popup-close" @click="showColorPalette = false">✕</view>
			</view>
			<view class="popup-content">
				<scroll-view scroll-y class="palette-scroll">
					<view class="category-tabs">
						<view 
							class="category-tab" 
							:class="{ active: activeCategory === 'all' }"
							@click="activeCategory = 'all'"
						>
							<text>全部</text>
						</view>
						<view 
							class="category-tab" 
							v-for="(category, key) in themeCategories" 
							:key="key"
							:class="{ active: activeCategory === key }"
							@click="activeCategory = key"
						>
							<text>{{ category.name }}</text>
						</view>
					</view>
					<view class="color-palette-grid">
						<view 
							class="color-theme-card" 
							v-for="themeItem in filteredThemeList" 
							:key="themeItem.id"
							:class="{ active: currentColorTheme === themeItem.id }"
							@click="selectColorTheme(themeItem.id)"
						>
							<view class="theme-preview">
								<view class="theme-preview-header" :style="{ background: themeItem.primaryColor }"></view>
								<view class="theme-preview-body">
									<view class="theme-preview-avatar" :style="{ background: themeItem.primaryColor }"></view>
									<view class="theme-preview-lines">
										<view class="theme-preview-line" :style="{ background: themeItem.primaryColor, opacity: 0.3 }"></view>
										<view class="theme-preview-line short" :style="{ background: themeItem.primaryColor, opacity: 0.2 }"></view>
									</view>
								</view>
							</view>
							<view class="theme-info">
								<text class="theme-name">{{ themeItem.name }}</text>
								<text class="theme-desc">{{ themeItem.description }}</text>
							</view>
							<view class="theme-check" v-if="currentColorTheme === themeItem.id">
								<text>✓</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view class="popup-overlay" v-if="showFontPalette" @click="showFontPalette = false"></view>
		<view class="popup font-palette-popup" :class="{ open: showFontPalette }">
			<view class="popup-header">
				<text class="popup-title">字体库</text>
				<view class="popup-close" @click="showFontPalette = false">✕</view>
			</view>
			<view class="popup-content">
				<scroll-view scroll-y class="palette-scroll">
					<view class="category-tabs">
						<view 
							class="category-tab" 
							:class="{ active: activeFontCategory === 'all' }"
							@click="activeFontCategory = 'all'"
						>
							<text>全部</text>
						</view>
						<view 
							class="category-tab" 
							v-for="(category, key) in fontCategories" 
							:key="key"
							:class="{ active: activeFontCategory === key }"
							@click="activeFontCategory = key"
						>
							<text>{{ category.name }}</text>
						</view>
					</view>
					<view class="font-palette-grid">
						<view 
							class="font-card" 
							v-for="fontItem in filteredFontList" 
							:key="fontItem.id"
							:class="{ active: currentFont === fontItem.id }"
							@click="selectFont(fontItem.id)"
						>
							<view class="font-preview" :style="{ fontFamily: fontItem.family }">
								<text class="font-preview-text">Aa中文한글日本</text>
							</view>
							<view class="font-info">
								<text class="font-name">{{ fontItem.name }}</text>
								<text class="font-desc">{{ fontItem.description }}</text>
							</view>
							<view class="font-check" v-if="currentFont === fontItem.id">
								<text>✓</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<canvas canvas-id="photoScanCanvas" class="hidden-canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
	</view>
</template>

<script>
import api, { getApiBaseUrl } from '@/utils/api.js'
import { APP_VERSION, APP_VERSION_CODE, RELEASE_NOTES } from '@/utils/version.js'
import { checkLogin, getUserInfo, clearUserInfo } from '@/store/user.js'
import cache from '@/utils/cache.js'
import theme from '@/utils/theme.js'
import font from '@/utils/font.js'
import videoCache from '@/utils/videoCache.js'
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import jsQR from 'jsqr'

export default {
	components: {
		VideoPlayer
	},
	
	data() {
		return {
			showAddFriend: false,
			showCreateGroup: false,
			showChatInfo: false,
			showFriendRequests: false,
			showInviteMembers: false,
			activeTab: 'friends',
			userId: null,
			userInfo: {},
			friends: [],
			groups: [],
			groupMembers: [],
			availableFriends: [],
			selectedFriends: [],
			friendRequests: [],
			friendRequestsCount: 0,
			currentChat: null,
			messages: [],
			inputMessage: '',
			scrollTop: 0,
			refreshTimer: null,
			friendRequestTimer: null,
			forceUpdateTimer: null,
			statusBarHeight: 0,
			safeAreaBottom: 0,
			listHeight: 0,
			messageHeight: 0,
			isLoading: false,
			isRefreshing: false,
			searchKeyword: '',
			searchResults: [],
			newGroupName: '',
			toastMessage: '',
			showMessageMenu: false,
			selectedMessage: null,
			selectedMessageIndex: -1,
			longPressTimer: null,
			isRecording: false,
			recorderManager: null,
			recordingTime: 0,
			recordingTimer: null,
			recordFilePath: '',
			showProfileDrawer: false,
			profileDrawerTouchStartX: 0,
			appVersion: APP_VERSION,
			playingAudioId: null,
			waveTick: 0,
			audioWaveTimer: null,
			currentAudioContext: null,
			lastLoadTime: 0,
			isInitialized: false,
			cacheEnabled: false,
			cacheSizeText: '0 B',
			isInBackground: false,
	    	backgroundRefreshTimer: null,
			cacheSectionExpanded: true,
			themeMode: 'light',
			showReleaseNotes: false,
			releaseNotesData: null,
			showDownloadProgress: false,
			downloadProgress: 0,
			currentPlayingVideo: null,
			showMoreActions: false,
			videoPlayerVisible: false,
			videoPlayerSrc: '',
			videoPreloadUrls: [],
			uploadTasks: [],
			showUploadManager: false,
			showScanLogin: false,
			scanLoginInfo: null,
			scanLoginLoading: false,
			scanLoginLoadingText: '',
			scanLoginError: '',
			scanLoginSuccess: false,
			showColorPalette: false,
			currentColorTheme: 'default-blue',
			themeList: [],
			themeCategories: {},
			activeCategory: 'all',
			showFontPalette: false,
			currentFont: 'system-default',
			fontList: [],
			fontCategories: {},
			activeFontCategory: 'all',
			canvasWidth: 600,
			canvasHeight: 600,
			// 用于跟踪已显示过通知的消息ID，避免重复显示
			notifiedMessageIds: new Set()
		}
	},
	
	computed: {
		hasActiveUploads() {
			return this.uploadTasks.some(t => t.status === 'uploading' || t.status === 'sending')
		},
		activeUploadCount() {
			return this.uploadTasks.filter(t => t.status === 'uploading' || t.status === 'sending').length
		},
		currentThemeColors() {
			const themeConfig = theme.getThemeById(this.currentColorTheme)
			return themeConfig[this.themeMode] || themeConfig.light
		},
		currentThemeName() {
			const themeItem = this.themeList.find(t => t.id === this.currentColorTheme)
			return themeItem ? themeItem.name : '蓝白'
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
		},
		filteredThemeList() {
			if (this.activeCategory === 'all') {
				return this.themeList
			}
			const category = this.themeCategories[this.activeCategory]
			if (!category) return this.themeList
			const themeIds = category.themes.map(t => t.id)
			return this.themeList.filter(t => themeIds.includes(t.id))
		},
		filteredFontList() {
			if (this.activeFontCategory === 'all') {
				return this.fontList
			}
			const category = this.fontCategories[this.activeFontCategory]
			if (!category) return this.fontList
			const fontIds = category.fonts.map(f => f.id)
			return this.fontList.filter(f => fontIds.includes(f.id))
		},
		currentFontFamily() {
			const fontItem = this.fontList.find(f => f.id === this.currentFont)
			return fontItem ? fontItem.family : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
		},
		currentFontName() {
			const fontItem = this.fontList.find(f => f.id === this.currentFont)
			return fontItem ? fontItem.name : '系统默认'
		}
	},
	
	onLoad(options) {
		if (!checkLogin()) return
		this.userInfo = getUserInfo() || {}
		console.log('onLoad userInfo:', JSON.stringify(this.userInfo))
		const parsedId = this.userInfo && this.userInfo.id ? parseInt(this.userInfo.id, 10) : null
		this.userId = isNaN(parsedId) ? null : parsedId
		this.initSystemInfo()
		this.initRecorder()
		this.initCache()
		this.initTheme()
		this.initFont()
		this.setupVideoErrorListener()
		this.loadData()
		this.fetchUserInfo()
		this.isInitialized = true
		this.checkShowReleaseNotes()
		
		// 移除对 window 对象的依赖，uni-app 中移动端不需要这样的绑定
		
		// 检查是否需要强制刷新
		if (options && options.refresh === '1') {
			setTimeout(() => {
				this.loadData(true)
			}, 500)
		}
	},
	
	onShow() {
		if (!checkLogin()) return
		this.isInBackground = false
		// 停止后台定时器
		if (this.backgroundRefreshTimer) {
			clearInterval(this.backgroundRefreshTimer)
			this.backgroundRefreshTimer = null
		}
		this.checkForceUpdate()
		const now = Date.now()
		if (this.isInitialized && (now - this.lastLoadTime > 10000)) {
			this.loadData(false)
			this.loadFriendRequests()
		}
		this.startRefresh()
		
		// 监听来自 App.vue 的事件
		uni.$on('openFriendRequests', this.handleOpenFriendRequests)
		uni.$on('openChat', this.handleOpenChat)
	},
	
	onHide() {
		this.isInBackground = true
		this.stopRefresh()
		// 启动后台消息检查，每30秒一次
		this.startBackgroundRefresh()
	},
	
	onUnload() {
		this.stopRefresh()
		this.clearLongPressTimer()
		this.stopAudioPlayback()
		
		// 解绑事件
		uni.$off('openFriendRequests', this.handleOpenFriendRequests)
		uni.$off('openChat', this.handleOpenChat)
	},
	
	onBackPress() {
		if (this.videoPlayerVisible) {
			this.closeVideoPlayer()
			return true
		}
		if (this.showAddFriend) {
			this.showAddFriend = false
			return true
		}
		if (this.showCreateGroup) {
			this.showCreateGroup = false
			return true
		}
		if (this.showFriendRequests) {
			this.showFriendRequests = false
			return true
		}
		if (this.currentChat) {
			this.closeChat()
			return true
		}
		return false
	},
	
	methods: {
		setupVideoErrorListener() {
			// 监听视频加载失败事件
			uni.$on('videoLoadFailed', (data) => {
				const { url } = data
				// 查找对应的消息并标记为加载失败
				this.messages.forEach(msg => {
					if (msg.file_path || msg.content) {
						const msgUrl = this.getImageUrl(msg.file_path || msg.content)
						if (msgUrl === url && this.isVideoMessage(msg)) {
							this.$set(msg, 'videoLoadFailed', true)
							this.$set(msg, 'videoCoverFailed', true)
						}
					}
				})
			})
		},
		
		initSystemInfo() {
			const systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight || 0
			this.safeAreaBottom = systemInfo.safeAreaInsets?.bottom || 0
			
			const windowHeight = systemInfo.windowHeight
			const headerHeight = this.statusBarHeight + 44
			const tabBarHeight = 44
			const footerHeight = 56 + this.safeAreaBottom
			const inputHeight = 56 + this.safeAreaBottom
			
			this.listHeight = windowHeight - headerHeight - tabBarHeight - footerHeight - 20
			this.messageHeight = windowHeight - headerHeight - inputHeight - 20
		},
		
		initCache() {
			this.cacheEnabled = cache.isEnabled()
			this.updateCacheSize()
		},
		initTheme() {
			this.themeMode = theme.getTheme()
			this.currentColorTheme = theme.getColorTheme()
			this.themeList = theme.getThemeList()
			this.themeCategories = theme.getThemesByCategory()
			this.applyThemeColors()
		},
		applyThemeColors() {
			const colors = this.currentThemeColors
			// #ifdef H5
			const root = document.documentElement || document.body
			if (root && root.style) {
				root.style.setProperty('--primary-color', colors.primaryColor)
				root.style.setProperty('--primary-hover', colors.primaryHover)
				root.style.setProperty('--primary-light', colors.primaryLight)
				root.style.setProperty('--primary-gradient', colors.primaryGradient)
				root.style.setProperty('--primary-gradient-alt', colors.primaryGradientAlt)
				root.style.setProperty('--bg-primary', colors.bgPrimary)
				root.style.setProperty('--bg-secondary', colors.bgSecondary)
				root.style.setProperty('--bg-tertiary', colors.bgTertiary)
				root.style.setProperty('--bg-hover', colors.bgHover)
				root.style.setProperty('--text-primary', colors.textPrimary)
				root.style.setProperty('--text-secondary', colors.textSecondary)
				root.style.setProperty('--text-tertiary', colors.textTertiary)
				root.style.setProperty('--border-color', colors.borderColor)
				root.style.setProperty('--border-light', colors.borderLight)
				root.style.setProperty('--shadow-sm', colors.shadowSm)
				root.style.setProperty('--shadow-md', colors.shadowMd)
				root.style.setProperty('--shadow-lg', colors.shadowLg)
				root.style.setProperty('--shadow-xl', colors.shadowXl)
			}
			// #endif
		},
		selectColorTheme(themeId) {
			this.currentColorTheme = themeId
			theme.setColorTheme(themeId)
			this.applyThemeColors()
			const themeItem = this.themeList.find(t => t.id === themeId)
			this.showToast(`已切换为「${themeItem ? themeItem.name : themeId}」主题`)
		},
		initFont() {
			this.currentFont = font.init()
			this.fontList = font.getFontList()
			this.fontCategories = font.getFontsByCategory()
			this.loadCurrentFont()
		},
		loadCurrentFont() {
			const fontItem = this.fontList.find(f => f.id === this.currentFont)
			if (fontItem && fontItem.googleFont) {
				font.loadFont(this.currentFont)
			}
		},
		selectFont(fontId) {
			this.currentFont = fontId
			font.setFont(fontId)
			this.loadCurrentFont()
			const fontItem = this.fontList.find(f => f.id === fontId)
			this.showToast(`已切换为「${fontItem ? fontItem.name : fontId}」字体`)
		},
		openFontPalette() {
			this.showFontPalette = true
			this.preloadVisibleFonts()
		},
		preloadVisibleFonts() {
			const fontsToLoad = this.filteredFontList.slice(0, 20).map(f => f.id)
			fontsToLoad.forEach(id => font.loadFont(id))
		},
		checkShowReleaseNotes() {
			const lastShown = uni.getStorageSync('lastShownReleaseVersion') || ''
			const notes = RELEASE_NOTES[APP_VERSION]
			if (notes && lastShown !== APP_VERSION) {
				this.releaseNotesData = notes
				this.showReleaseNotes = true
			}
		},
		closeReleaseNotes() {
			uni.setStorageSync('lastShownReleaseVersion', APP_VERSION)
			this.showReleaseNotes = false
			this.releaseNotesData = null
		},
		toggleTheme(e) {
			const isDark = e.detail.value
			this.themeMode = isDark ? theme.THEME_DARK : theme.THEME_LIGHT
			theme.setTheme(this.themeMode)
			this.showToast(isDark ? '已切换为深色模式' : '已切换为浅色模式')
		},
		toggleThemeView() {
			const isDark = this.themeMode !== 'dark'
			this.themeMode = isDark ? theme.THEME_DARK : theme.THEME_LIGHT
			theme.setTheme(this.themeMode)
			this.applyThemeColors()
			this.showToast(isDark ? '已切换为深色模式' : '已切换为浅色模式')
		},
		toggleCacheView() {
			const enabled = !this.cacheEnabled
			this.cacheEnabled = enabled
			cache.setEnabled(enabled)
			if (!enabled) {
				videoCache.clearCache()
				this.videoPreloadUrls = []
			}
			this.showToast(enabled ? '缓存已开启' : '缓存已关闭并清除')
			this.updateCacheSize()
		},
		
		updateCacheSize() {
			const dataSize = cache.getCacheSize()
			const videoStats = videoCache.getCacheStats ? videoCache.getCacheStats() : {}
			const videoSize = videoStats.totalSize || 0
			this.cacheSizeText = cache.formatSize(dataSize + videoSize)
		},
		
		toggleCache(e) {
			const enabled = e.detail.value
			this.cacheEnabled = enabled
			cache.setEnabled(enabled)
			if (enabled) {
				this.showToast('缓存已开启')
			} else {
				videoCache.clearCache()
				this.videoPreloadUrls = []
				this.showToast('缓存已关闭并清除')
			}
			this.updateCacheSize()
		},
		
		clearCache() {
			uni.showModal({
				title: '清除缓存',
				content: '确定要清除所有缓存数据吗？',
				success: (res) => {
					if (res.confirm) {
						cache.clearAll()
						videoCache.clearCache()
						this.videoPreloadUrls = []
						this.updateCacheSize()
						this.showToast('缓存已清除')
					}
				}
			})
		},
		
		clearMessagesCache() {
			uni.showModal({
				title: '清除聊天记录缓存',
				content: '确定要清除所有聊天记录缓存吗？这不会影响服务器上的消息。',
				success: (res) => {
					if (res.confirm) {
						cache.clearAllMessages()
						this.updateCacheSize()
						this.showToast('聊天记录缓存已清除')
					}
				}
			})
		},
		
		showToast(msg, duration = 2000) {
			this.toastMessage = msg
			setTimeout(() => {
				this.toastMessage = ''
			}, duration)
		},
		
		handleError(error, defaultMsg = '操作失败') {
			console.error('Error:', error)
			const message = error?.message || error?.errMsg || defaultMsg
			this.showToast(message)
		},
		
		async onRefresh() {
			this.isRefreshing = true
			await this.loadData(false)  // 下拉刷新已有原生 loading，不再显示自定义 loading-state
			this.isRefreshing = false
		},
		
		async loadData(showLoading = true) {
		if (showLoading) {
			this.isLoading = true
		}
		this.lastLoadTime = Date.now()

		const cachedFriends = cache.get(cache.CACHE_KEYS.FRIENDS)
		const cachedGroups = cache.get(cache.CACHE_KEYS.GROUPS)
		if (cachedFriends && cachedFriends.length > 0) {
			this.friends = cachedFriends
		}
		if (cachedGroups && cachedGroups.length > 0) {
			this.groups = cachedGroups
		}
		if ((cachedFriends && cachedFriends.length > 0) || (cachedGroups && cachedGroups.length > 0)) {
			this.isLoading = false
		}

		await Promise.all([
			this.loadFriends(),
			this.loadGroups()
		])
		
		// 加载完好友和群聊列表后，检查所有聊天的新消息
		if (!this.currentChat) {
			this.checkAllChatsForNewMessages()
		}
		
		if (showLoading) {
			this.isLoading = false
		}
	},
		
		async loadFriends() {
			const cached = cache.get(cache.CACHE_KEYS.FRIENDS)
			if (cached) {
				this.friends = cached
			}
			
			try {
				const res = await api.friends.list()
				let friendsList = res.data || []
				
				// 为每个好友添加最新消息
			friendsList = friendsList.map(friend => {
				// 如果API返回了last_message，则使用API返回的
				if (friend.last_message) {
					return friend
				}
				
				// 否则从缓存中获取最新消息
				const cachedMessages = cache.getMessages(friend.id, 'friend') || []
				if (cachedMessages.length > 0) {
					// 按时间排序，取最新的一条消息
					const sortedMessages = [...cachedMessages].sort((a, b) => {
						const dateA = new Date(a.created_at || 0).getTime()
						const dateB = new Date(b.created_at || 0).getTime()
						return dateB - dateA
					})
					const latestMessage = sortedMessages[0]
					if (latestMessage) {
						return {
							...friend,
							last_message: latestMessage.content || '暂无消息',
							last_message_time: latestMessage.created_at
						}
					}
				}
				
				return friend
			})
				
				this.friends = friendsList
				cache.set(cache.CACHE_KEYS.FRIENDS, this.friends)
			} catch (e) {
				if (!cached) {
					this.handleError(e, '加载好友列表失败')
				}
			}
		},
		
		async loadGroups() {
			const cached = cache.get(cache.CACHE_KEYS.GROUPS)
			if (cached) {
				this.groups = cached
			}
			
			try {
				const res = await api.groups.list()
				let groupsList = res.data || []
				
				// 为每个群聊添加最新消息
			groupsList = groupsList.map(group => {
				// 如果API返回了last_message，则使用API返回的
				if (group.last_message) {
					return group
				}
				
				// 否则从缓存中获取最新消息
				const cachedMessages = cache.getMessages(group.id, 'group') || []
				if (cachedMessages.length > 0) {
					// 按时间排序，取最新的一条消息
					const sortedMessages = [...cachedMessages].sort((a, b) => {
						const dateA = new Date(a.created_at || 0).getTime()
						const dateB = new Date(b.created_at || 0).getTime()
						return dateB - dateA
					})
					const latestMessage = sortedMessages[0]
					if (latestMessage) {
						return {
							...group,
							last_message: latestMessage.content || '暂无消息',
							last_message_time: latestMessage.created_at
						}
					}
				}
				
				return group
			})
				
				this.groups = groupsList
				cache.set(cache.CACHE_KEYS.GROUPS, this.groups)
			} catch (e) {
				if (!cached) {
					this.handleError(e, '加载群聊列表失败')
				}
			}
		},
		
		async loadFriendRequests() {
			const cached = cache.get(cache.CACHE_KEYS.FRIEND_REQUESTS)
			const previousCount = this.friendRequestsCount
			if (cached) {
				this.friendRequests = cached
				this.friendRequestsCount = this.friendRequests.length
			}
			
			try {
				const res = await api.friends.getRequests()
				const newRequests = res.data || []
				const newCount = newRequests.length
				
				// 检查是否有新的好友申请
				if (newCount > previousCount) {
					// 找到新的好友申请
					const newFriendRequests = newRequests.filter(req => {
						if (cached) {
							return !cached.some(cachedReq => (cachedReq.request_id || cachedReq.id) === (req.request_id || req.id))
						}
						return true
					})
					
					// 为每个新的好友申请显示通知
					newFriendRequests.forEach(req => {
						const username = req.username || req.sender_username || '未知用户'
						const content = `${username}请求添加您为好友`
						
						// 调用系统通知
						uni.showToast({
							title: `Modern Chat App：您收到一条好友申请点击查看${content}`,
							icon: 'none',
							duration: 3000
						})
						
						// #ifdef APP-PLUS
						// 在App端使用系统通知
						plus.push.createMessage(
							content,
							{ type: 'friend_request' },
							{
								title: 'Modern Chat App',
								cover: '',
								when: new Date().getTime()
							}
						)
						// #endif
					})
				}
				
				this.friendRequests = newRequests
				this.friendRequestsCount = newCount
				cache.set(cache.CACHE_KEYS.FRIEND_REQUESTS, this.friendRequests)
			} catch (e) {
				console.error('加载好友请求失败:', e)
			}
		},
		
		async openChat(type, item) {
			this.currentChat = {
				type,
				id: item.id,
				name: type === 'friend' ? item.username : item.name
			}
			
			this.initSystemInfo()
			await this.loadMessages()
			
			if (type === 'group') {
				await this.loadGroupMembers(item.id)
			}
		},
		
		closeChat() {
			this.currentChat = null
			this.messages = []
			this.initSystemInfo()
		},
		
		async loadMessages() {
			if (!this.currentChat) return
			
			// 首先从缓存加载
			const cached = cache.getMessages(this.currentChat.id, this.currentChat.type)
			let lastTime = '1970-01-01 00:00:00'
			
			if (cached && cached.length > 0) {
				this.messages = cached.map(msg => {
					const senderId = parseInt(msg.sender_id, 10)
					return {
						...msg,
						sender_id: isNaN(senderId) ? null : senderId,
						sender_name: msg.sender_name || msg.sender_username || ''
					}
				})
				// 获取最后一条消息的时间作为增量加载的起点
				lastTime = cached[cached.length - 1].created_at || lastTime
				
				this.$nextTick(() => {
					this.scrollToBottom()
				})
				
				this.preloadVideos(cached)
			}
			
			try {
				// 使用 poll 接口增量获取新消息
				const pollRes = await api.messages.poll(lastTime, this.currentChat.type, this.currentChat.id)
				
				if (pollRes.data && pollRes.data.messages && pollRes.data.messages.length > 0) {
					const newMessages = pollRes.data.messages.map(msg => {
						const senderId = parseInt(msg.sender_id, 10)
						return {
							...msg,
							sender_id: isNaN(senderId) ? null : senderId,
							sender_name: msg.sender_name || msg.sender_username || ''
						}
					})
					
					// 合并消息并去重
					const existingIds = new Set(this.messages.map(m => String(m.id)))
					const uniqueNewMessages = newMessages.filter(m => !existingIds.has(String(m.id)))
					
					this.messages = [...this.messages, ...uniqueNewMessages]
					
					// 保存到缓存
					cache.setMessages(this.currentChat.id, this.currentChat.type, this.messages)
					
					this.$nextTick(() => {
						this.scrollToBottom()
					})
					
					this.preloadVideos(uniqueNewMessages)
				} else if (!cached || cached.length === 0) {
					// 如果缓存为空，且 poll 没有返回新消息，才获取完整历史
					let res
					if (this.currentChat.type === 'friend') {
						res = await api.messages.history(this.currentChat.id)
					} else {
						res = await api.groups.messages(this.currentChat.id)
					}
					
					this.messages = (res.data || []).map(msg => {
						const senderId = parseInt(msg.sender_id, 10)
						return {
							...msg,
							sender_id: isNaN(senderId) ? null : senderId,
							sender_name: msg.sender_name || msg.sender_username || ''
						}
					})
					
					cache.setMessages(this.currentChat.id, this.currentChat.type, res.data || [])
					
					this.$nextTick(() => {
						this.scrollToBottom()
					})
					
					this.preloadVideos(res.data || [])
				}
				
				this.messages.forEach(msg => {
					if (!msg.status && msg.sender_id == this.userId) {
						msg.status = 'sent'
					}
				})
			} catch (e) {
				this.handleError(e, '加载消息失败')
			}
		},
		
		preloadVideos(messages) {
			if (!messages || messages.length === 0) return
			
			const videoUrls = messages
				.filter(msg => this.isVideoMessage(msg))
				.map(msg => this.getVideoUrl(msg))
				.filter(url => url && !this.videoPreloadUrls.includes(url))
			
			if (videoUrls.length > 0) {
				videoCache.preloadVideos(videoUrls)
				this.videoPreloadUrls.push(...videoUrls)
			}
		},
		
		async checkNewMessages() {
			if (!this.currentChat) return
			
			try {
				// 获取最后一条消息的时间作为增量加载的起点
				let lastTime = '1970-01-01 00:00:00'
				if (this.messages.length > 0) {
					lastTime = this.messages[this.messages.length - 1].created_at || lastTime
				}
				
				// 使用 poll 接口增量获取新消息
				const pollRes = await api.messages.poll(lastTime, this.currentChat.type, this.currentChat.id)
				
				if (pollRes.data && pollRes.data.messages && pollRes.data.messages.length > 0) {
					const newMessages = pollRes.data.messages.map(msg => {
						const senderId = parseInt(msg.sender_id, 10)
						return {
							...msg,
							sender_id: isNaN(senderId) ? null : senderId,
							sender_name: msg.sender_name || msg.sender_username || ''
						}
					})
					
					// 合并消息并去重
					const existingIds = new Set(this.messages.map(m => String(m.id)))
					const uniqueNewMessages = newMessages.filter(m => !existingIds.has(String(m.id)))
					
					if (uniqueNewMessages.length > 0) {
						this.messages = [...this.messages, ...uniqueNewMessages]
						
						// 保存到缓存
						cache.setMessages(this.currentChat.id, this.currentChat.type, this.messages)
						
						this.$nextTick(() => {
							this.scrollToBottom()
						})
						
						// 只显示最新的一条消息通知
						const latestMsg = uniqueNewMessages[uniqueNewMessages.length - 1] // 取最后一条消息（最新的）
						if (latestMsg.sender_id !== this.userId && !this.notifiedMessageIds.has(String(latestMsg.id))) { // 只显示别人发来的消息通知，且未显示过
							this.showNotification(latestMsg)
							
							// 标记该消息已显示过通知
							this.notifiedMessageIds.add(String(latestMsg.id))
						}
					}
				}
			} catch (e) {
				console.error('检查新消息失败:', e)
			}
		},

		showNotification(msg) {
			if (!this.currentChat || !msg) return
			
			// 构建新的通知格式：{发送者头像（没有就显示为APP图片）{好友名称/群聊名称} {发送者名称}:{内容}
			const avatarUrl = msg.avatar || '' // 发送者头像
			const chatName = this.currentChat.name || (this.currentChat.type === 'friend' ? '好友' : '群聊')
			const senderName = msg.sender_name || '未知'
			const content = msg.content || ''
			
			// 调用系统通知
			uni.showToast({
				title: `${chatName} ${senderName}: ${content}`,
				icon: 'none',
				duration: 3000
			})
			
			// #ifdef APP-PLUS
			// 在App端使用系统通知
			const notificationContent = `${chatName} ${senderName}: ${content}`
			plus.push.createMessage(
				notificationContent,
				{ chatId: this.currentChat.id, chatType: this.currentChat.type },
				{
					title: 'Modern Chat App',
					cover: avatarUrl || '',
					when: new Date().getTime()
				}
			)
			// #endif
		},
		
		async checkAllChatsForNewMessages() {
			// 检查所有好友和群聊的新消息
			try {
				// 检查好友消息
				for (const friend of this.friends) {
					const cachedMessages = cache.getMessages(friend.id, 'friend') || []
					let lastTime = '1970-01-01 00:00:00'
					
					if (cachedMessages.length > 0) {
						lastTime = cachedMessages[cachedMessages.length - 1].created_at || lastTime
					}
					
					// 使用 poll 接口增量获取新消息
					const pollRes = await api.messages.poll(lastTime, 'friend', friend.id)
					
					if (pollRes.data && pollRes.data.messages && pollRes.data.messages.length > 0) {
						const newMessages = pollRes.data.messages.map(msg => {
							const senderId = parseInt(msg.sender_id, 10)
							return {
								...msg,
								sender_id: isNaN(senderId) ? null : senderId,
								sender_name: msg.sender_name || msg.sender_username || ''
							}
						})
						
						// 合并到缓存
						const allMessages = [...cachedMessages, ...newMessages]
						const uniqueMessages = allMessages.filter((msg, index, self) => 
							index === self.findIndex(m => String(m.id) === String(msg.id))
						)
						
						// 更新缓存
						cache.setMessages(friend.id, 'friend', uniqueMessages)
						
						// 只显示最新的一条消息通知
						const latestMsg = newMessages[newMessages.length - 1] // 取最后一条消息（最新的）
						if (latestMsg.sender_id !== this.userId && !this.notifiedMessageIds.has(String(latestMsg.id))) {
							this.showOfflineNotification(latestMsg, friend.username, 'friend', friend.id)
							
							// 标记该消息已显示过通知
							this.notifiedMessageIds.add(String(latestMsg.id))
						}
					}
				}
				
				// 检查群聊消息
				for (const group of this.groups) {
					const cachedMessages = cache.getMessages(group.id, 'group') || []
					let lastTime = '1970-01-01 00:00:00'
					
					if (cachedMessages.length > 0) {
						lastTime = cachedMessages[cachedMessages.length - 1].created_at || lastTime
					}
					
					// 使用 poll 接口增量获取新消息
					const pollRes = await api.messages.poll(lastTime, 'group', group.id)
					
					if (pollRes.data && pollRes.data.messages && pollRes.data.messages.length > 0) {
						const newMessages = pollRes.data.messages.map(msg => {
							const senderId = parseInt(msg.sender_id, 10)
							return {
								...msg,
								sender_id: isNaN(senderId) ? null : senderId,
								sender_name: msg.sender_name || msg.sender_username || ''
							}
						})
						
						// 合并到缓存
						const allMessages = [...cachedMessages, ...newMessages]
						const uniqueMessages = allMessages.filter((msg, index, self) => 
							index === self.findIndex(m => String(m.id) === String(msg.id))
						)
						
						// 更新缓存
						cache.setMessages(group.id, 'group', uniqueMessages)
						
						// 只显示最新的一条消息通知
						const latestMsg = newMessages[newMessages.length - 1] // 取最后一条消息（最新的）
						if (latestMsg.sender_id !== this.userId && !this.notifiedMessageIds.has(String(latestMsg.id))) {
							this.showOfflineNotification(latestMsg, group.name, 'group', group.id)
							
							// 标记该消息已显示过通知
							this.notifiedMessageIds.add(String(latestMsg.id))
						}
					}
				}
			} catch (e) {
				console.error('检查所有聊天新消息失败:', e)
			}
		},

		showOfflineNotification(msg, chatName, chatType, chatId) {
			if (!msg) return
			
			// 构建新的通知格式：{发送者头像（没有就显示为APP图片）{好友名称/群聊名称} {发送者名称}:{内容}
			const avatarUrl = msg.avatar || '' // 发送者头像
			const senderName = msg.sender_name || '未知'
			const content = msg.content || ''
			
			// 调用系统通知
			uni.showToast({
				title: `${chatName} ${senderName}: ${content}`,
				icon: 'none',
				duration: 3000
			})
			
			// #ifdef APP-PLUS
			// 在App端使用系统通知
			const notificationContent = `${chatName} ${senderName}: ${content}`
			plus.push.createMessage(
				notificationContent,
				{ chatId: chatId, chatType: chatType },
				{
					title: 'Modern Chat App',
					cover: avatarUrl || '',
					when: new Date().getTime()
				}
			)
			// #endif
		},
		
		async sendMessage() {
			if (!this.inputMessage.trim() || !this.currentChat) return
			
			const content = this.inputMessage.trim()
			
			// 检查消息长度是否超过2000字
			if (content.length > 2000) {
				this.showToast('消息字符不得大于2000字')
				return
			}
			
			// 检查是否包含HTML代码
			if (this.containsHtmlCode(content)) {
				this.showToast('无法发送消息，消息不合规')
				return
			}
			const tempId = 'temp_' + Date.now()
			
			const tempMsg = {
				id: tempId,
				sender_id: this.userId,
				sender_name: this.userInfo.username,
				content: content,
				created_at: new Date().toISOString(),
				status: 'sending'
			}
			
			this.messages.push(tempMsg)
			this.inputMessage = ''
			this.$nextTick(() => {
				this.scrollToBottom()
			})
			
			try {
				let res
				if (this.currentChat.type === 'friend') {
					res = await api.messages.send(this.currentChat.id, content)
				} else {
					res = await api.groups.sendMessage(this.currentChat.id, content)
				}
				
				const msgIndex = this.messages.findIndex(m => m.id === tempId)
				if (msgIndex > -1) {
					if (res.data && res.data.message_id) {
						this.messages[msgIndex].id = res.data.message_id
					}
					this.messages[msgIndex].status = 'sent'
				}
			} catch (e) {
				const msgIndex = this.messages.findIndex(m => m.id === tempId)
				if (msgIndex > -1) {
					this.messages[msgIndex].status = 'failed'
				}
				this.showToast(e.message || '发送失败')
			}
		},
		
		onRecordFromMenu() {
			this.showMoreActions = false
			this.toggleRecord()
		},
		onChooseImage() {
			this.showMoreActions = false
			this.chooseImage()
		},
		onChooseVideo() {
			this.showMoreActions = false
			this.chooseVideo()
		},
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: async (res) => {
					const tempFilePath = res.tempFilePaths[0]
					const fileName = tempFilePath.split('/').pop()
					if (this.isDangerousFileType(fileName)) {
						this.showToast('禁止上传危险文件类型')
						return
					}
					
					// 默认不自动保存图片到系统相册，只有用户手动长按保存才保存
					
					const tempId = 'temp_' + Date.now()
					const tempMsg = {
						id: tempId,
						sender_id: this.userId,
						sender_name: this.userInfo.username,
						content: '',
						file_path: tempFilePath,
						file_name: '图片.jpg',
						file_size: 0,
						file_type: 'image/jpeg',
						created_at: new Date().toISOString(),
						status: 'uploading',
						uploadProgress: 0
					}
					
					this.messages.push(tempMsg)
					this.$nextTick(() => {
						this.scrollToBottom()
					})
					
					try {
						const uploadTask = uni.uploadFile({
							url: getApiBaseUrl(),
							filePath: tempFilePath,
							name: 'file',
							formData: {
								resource: 'upload',
								action: 'file'
							},
							withCredentials: true,
							success: async (uploadRes) => {
								if (uploadRes.statusCode === 200) {
									try {
										const data = JSON.parse(uploadRes.data)
										if (data.success) {
											const msgIndex = this.messages.findIndex(m => m.id === tempId)
											if (msgIndex > -1) {
												this.messages[msgIndex].file_path = data.data?.file_path || data.file_path
												this.messages[msgIndex].file_name = data.data?.file_name || data.file_name || '图片.jpg'
												this.messages[msgIndex].file_size = data.data?.file_size || data.file_size || 0
												this.messages[msgIndex].file_type = data.data?.file_type || data.file_type || 'image/jpeg'
												this.messages[msgIndex].status = 'sending'
												this.messages[msgIndex].uploadProgress = 100
											}
											
											if (data.data?.is_duplicate || data.is_duplicate) {
												this.showToast('文件重复，已秒传！')
											}
											
											await this.sendFileMessageAfterUpload(tempId, data)
										} else {
											const msgIndex = this.messages.findIndex(m => m.id === tempId)
											if (msgIndex > -1) {
												this.messages[msgIndex].status = 'failed'
											}
											this.showToast(data.message || '上传失败')
										}
									} catch (e) {
										const msgIndex = this.messages.findIndex(m => m.id === tempId)
										if (msgIndex > -1) {
											this.messages[msgIndex].status = 'failed'
										}
										this.showToast('解析响应失败')
									}
								} else {
									const msgIndex = this.messages.findIndex(m => m.id === tempId)
									if (msgIndex > -1) {
										this.messages[msgIndex].status = 'failed'
									}
									this.showToast('上传失败')
								}
							},
							fail: (err) => {
								const msgIndex = this.messages.findIndex(m => m.id === tempId)
								if (msgIndex > -1) {
									this.messages[msgIndex].status = 'failed'
								}
								this.showToast('上传失败，请检查网络连接')
							}
						})
						
						uploadTask.onProgressUpdate((res) => {
							const msgIndex = this.messages.findIndex(m => m.id === tempId)
							if (msgIndex > -1) {
								this.messages[msgIndex].uploadProgress = res.progress
							}
						})
					} catch (e) {
						const msgIndex = this.messages.findIndex(m => m.id === tempId)
						if (msgIndex > -1) {
							this.messages[msgIndex].status = 'failed'
						}
						this.handleError(e, '上传失败')
					}
				}
			})
		},
		
		chooseVideo() {
			uni.chooseVideo({
				sourceType: ['album', 'camera'],
				maxDuration: 300,
				compressed: false,
				success: async (res) => {
					const tempFilePath = res.tempFilePath
					const fileName = tempFilePath.split('/').pop()
					if (this.isDangerousFileType(fileName)) {
						this.showToast('禁止上传危险文件类型')
						return
					}
					const duration = res.duration || 0
					
					const tempId = 'temp_' + Date.now()
					const tempMsg = {
						id: tempId,
						sender_id: this.userId,
						sender_name: this.userInfo.username,
						content: '',
						file_path: tempFilePath,
						file_name: '视频.mp4',
						file_size: 0,
						file_type: 'video/mp4',
						video_duration: duration,
						created_at: new Date().toISOString(),
						status: 'uploading',
						uploadProgress: 0
					}
					
					this.messages.push(tempMsg)
					this.$nextTick(() => {
						this.scrollToBottom()
					})
					
					try {
						const uploadTask = uni.uploadFile({
							url: getApiBaseUrl(),
							filePath: tempFilePath,
							name: 'file',
							formData: {
								resource: 'upload',
								action: 'file'
							},
							withCredentials: true,
							success: async (uploadRes) => {
								if (uploadRes.statusCode === 200) {
									try {
										const data = JSON.parse(uploadRes.data)
										if (data.success) {
											const msgIndex = this.messages.findIndex(m => m.id === tempId)
											if (msgIndex > -1) {
												this.messages[msgIndex].file_path = data.data?.file_path || data.file_path
												this.messages[msgIndex].file_name = data.data?.file_name || data.file_name || '视频.mp4'
												this.messages[msgIndex].file_size = data.data?.file_size || data.file_size || 0
												this.messages[msgIndex].file_type = data.data?.file_type || data.file_type || 'video/mp4'
												this.messages[msgIndex].video_cover = data.data?.video_cover || data.video_cover || data.cover_path || data.thumbnail
												this.messages[msgIndex].status = 'sending'
												this.messages[msgIndex].uploadProgress = 100
											}
											
											if (data.data?.is_duplicate || data.is_duplicate) {
												this.showToast('文件重复，已秒传！')
											}
											
											await this.sendFileMessageAfterUpload(tempId, data, { video_duration: duration })
										} else {
											const msgIndex = this.messages.findIndex(m => m.id === tempId)
											if (msgIndex > -1) {
												this.messages[msgIndex].status = 'failed'
											}
											this.showToast(data.message || '上传失败')
										}
									} catch (e) {
										const msgIndex = this.messages.findIndex(m => m.id === tempId)
										if (msgIndex > -1) {
											this.messages[msgIndex].status = 'failed'
										}
										this.showToast('解析响应失败')
									}
								} else {
									const msgIndex = this.messages.findIndex(m => m.id === tempId)
									if (msgIndex > -1) {
										this.messages[msgIndex].status = 'failed'
									}
									this.showToast('上传失败')
								}
							},
							fail: (err) => {
								const msgIndex = this.messages.findIndex(m => m.id === tempId)
								if (msgIndex > -1) {
									this.messages[msgIndex].status = 'failed'
								}
								this.showToast('上传失败，请检查网络连接')
							}
						})
						
						uploadTask.onProgressUpdate((res) => {
							const msgIndex = this.messages.findIndex(m => m.id === tempId)
							if (msgIndex > -1) {
								this.messages[msgIndex].uploadProgress = res.progress
							}
						})
					} catch (e) {
						const msgIndex = this.messages.findIndex(m => m.id === tempId)
						if (msgIndex > -1) {
							this.messages[msgIndex].status = 'failed'
						}
						this.handleError(e, '上传失败')
					}
				}
			})
		},
		
		async sendFileMessage(uploadRes, type, extraInfo = {}) {
			const data = uploadRes.data || uploadRes
			const filePath = data.file_path
			const fileName = data.file_name || (type === 'image' ? '图片.jpg' : type === 'video' ? '视频.mp4' : '文件')
			const fileSize = data.file_size || 0
			const fileType = data.file_type || (type === 'image' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : 'application/octet-stream')
			const videoCover = data.video_cover || data.cover_path || data.thumbnail
			
			const tempId = 'temp_' + Date.now()
			const tempMsg = {
				id: tempId,
				sender_id: this.userId,
				sender_name: this.userInfo.username,
				content: '',
				file_path: filePath,
				file_name: fileName,
				file_size: fileSize,
				file_type: fileType,
				video_duration: extraInfo.video_duration,
				video_cover: videoCover,
				audio_duration: extraInfo.audio_duration,
				created_at: new Date().toISOString(),
				status: 'sending'
			}
			
			this.messages.push(tempMsg)
			this.$nextTick(() => {
				this.scrollToBottom()
			})
			
			const fileInfo = {
				file_path: filePath,
				file_name: fileName,
				file_size: fileSize,
				file_type: fileType,
				video_duration: extraInfo.video_duration,
				video_cover: videoCover,
				audio_duration: extraInfo.audio_duration
			}
			
			try {
				let res
				if (this.currentChat.type === 'friend') {
					res = await api.messages.sendFile(this.currentChat.id, fileInfo)
				} else {
					res = await api.groups.sendFile(this.currentChat.id, fileInfo)
				}
				
				const msgIndex = this.messages.findIndex(m => m.id === tempId)
				if (msgIndex > -1) {
					if (res.data && res.data.message_id) {
						this.messages[msgIndex].id = res.data.message_id
					}
					this.messages[msgIndex].status = 'sent'
					if (res.data && res.data.audio_duration != null) {
						this.messages[msgIndex].audio_duration = res.data.audio_duration
					}
				}
			} catch (e) {
				const msgIndex = this.messages.findIndex(m => m.id === tempId)
				if (msgIndex > -1) {
					this.messages[msgIndex].status = 'failed'
				}
				this.showToast(e.message || '发送失败')
			}
		},
		
		async sendFileMessageAfterUpload(tempId, uploadRes, extraInfo = {}) {
			const data = uploadRes.data || uploadRes
			const filePath = data.file_path
			const fileName = data.file_name || '文件'
			const fileSize = data.file_size || 0
			const fileType = data.file_type || 'application/octet-stream'
			const videoCover = data.video_cover || data.cover_path || data.thumbnail
			
			const fileInfo = {
				file_path: filePath,
				file_name: fileName,
				file_size: fileSize,
				file_type: fileType,
				video_duration: extraInfo.video_duration,
				video_cover: videoCover,
				audio_duration: extraInfo.audio_duration
			}
			
			try {
				let res
				if (this.currentChat.type === 'friend') {
					res = await api.messages.sendFile(this.currentChat.id, fileInfo)
				} else {
					res = await api.groups.sendFile(this.currentChat.id, fileInfo)
				}
				
				const msgIndex = this.messages.findIndex(m => m.id === tempId)
				if (msgIndex > -1) {
					if (res.data && res.data.message_id) {
						this.messages[msgIndex].id = res.data.message_id
					}
					this.messages[msgIndex].status = 'sent'
					if (res.data && res.data.audio_duration != null) {
						this.messages[msgIndex].audio_duration = res.data.audio_duration
					}
				}
			} catch (e) {
				const msgIndex = this.messages.findIndex(m => m.id === tempId)
				if (msgIndex > -1) {
					this.messages[msgIndex].status = 'failed'
				}
				this.showToast(e.message || '发送失败')
			}
		},
		
		previewImage(url) {
			// 检查是否是.ico格式图片
			const isIco = url.toLowerCase().includes('.ico')
			
			if (isIco) {
				// 对于.ico格式，使用下载并打开的方式
				uni.downloadFile({
					url: url,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.openDocument({
								filePath: res.tempFilePath,
								success: () => {
									console.log('ICO文件打开成功')
								},
								fail: (err) => {
									console.warn('ICO文件打开失败:', err)
									this.showToast('图片预览失败')
								}
							})
						} else {
							this.showToast('下载失败')
						}
					},
					fail: (err) => {
						console.warn('下载ICO文件失败:', err)
						this.showToast('下载失败')
					}
				})
			} else {
				// 非.ico格式，使用正常的预览方式
				uni.previewImage({
					urls: [url],
					current: url,
					success: () => {
						console.log('图片预览成功')
					},
					fail: (err) => {
						console.warn('图片预览失败:', err)
						this.showToast('图片预览失败')
					}
				})
			}
		},
		
		isImageMessage(msg) {
			if (!msg) return false
			if (msg.file_type?.startsWith('image/')) return true
			if (msg.file_path) {
				const lowerPath = msg.file_path.toLowerCase()
				return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.ico'].some(ext => lowerPath.includes(ext))
			}
			return false
		},
		
		isFileMessage(msg) {
			if (!msg) return false
			const hasFilePath = msg.file_path && msg.file_path.toString().trim() !== ''
			if (!hasFilePath) return false
			if (this.isImageMessage(msg)) return false
			if (this.isVideoMessage(msg)) return false
			return true
		},
		
		isVideoMessage(msg) {
            if (!msg) return false
            if (msg.file_type?.startsWith('video/')) {
                if (msg.file_type === 'video/webm') {
                    if (msg.audio_duration && !msg.video_duration) {
                        return false
                    }
                }
                return true
            }
            if (msg.file_path) {
                const lowerPath = msg.file_path.toLowerCase()
                if (lowerPath.includes('.webm')) {
                    if (msg.audio_duration && !msg.video_duration) {
                        return false
                    }
                }
                const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.m4v']
                return videoExts.some(ext => lowerPath.includes(ext))
            }
            return false
        },
		
		getVideoUrl(msg) {
			if (msg.file_path) {
				return this.getImageUrl(msg.file_path)
			}
			return ''
		},
		
		getVideoCover(msg) {
			const coverPath = msg.video_cover || msg.cover_path || msg.thumbnail
			if (coverPath && !msg.videoCoverFailed) {
				const url = this.getImageUrl(coverPath)
				if (url) return url
			}
			// 无封面或加载失败时用占位图（SVG 在小程序等环境可能不显示）
			return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGD4z0AMAANRAag2W98AAAAASUVORK5CYII='
		},
		
		handleVideoError(msg) {
			console.error('视频加载失败:', msg.file_path)
			msg.videoPlaying = false
			this.showToast('文件已被清理')
		},
		
		handleVideoCoverError(msg) {
			msg.videoCoverFailed = true
		},
		
		async playVideo(msg) {
			const videoUrl = this.getVideoUrl(msg)
			if (!videoUrl || msg.videoLoadFailed) {
				this.showToast('视频已被清理')
				this.$set(msg, 'videoCoverFailed', true)
				this.$set(msg, 'videoLoadFailed', true)
				return
			}
			
			this.currentPlayingVideo = msg
			this.videoPlayerSrc = videoUrl
			this.videoPlayerVisible = true
			
			videoCache.preloadVideo(videoUrl)
		},
		
		closeVideoPlayer() {
			this.videoPlayerVisible = false
			this.videoPlayerSrc = ''
			this.currentPlayingVideo = null
		},
		
		handleVideoPlayerError(e) {
			console.error('视频播放器错误:', e)
			this.showToast('视频播放失败')
			this.closeVideoPlayer()
		},
		
		formatVideoDuration(seconds) {
			if (!seconds) return '0:00'
			const mins = Math.floor(seconds / 60)
			const secs = Math.floor(seconds % 60)
			return `${mins}:${secs.toString().padStart(2, '0')}`
		},
		
		getMessageImageUrl(msg) {
			let url = ''
			if (msg.file_path) {
				url = this.getImageUrl(msg.file_path)
			} else if (msg.content) {
				url = this.getImageUrl(msg.content)
			}
			if (!url) return ''
			// 重试时加时间戳避免缓存导致再次失败
			if (msg._imageRetryKey) {
				url += (url.indexOf('?') !== -1 ? '&' : '?') + 't=' + msg._imageRetryKey
			}
			return url
		},
		
		getImageUrl(url) {
			if (!url) return ''
			if (url.startsWith('http://') || url.startsWith('https://')) return url
			if (url.startsWith('data:')) return url
			const path = url.replace(/^\.\//, '').replace(/^\//, '')
			if (!path) return ''
			const apiUrl = getApiBaseUrl()
			const sep = apiUrl.includes('?') ? '&' : '?'
			return apiUrl + sep + 'resource=file&action=get&path=' + encodeURIComponent(path)
		},
		
		formatFileSize(bytes) {
			if (!bytes) return '0 B'
			const units = ['B', 'KB', 'MB', 'GB']
			const i = Math.floor(Math.log(bytes) / Math.log(1024))
			return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
		},
		
		handleImageError(msg) {
			console.error('图片加载失败:', msg.file_path || msg.content)
			this.$set(msg, 'imageLoadFailed', true)
			this.$set(msg, 'imageLoaded', false)
			const retryCount = msg._imageErrorRetryCount || 0
			if (retryCount < 1) {
				msg._imageErrorRetryCount = 1
				setTimeout(() => {
					if (this.messages.some(m => m.id === msg.id)) {
						this.retryLoadImage(msg)
					}
				}, 1500)
			}
		},
		
		handleImageLoad(msg) {
			this.$set(msg, 'imageLoaded', true)
			this.$set(msg, 'imageLoadFailed', false)
		},

		retryLoadImage(msg) {
			this.$set(msg, 'imageLoadFailed', false)
			this.$set(msg, 'imageLoaded', false)
			this.$set(msg, '_imageRetryKey', Date.now())
			this.$forceUpdate()
		},
		
		downloadFile(msg) {
			const url = this.getImageUrl(msg.file_path)
			if (!url) {
				this.showToast('文件已被清理')
				this.$set(msg, 'fileLoadFailed', true)
				return
			}
			
			// 检查是否为 APK 文件
			const fileName = msg.file_name || msg.file_path
			const isApk = fileName.toLowerCase().endsWith('.apk')
			
			if (isApk) {
				// 显示 APK 文件警告弹窗
				uni.showModal({
					title: '安装包文件',
					content: '此类文件为安装包，若您不清楚其功能或来源未知不推荐您下载，若要下载请点击继续',
					confirmText: '继续',
					cancelText: '关闭',
					showCancel: true,
					success: (res) => {
						if (res.confirm) {
							// 下载 APK 文件
							this.downloadApkFile(msg, url)
						}
					}
				})
			} else {
				// 普通文件下载
				this.downloadRegularFile(msg, url)
			}
		},
		
		downloadApkFile(msg, url) {
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						// 保存文件到系统下载目录
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: (saveRes) => {
								// 显示安装提示
								uni.showModal({
									title: '安装提示',
									content: '您要安装此应用，由于来源未知，如果需要请到文件管理中Download目录安装，由外部应用导致的一系列问题我们不负任何责任',
									confirmText: '确定',
									cancelText: '关闭',
									showCancel: true,
									success: (confirmRes) => {
										if (confirmRes.confirm) {
											// 打开文件管理
											this.openFileManager()
										}
									}
								})
							},
							fail: () => {
								this.showToast('保存失败')
							}
						})
					}
				},
				fail: () => {
					this.showToast('下载失败')
				}
			})
		},
		
		downloadRegularFile(msg, url) {
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						// 默认只在缓存中打开文件，不保存到系统目录
						uni.openDocument({
							filePath: res.tempFilePath,
							success: () => {
								this.showToast('文件已打开')
							},
							fail: (err) => {
								console.warn('打开文件失败:', err)
								this.showToast('打开文件失败')
							}
						})
					}
				},
				fail: () => {
					this.showToast('下载失败')
				}
			})
		},
		
		saveFileToDownload(msg) {
			const url = this.getImageUrl(msg.file_path)
			if (!url) {
				this.showToast('文件已被清理')
				return
			}
			
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						// 保存文件到系统下载目录
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: (saveRes) => {
								this.showToast('文件已保存到下载目录')
							},
							fail: () => {
								this.showToast('保存失败')
							}
						})
					}
				},
				fail: () => {
					this.showToast('下载失败')
				}
			})
		},
		
		openFileManager() {
			// #ifdef APP-PLUS
			// 在App端打开文件管理
			plus.runtime.openURL('file:///storage/emulated/0/Download', {}, (err) => {
				console.error('打开文件管理失败:', err)
				this.showToast('打开文件管理失败')
			})
			// #endif
			// #ifdef H5
			this.showToast('请手动打开文件管理')
			// #endif
		},
		
		showFileOptions(msg) {
			// 检查是否为 APK 文件
			const fileName = msg.file_name || msg.file_path
			const isApk = fileName.toLowerCase().endsWith('.apk')
			
			if (isApk) {
				// APK 文件的选项
				uni.showActionSheet({
					itemList: ['保存到下载目录', '打开文件管理'],
					itemColor: '#12b7f5',
					success: (res) => {
						if (res.tapIndex === 0) {
							// 保存 APK 到下载目录
							this.downloadApkFile(msg, this.getImageUrl(msg.file_path))
						} else if (res.tapIndex === 1) {
							// 打开文件管理
							this.openFileManager()
						}
					}
				})
			} else {
				// 普通文件的选项
				uni.showActionSheet({
					itemList: ['保存到下载目录'],
					itemColor: '#12b7f5',
					success: (res) => {
						if (res.tapIndex === 0) {
							// 保存文件到下载目录
							this.saveFileToDownload(msg)
						}
					}
				})
			}
		},
		
		showAudioOptions(msg) {
			// 语音消息的选项
			uni.showActionSheet({
				itemList: ['保存到下载目录'],
				itemColor: '#12b7f5',
				success: (res) => {
					if (res.tapIndex === 0) {
						// 保存语音到下载目录
						this.saveAudioToDownload(msg)
					}
				}
			})
		},
		
		saveAudioToDownload(msg) {
			const audioUrl = this.getImageUrl(msg.file_path)
			if (!audioUrl) {
				this.showToast('语音已被清理')
				return
			}
			
			uni.downloadFile({
				url: audioUrl,
				success: (res) => {
					if (res.statusCode === 200) {
						// 保存文件到系统下载目录
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: (saveRes) => {
								this.showToast('语音已保存到下载目录')
							},
							fail: () => {
								this.showToast('保存失败')
							}
						})
					}
				},
				fail: () => {
					this.showToast('下载失败')
				}
			})
		},
		
		showImageOptions(msg) {
			// 图片消息的选项
			uni.showActionSheet({
				itemList: ['保存到相册'],
				itemColor: '#12b7f5',
				success: (res) => {
					if (res.tapIndex === 0) {
						// 保存图片到系统相册
						this.saveImageToAlbum(msg)
					}
				}
			})
		},
		
		saveImageToAlbum(msg) {
			const imageUrl = this.getMessageImageUrl(msg)
			if (!imageUrl) {
				this.showToast('图片已被清理')
				return
			}
			
			uni.downloadFile({
				url: imageUrl,
				success: (res) => {
					if (res.statusCode === 200) {
						// 保存图片到系统相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.showToast('图片已保存到相册')
							},
							fail: (err) => {
								console.error('保存图片失败:', err)
								this.showToast('保存失败')
							}
						})
					}
				},
				fail: () => {
					this.showToast('下载失败')
				}
			})
		},
		
		scrollToBottom() {
			this.scrollTop = 999999
		},
		
		formatTime(time) {
			if (!time) return ''
			const date = new Date(time)
			const now = new Date()
			const isToday = date.toDateString() === now.toDateString()
			const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString()
			
			if (isToday) {
				// 今天显示时间
				return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
			} else if (isYesterday) {
				// 昨天显示"昨天"
				return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
			} else {
				// 其他日期显示年-月-日
				return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
			}
		},
		
		escapeHtml(text) {
			if (!text) return ''
			// 先进行基本的 HTML 转义
			return text
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;')
		},
		
		parseMessageContent(text) {
			if (!text) return [{ type: 'text', content: '' }]
			
			// 识别 HTTP/HTTPS 链接
			const urlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=.]+)/g
			const parts = []
			let lastIndex = 0
			
			let match
			while ((match = urlRegex.exec(text)) !== null) {
				// 添加链接前的普通文本
				if (match.index > lastIndex) {
					parts.push({
						type: 'text',
						content: text.substring(lastIndex, match.index)
					})
				}
				
				// 添加链接
				parts.push({
					type: 'link',
					content: match[0]
				})
				
				lastIndex = match.index + match[0].length
			}
			
			// 添加剩余的普通文本
			if (lastIndex < text.length) {
				parts.push({
					type: 'text',
					content: text.substring(lastIndex)
				})
			}
			
			return parts
		},
		
		async searchUser() {
			if (!this.searchKeyword.trim()) return
			
			try {
				const res = await api.user.search(this.searchKeyword.trim())
				this.searchResults = res.data || []
				if (this.searchResults.length === 0) {
					this.showToast('未找到用户')
				}
			} catch (e) {
				this.handleError(e, '搜索失败')
			}
		},
		
		async sendFriendRequest(friendId) {
			try {
				await api.friends.sendRequest(friendId)
				this.showToast('好友请求已发送')
				this.searchResults = this.searchResults.filter(u => u.id !== friendId)
			} catch (e) {
				this.showToast(e.message || '发送失败')
			}
		},
		
		async acceptRequest(requestId) {
			try {
				await api.friends.acceptRequest(requestId)
				this.showToast('已添加好友')
				this.friendRequests = this.friendRequests.filter(r => (r.request_id || r.id) !== requestId)
				this.friendRequestsCount = this.friendRequests.length
				this.loadFriends()
			} catch (e) {
				this.showToast(e.message || '操作失败')
			}
		},
		
		async rejectRequest(requestId) {
			try {
				await api.friends.rejectRequest(requestId)
				this.showToast('已拒绝')
				this.friendRequests = this.friendRequests.filter(r => (r.request_id || r.id) !== requestId)
				this.friendRequestsCount = this.friendRequests.length
			} catch (e) {
				this.showToast(e.message || '操作失败')
			}
		},
		
		async createGroup() {
			if (!this.newGroupName.trim()) {
				this.showToast('请输入群名称')
				return
			}
			
			try {
				await api.groups.create(this.newGroupName.trim())
				this.showToast('群聊创建成功')
				this.showCreateGroup = false
				this.newGroupName = ''
				this.loadGroups()
			} catch (e) {
				this.handleError(e, '创建失败')
			}
		},
		
		startRefresh() {
		this.stopRefresh()
		
		// 设置消息检查间隔：前台10秒，后台30秒
		this.refreshTimer = setInterval(() => {
			if (!this.isInBackground) {
				// 前台：10秒检查一次
				this.loadData(false)
				if (this.currentChat) {
					this.checkNewMessages()
				} else {
					// 当没有打开聊天页面时，检查所有聊天的新消息
					this.checkAllChatsForNewMessages()
				}
			} else {
				// 后台：30秒检查一次，只检查所有聊天的新消息，不加载其他数据
				this.checkAllChatsForNewMessages()
			}
		}, this.isInBackground ? 30000 : 10000) // 前台10秒，后台30秒
		
		this.friendRequestTimer = setInterval(() => {
			if (!this.isInBackground) {
				this.loadFriendRequests()
			}
		}, 120000) // 2分钟
		
		// 每5分钟检查一次强制更新
		this.forceUpdateTimer = setInterval(() => {
			if (!this.isInBackground) {
				this.checkForceUpdate()
			}
		}, 300000) // 5分钟
	},
	
	stopRefresh() {
		if (this.refreshTimer) {
			clearInterval(this.refreshTimer)
			this.refreshTimer = null
		}
		if (this.friendRequestTimer) {
			clearInterval(this.friendRequestTimer)
			this.friendRequestTimer = null
		}
		if (this.forceUpdateTimer) {
			clearInterval(this.forceUpdateTimer)
			this.forceUpdateTimer = null
		}
		if (this.backgroundRefreshTimer) {
			clearInterval(this.backgroundRefreshTimer)
			this.backgroundRefreshTimer = null
		}
	},
	
	startBackgroundRefresh() {
		// 停止可能存在的后台定时器
		if (this.backgroundRefreshTimer) {
			clearInterval(this.backgroundRefreshTimer)
		}
		
		// 启动后台消息检查，每15秒一次
		this.backgroundRefreshTimer = setInterval(() => {
			// 只在应用在后台时检查
			if (this.isInBackground) {
				// 后台只检查所有聊天的新消息，不加载其他数据
				this.checkAllChatsForNewMessages()
			}
		}, 15000) // 15秒
	},
	
	handleLinkClick(url) {
		console.log('链接点击事件被触发:', url)
		// 显示链接确认弹窗
		uni.showModal({
			title: '访问外部链接',
			content: `您将要访问外部链接，请仔细辨别，若因外部链接导致的一系列问题，我们将不负任何责任。您要访问的链接是：${url}`,
			confirmText: '确定',
			cancelText: '关闭',
			showCancel: true,
			success: (res) => {
				console.log('弹窗点击结果:', res)
				if (res.confirm) {
					// 打开链接
					console.log('用户确认打开链接:', url)
					// #ifdef APP-PLUS
					// 在App端使用外部浏览器打开
					plus.runtime.openURL(url, {
						openExternal: true
					}, (err) => {
						this.showToast('打开链接失败')
						console.error('打开链接失败:', err)
					})
					// #endif
					// #ifdef H5
					// 在H5端使用默认方式打开
					uni.openURL({
						url: url,
						success: () => {
							console.log('链接打开成功')
						},
						fail: (err) => {
							this.showToast('打开链接失败')
							console.error('打开链接失败:', err)
						}
					})
					// #endif
				}
			}
		})
	},
	
	handleOpenFriendRequests() {
		// 打开好友申请页面
		this.showFriendRequests = true
	},
	
	handleOpenChat(chatType, chatId) {
		// 打开指定聊天
		if (chatType === 'friend') {
			// 查找好友
			const friend = this.friends.find(f => f.id === chatId)
			if (friend) {
				this.openChat('friend', friend)
			}
		} else if (chatType === 'group') {
			// 查找群聊
			const group = this.groups.find(g => g.id === chatId)
			if (group) {
				this.openChat('group', group)
			}
		}
	},
		
		async loadGroupMembers(groupId) {
			try {
				const res = await api.groups.members(groupId)
				this.groupMembers = res.data || []
			} catch (e) {
				this.handleError(e, '加载群成员失败')
			}
		},
		
		async showInviteMembersDialog() {
			this.selectedFriends = []
			await this.loadAvailableFriends()
			this.showInviteMembers = true
		},
		
		async loadAvailableFriends() {
			try {
				const friendsRes = await api.friends.list()
				const allFriends = friendsRes.data || []
				
				if (this.currentChat && this.currentChat.type === 'group') {
					await this.loadGroupMembers(this.currentChat.id)
				}
				
				const groupMemberIds = new Set(this.groupMembers.map(m => m.id))
				this.availableFriends = allFriends.filter(friend => !groupMemberIds.has(friend.id))
			} catch (e) {
				this.handleError(e, '加载可邀请好友失败')
				this.availableFriends = []
			}
		},
		
		toggleFriendSelection(friendId) {
			const index = this.selectedFriends.indexOf(friendId)
			if (index > -1) {
				this.selectedFriends.splice(index, 1)
			} else {
				this.selectedFriends.push(friendId)
			}
		},
		
		async inviteFriends() {
			if (this.selectedFriends.length === 0) return
			if (!this.currentChat || this.currentChat.type !== 'group') return
			
			try {
				await api.groups.addMembers(this.currentChat.id, this.selectedFriends)
				this.showToast('邀请成功')
				this.showInviteMembers = false
				await this.loadGroupMembers(this.currentChat.id)
			} catch (e) {
				this.handleError(e, '邀请失败')
			}
		},
		
		async leaveGroup() {
			if (!this.currentChat || this.currentChat.type !== 'group') return
			
			uni.showModal({
				title: '退出群聊',
				content: '确定要退出这个群聊吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await api.groups.leave(this.currentChat.id)
							this.showToast('已退出群聊')
							this.showChatInfo = false
							this.closeChat()
							this.loadGroups()
						} catch (e) {
							this.handleError(e, '退出失败')
						}
					}
				}
			})
		},
		
		async changeAvatar() {
			try {
				const res = await uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera']
				})
				
				const tempFilePath = res.tempFilePaths[0]
				const fileName = tempFilePath.split('/').pop()
				if (this.isDangerousFileType(fileName)) {
					uni.showToast({ title: '禁止上传危险文件类型', icon: 'none' })
					return
				}
				console.log('选择的图片路径:', tempFilePath)
				
				const fileInfo = await new Promise((resolve, reject) => {
					uni.getFileInfo({
						filePath: tempFilePath,
						success: resolve,
						fail: reject
					})
				})
				
				console.log('图片大小:', fileInfo.size, 'bytes')
				
				if (fileInfo.size > 2 * 1024 * 1024) {
					uni.showToast({ title: '图片大小不能超过 2MB', icon: 'none' })
					return
				}
				
				uni.showLoading({ title: '上传中...', mask: true })
				
				try {
					const uploadRes = await api.user.uploadAvatar(tempFilePath)
					
					uni.hideLoading()
					
					console.log('上传响应:', uploadRes)
					
					let avatarUrl = ''
					if (uploadRes.data && uploadRes.data.avatar_url) {
						avatarUrl = uploadRes.data.avatar_url
					} else if (uploadRes.data) {
						avatarUrl = uploadRes.data
					}
					
					if (avatarUrl) {
						const newUserInfo = {
							...this.userInfo,
							avatar: avatarUrl
						}
						
						uni.setStorageSync('userInfo', newUserInfo)
						this.userInfo = newUserInfo
						
						if (this.$store && this.$store.state && this.$store.state.user) {
							this.$store.dispatch('updateUserInfo', { avatar: avatarUrl })
						}
						
						uni.showToast({ title: '头像更新成功', icon: 'success' })
					} else {
						uni.showToast({ title: '头像更新成功', icon: 'success' })
					}
				} catch (uploadErr) {
					uni.hideLoading()
					console.error('上传错误详情:', uploadErr)
					
					let errorMsg = '上传失败'
					if (uploadErr && uploadErr.message) {
						errorMsg = uploadErr.message
					} else if (uploadErr && typeof uploadErr === 'string') {
						errorMsg = uploadErr
					}
					
					uni.showModal({
						title: '上传失败',
						content: errorMsg + '，请确保已登录且网络正常',
						showCancel: false
					})
				}
			} catch (err) {
				console.error('选择图片错误:', err)
				if (err.message !== 'cancel' && err.errMsg !== 'cancel') {
					uni.showToast({ title: err.message || '操作失败', icon: 'none' })
				}
			}
		},
		
		async handleLogout() {
			try {
				await api.auth.logout()
			} catch (e) {
				console.log('logout error:', e)
			}
			
			clearUserInfo()
			
			uni.redirectTo({
				url: '/pages/login/login'
			})
		},
		
		openScanLogin() {
			this.showProfileDrawer = false
			
			uni.showActionSheet({
				itemList: ['普通扫描', '拍照扫描(适合黑底二维码)'],
				success: (res) => {
					if (res.tapIndex === 0) {
						this.startNativeScan()
					} else if (res.tapIndex === 1) {
						this.startPhotoScan()
					}
				}
			})
		},
		
		startNativeScan() {
			uni.scanCode({
				scanType: ['qrCode'],
				success: async (res) => {
					this.handleScanResult(res.result)
				},
				fail: (err) => {
					if (err.errMsg && !err.errMsg.includes('cancel')) {
						this.showToast('扫码失败，请重试')
					}
				}
			})
		},
		
		startPhotoScan() {
			// #ifdef APP-PLUS
			const cmr = plus.camera.getCamera()
			cmr.captureImage((path) => {
				this.processPhotoAndScan(path)
			}, (error) => {
				console.log('拍照失败:', error)
				this.showToast('拍照失败，请重试')
			}, {
				filename: '_doc/',
				index: 1,
				resolution: 'medium'
			})
			// #endif
			
			// #ifndef APP-PLUS
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],
				success: (res) => {
					this.processPhotoAndScan(res.tempFilePaths[0])
				},
				fail: () => {
					this.showToast('拍照失败，请重试')
				}
			})
			// #endif
		},
		
		async processPhotoAndScan(imagePath) {
			uni.showLoading({ title: '正在识别...' })
			
			try {
				console.log('开始处理图片:', imagePath)
				
				// #ifdef APP-PLUS
				const result = await this.processPhotoWithPlus(imagePath)
				if (result) {
					this.handleScanResult(result)
				} else {
					this.showToast('未识别到二维码，请重试')
				}
				uni.hideLoading()
				return
				// #endif
				
				// #ifndef APP-PLUS
				const info = await new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imagePath,
						success: resolve,
						fail: reject
					})
				})
				
				console.log('图片信息:', info.width, 'x', info.height)
				
				const maxSize = 600
				let width = info.width
				let height = info.height
				
				if (width > maxSize || height > maxSize) {
					const ratio = Math.min(maxSize / width, maxSize / height)
					width = Math.floor(width * ratio)
					height = Math.floor(height * ratio)
				}
				
				this.canvasWidth = width
				this.canvasHeight = height
				
				const canvasId = 'photoScanCanvas'
				const ctx = uni.createCanvasContext(canvasId, this)
				
				ctx.drawImage(imagePath, 0, 0, width, height)
				
				await new Promise((resolve, reject) => {
					ctx.draw(false, () => {
						setTimeout(resolve, 200)
					})
				})
				
				const imageData = await new Promise((resolve, reject) => {
					uni.canvasGetImageData({
						canvasId: canvasId,
						x: 0,
						y: 0,
						width: width,
						height: height,
						success: resolve,
						fail: reject
					}, this)
				})
				
				const code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: 'attemptBoth'
				})
				
				uni.hideLoading()
				
				if (code && code.data) {
					this.handleScanResult(code.data)
				} else {
					this.showToast('未识别到二维码，请重试')
				}
				// #endif
			} catch (e) {
				uni.hideLoading()
				console.error('识别失败:', e)
				this.showToast('识别失败: ' + (e.message || e.errMsg || '未知错误'))
			}
		},
		
		// #ifdef APP-PLUS
		processPhotoWithPlus(imagePath) {
			return new Promise((resolve, reject) => {
				console.log('使用 Plus Barcode 扫描图片:', imagePath)
				
				plus.barcode.scan(imagePath, (type, result) => {
					console.log('扫描成功:', type, result)
					resolve(result)
				}, (err) => {
					console.log('Plus Barcode 扫描失败，尝试 canvas 方式:', err)
					this.processImageWithCanvas(imagePath, resolve, reject)
				}, [plus.barcode.QR])
			})
		},
		
		processImageWithCanvas(imagePath, resolve, reject) {
			uni.getImageInfo({
				src: imagePath,
				success: (info) => {
					console.log('图片信息:', info.width, 'x', info.height)
					
					const maxSize = 400
					let width = info.width
					let height = info.height
					
					if (width > maxSize || height > maxSize) {
						const ratio = Math.min(maxSize / width, maxSize / height)
						width = Math.floor(width * ratio)
						height = Math.floor(height * ratio)
					}
					
					this.canvasWidth = width
					this.canvasHeight = height
					
					const ctx = uni.createCanvasContext('photoScanCanvas', this)
					ctx.drawImage(imagePath, 0, 0, width, height)
					
					ctx.draw(false, () => {
						setTimeout(() => {
							uni.canvasGetImageData({
								canvasId: 'photoScanCanvas',
								x: 0,
								y: 0,
								width: width,
								height: height,
								success: (imageData) => {
									console.log('获取图像数据成功')
									
									const code = jsQR(imageData.data, imageData.width, imageData.height, {
										inversionAttempts: 'attemptBoth'
									})
									
									if (code && code.data) {
										console.log('识别成功:', code.data)
										resolve(code.data)
									} else {
										console.log('未识别到二维码')
										resolve(null)
									}
								},
								fail: (err) => {
									console.log('获取图像数据失败:', err)
									reject(new Error('获取图像数据失败'))
								}
							}, this)
						}, 300)
					})
				},
				fail: (err) => {
					console.log('获取图片信息失败:', err)
					reject(new Error('获取图片信息失败'))
				}
			})
		},
		// #endif
		
		async handleScanResult(url) {
			console.log('扫码结果:', url)
			
			url = String(url || '').trim()
			
			if (!url) {
				this.showToast('未识别到二维码内容')
				return
			}
			
			console.log('扫码URL:', url)
			console.log('包含scan_login:', url.includes('scan_login'))
			console.log('包含qid:', url.includes('qid='))
			
			if (!url.includes('scan_login') || !url.includes('qid=')) {
				this.showToast('请扫描网页端的登录二维码')
				return
			}
			
			let qid = ''
			try {
				const urlObj = new URL(url)
				qid = urlObj.searchParams.get('qid') || ''
				console.log('URL解析成功，qid:', qid)
			} catch (e) {
				console.log('URL解析失败:', e)
				const match = url.match(/[?&]qid=([^&\s#]+)/)
				if (match) {
					qid = match[1]
					console.log('正则匹配qid:', qid)
				}
			}
			
			if (!qid) {
				this.showToast('无法解析登录二维码')
				return
			}
			
			console.log('最终 qid:', qid)
			
			this.scanLoginInfo = { qid, ip: '' }
			this.scanLoginLoading = true
			this.scanLoginLoadingText = '正在验证...'
			this.scanLoginError = ''
			this.scanLoginSuccess = false
			this.showScanLogin = true
			
			try {
				console.log('调用 scan API, qid:', qid)
				const scanRes = await api.scanLogin.scan(qid)
				console.log('scan API 响应:', scanRes)
				
				this.scanLoginLoadingText = '获取登录信息...'
				console.log('调用 getIp API, qid:', qid)
				const ipRes = await api.scanLogin.getIp(qid)
				console.log('getIp API 响应:', ipRes)
				this.scanLoginInfo.ip = ipRes.data?.ip_address || '未知'
				console.log('登录IP:', this.scanLoginInfo.ip)
				
				this.scanLoginLoading = false
			} catch (e) {
				console.error('扫码登录失败:', e)
				this.scanLoginLoading = false
				this.scanLoginError = e.message || '验证失败，请重试'
			}
		},
		
		async confirmScanLogin() {
			if (!this.scanLoginInfo || !this.scanLoginInfo.qid) return
			
			let vkey = uni.getStorageSync('vkey')
			
			const userId = this.userInfo && typeof this.userInfo === 'object' ? parseInt(this.userInfo.id, 10) : null
			
			if (!vkey && userId && !isNaN(userId)) {
				try {
					const vkeyRes = await api.vkey.generate(userId)
					if (vkeyRes.success && vkeyRes.data && vkeyRes.data.vkey) {
						vkey = vkeyRes.data.vkey
						uni.setStorageSync('vkey', vkey)
					}
				} catch (e) {
					console.log('获取vkey失败:', e)
				}
			}
			
			if (!vkey) {
				this.scanLoginError = '无法获取用户认证信息，请重试'
				return
			}
			
			this.scanLoginLoading = true
			this.scanLoginLoadingText = '确认登录中...'
			this.scanLoginError = ''
			
			try {
				await api.scanLogin.confirm(this.scanLoginInfo.qid, vkey)
				this.scanLoginLoading = false
				this.scanLoginSuccess = true
				this.scanLoginInfo = null
				
				setTimeout(() => {
					this.showScanLogin = false
					this.scanLoginSuccess = false
				}, 1500)
			} catch (e) {
				this.scanLoginLoading = false
				this.scanLoginError = e.message || '确认失败，请重试'
			}
		},
		
		async rejectScanLogin() {
			if (!this.scanLoginInfo || !this.scanLoginInfo.qid) return
			
			try {
				await api.scanLogin.reject(this.scanLoginInfo.qid)
			} catch (e) {
				console.log('reject error:', e)
			}
			
			this.showScanLogin = false
			this.scanLoginInfo = null
			this.scanLoginError = ''
			this.scanLoginSuccess = false
		},
		
		retryScanLogin() {
			this.scanLoginError = ''
			this.openScanLogin()
		},
		
		getAvatarUrl(avatar) {
			console.log('getAvatarUrl 输入:', avatar, '类型:', typeof avatar)
			if (!avatar) {
				console.log('getAvatarUrl: avatar 为空')
				return ''
			}
			if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
				console.log('getAvatarUrl: 完整URL:', avatar)
				return avatar
			}
			if (avatar.startsWith('data:')) {
				console.log('getAvatarUrl: base64数据')
				return avatar
			}
			const path = avatar.replace(/^\.\//, '').replace(/^\//, '')
			if (!path) {
				console.log('getAvatarUrl: 路径为空')
				return ''
			}
			const apiUrl = getApiBaseUrl()
			const sep = apiUrl.includes('?') ? '&' : '?'
			const result = apiUrl + sep + 'resource=file&action=get&path=' + encodeURIComponent(path)
			console.log('getAvatarUrl 结果:', result)
			return result
		},
		
		handleAvatarError() {
			console.error('头像加载失败')
			// 头像加载失败时，清空avatar字段，显示默认头像
			if (this.userInfo && this.userInfo.avatar) {
				this.$set(this.userInfo, 'avatar', '')
				uni.setStorageSync('userInfo', this.userInfo)
			}
		},
		
		async fetchUserInfo() {
			try {
				const res = await api.user.getInfo()
				console.log('获取用户信息完整响应:', JSON.stringify(res))
				if (res.success) {
					const userData = res.data || res
					this.userInfo = {
						...this.userInfo,
						...userData
					}
					console.log('更新后的用户信息:', JSON.stringify(this.userInfo))
					uni.setStorageSync('userInfo', this.userInfo)
				}
			} catch (e) {
				console.log('获取用户信息失败:', e)
			}
		},
		
		onMessageTouchStart(e, msg, index) {
			this.clearLongPressTimer()
			if (msg.recalled) return
			this.longPressTimer = setTimeout(() => {
				this.longPressTimer = null
				this.selectedMessage = msg
				this.selectedMessageIndex = index
				this.showMessageMenu = true
			}, 800)
		},
		onMessageTouchEnd() {
			this.clearLongPressTimer()
		},
		clearLongPressTimer() {
			if (this.longPressTimer) {
				clearTimeout(this.longPressTimer)
				this.longPressTimer = null
			}
		},
		closeMessageMenu() {
			this.showMessageMenu = false
			this.selectedMessage = null
			this.selectedMessageIndex = -1
		},
		onProfileDrawerTouchStart(e) {
			if (e.touches && e.touches[0]) this.profileDrawerTouchStartX = e.touches[0].clientX
		},
		onProfileDrawerTouchEnd(e) {
			if (!e.changedTouches || !e.changedTouches[0]) return
			const endX = e.changedTouches[0].clientX
			const delta = endX - this.profileDrawerTouchStartX
			if (delta > 60) this.showProfileDrawer = true
		},
		async fetchVersionInfo() {
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
			if (err || !res || res.statusCode !== 200) return null
			const raw = res.data
			return raw && typeof raw === 'object' ? raw : (typeof raw === 'string' ? (() => { try { return JSON.parse(raw) } catch (_) { return null } })() : null)
		},
		showForceUpdateDialog(data) {
			const url = data.downloadUrl || data.download_url || ''
			const content = (data.forceNote || data.note || data.releaseNote || '当前版本已停止维护，请更新后继续使用。') + '\n\n当前版本：' + APP_VERSION + (data.version ? '\n最新版本：' + data.version : '')
			uni.showModal({
				title: '请更新到最新版本',
				content: content,
				showCancel: false,
				confirmText: '立即更新',
				success: (r) => {
					if (r.confirm) {
						if (url) this.downloadAndInstallApk(url)
						else uni.showToast({ title: '暂无下载地址，请稍后再试', icon: 'none' })
					}
				}
			})
		},
		async checkForceUpdate() {
			try {
				const data = await this.fetchVersionInfo()
				if (!data) return
				const minCode = parseInt(data.minVersionCode ?? data.min_version_code ?? '', 10)
				if (isNaN(minCode) || minCode <= 0) return
				if (APP_VERSION_CODE < minCode) this.showForceUpdateDialog(data)
			} catch (e) {}
		},
		async checkUpdate() {
			uni.showLoading({ title: '正在检查更新...', mask: true })
			try {
				const data = await this.fetchVersionInfo()
				uni.hideLoading()
				if (!data) {
					uni.showModal({
						title: '检查更新',
						content: '无法获取版本信息，请检查网络连接后重试。',
						showCancel: false
					})
					return
				}
				const remoteCode = parseInt(data.versionCode || data.version_code || '0', 10)
				const localCode = APP_VERSION_CODE
				const minCode = parseInt(data.minVersionCode ?? data.min_version_code ?? '', 10)
				if (!isNaN(minCode) && minCode > 0 && localCode < minCode) {
					this.showForceUpdateDialog(data)
					return
				}
				if (remoteCode > localCode && (data.downloadUrl || data.download_url)) {
					const content = (data.note || data.releaseNote || data.release_note || '发现新版本，是否立即下载并安装？') + '\n\n当前版本：' + APP_VERSION + (data.version ? '\n最新版本：' + data.version : '')
					uni.showModal({
						title: '发现新版本',
						content: content,
						confirmText: '立即更新',
						success: (r) => {
							if (r.confirm && (data.downloadUrl || data.download_url)) {
								const url = data.downloadUrl || data.download_url
								this.downloadAndInstallApk(url)
							}
						}
					})
				} else {
					uni.showModal({
						title: '检查更新',
						content: '当前已是最新版本 ' + APP_VERSION,
						showCancel: false
					})
				}
			} catch (e) {
				uni.hideLoading()
				uni.showModal({
					title: '检查更新失败',
					content: '网络请求失败，请稍后重试。',
					showCancel: false
				})
			}
		},
		downloadAndInstallApk(downloadUrl) {
			// #ifdef APP-PLUS
			const vm = this
			vm.showDownloadProgress = true
			vm.downloadProgress = 0
			const task = uni.downloadFile({
				url: downloadUrl,
				success: (res) => {
					vm.showDownloadProgress = false
					if (res.statusCode === 200 && res.tempFilePath) {
						plus.runtime.install(
							res.tempFilePath,
							{ force: true },
							() => {
								vm.showToast('安装已调起，请完成安装')
							},
							(err) => {
								vm.showToast('安装失败，请尝试浏览器下载')
								plus.runtime.openURL(downloadUrl)
							}
						)
					} else {
						vm.showToast('下载失败，改用浏览器打开')
						plus.runtime.openURL(downloadUrl)
					}
				},
				fail: () => {
					vm.showDownloadProgress = false
					vm.showToast('下载失败，改用浏览器打开')
					plus.runtime.openURL(downloadUrl)
				}
			})
			task.onProgressUpdate((res) => {
				const p = res.progress >= 0 && res.progress <= 100 ? res.progress : 0
				vm.downloadProgress = p
			})
			// #endif
			// #ifndef APP-PLUS
			uni.setClipboardData({ data: downloadUrl })
			uni.showToast({ title: '下载地址已复制到剪贴板', icon: 'none' })
			// #endif
		},
		getCopyableText(msg) {
			if (!msg || msg.recalled) return ''
			if (msg.content && typeof msg.content === 'string' && msg.content.trim()) return msg.content.trim()
			if (msg.file_name && typeof msg.file_name === 'string') return msg.file_name
			return ''
		},
		onCopyClick() {
			const msg = this.selectedMessage
			const text = this.getCopyableText(msg)
			this.closeMessageMenu()
			if (!text) {
				this.showToast('该消息无法复制')
				return
			}
			uni.setClipboardData({
				data: text,
				success: () => this.showToast('已复制到剪贴板')
			})
		},
		onRecallClick() {
			const msg = this.selectedMessage
			const index = this.selectedMessageIndex
			this.closeMessageMenu()
			this.recallMessageInBackground(msg, index)
		},
		onDeleteClick() {
			const msg = this.selectedMessage
			const index = this.selectedMessageIndex
			this.closeMessageMenu()
			this.deleteMessageInBackground(msg, index)
		},
		
		canRecallMessage(msg) {
			if (!msg || !msg.created_at || msg.recalled) return false
			if (msg.sender_id != this.userId) return false
			
			const msgTime = new Date(msg.created_at).getTime()
			const now = Date.now()
			const diffMinutes = (now - msgTime) / (1000 * 60)
			
			return diffMinutes <= 2
		},
		
		recallMessageInBackground(msg, index) {
			if (!msg || !this.currentChat) return
			
			const messageId = msg.id
			if (!messageId || messageId.toString().startsWith('temp_')) {
				this.showToast('无法撤回临时消息')
				return
			}
			
			if (!this.canRecallMessage(msg)) {
				this.showToast('消息已超过2分钟，无法撤回')
				return
			}
			
			// 后台执行，不阻塞 UI
			;(async () => {
				try {
					let res
					if (this.currentChat.type === 'friend') {
						res = await api.messages.recall(messageId)
					} else {
						res = await api.groups.recall(messageId)
					}
					
					if (res.success) {
						if (index >= 0 && index < this.messages.length) {
							this.messages[index].recalled = true
						}
						this.showToast('消息已撤回')
					} else {
						this.showToast(res.message || '撤回失败')
					}
				} catch (e) {
					this.handleError(e, '撤回失败')
				}
			})()
		},
		
		deleteMessageInBackground(msg, index) {
			if (!msg || !this.currentChat) return
			
			const messageId = msg.id
			if (!messageId || messageId.toString().startsWith('temp_')) {
				this.showToast('无法删除临时消息')
				return
			}
			
			if (msg.sender_id != this.userId) {
				this.showToast('只能删除自己的消息')
				return
			}
			
			;(async () => {
				try {
					if (this.currentChat.type === 'friend') {
						await api.messages.delete(messageId)
					} else {
						await api.groups.deleteMessage(messageId)
					}
					// 从列表中移除
					if (index >= 0 && index < this.messages.length) {
						this.messages.splice(index, 1)
					}
					this.showToast('消息已删除')
				} catch (e) {
					this.handleError(e, '删除失败')
				}
			})()
		},
		
		initRecorder() {
			this.recorderManager = uni.getRecorderManager()
			
			this.recorderManager.onStart(() => {
				this.isRecording = true
				this.recordingTime = 0
				this.recordingTimer = setInterval(() => {
					this.recordingTime++
				}, 1000)
			})
			
			this.recorderManager.onStop((res) => {
				this.isRecording = false
				if (this.recordingTimer) {
					clearInterval(this.recordingTimer)
					this.recordingTimer = null
				}
				this.recordFilePath = res.tempFilePath
				
				if (this.recordingTime >= 1) {
					this.sendAudioMessage()
				} else {
					this.showToast('录音时间太短')
				}
			})
			
			this.recorderManager.onError((err) => {
				this.isRecording = false
				if (this.recordingTimer) {
					clearInterval(this.recordingTimer)
					this.recordingTimer = null
				}
				this.showToast('录音失败: ' + err.errMsg)
			})
		},
		
		toggleRecord() {
			if (!this.currentChat) {
				this.showToast('请先选择聊天')
				return
			}
			if (this.isRecording) {
				this.stopRecord()
			} else {
				this.startRecord()
			}
		},
		
		startRecord() {
			if (!this.recorderManager) {
				this.initRecorder()
			}
			if (!this.recorderManager) {
				this.showToast('录音未就绪')
				return
			}
			try {
				this.recorderManager.start({
					duration: 60000,
					sampleRate: 16000,
					numberOfChannels: 1,
					encodeBitRate: 96000,
					format: 'mp3'
				})
				this.showToast('开始录音，再点一下停止并发送')
			} catch (e) {
				this.showToast('无法开始录音')
				uni.showModal({
					title: '需要录音权限',
					content: '请允许使用麦克风权限',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting()
						}
					}
				})
			}
		},
		
		stopRecord() {
			if (this.recorderManager) {
				this.recorderManager.stop()
			}
		},
		
		async sendAudioMessage() {
			if (!this.recordFilePath || !this.currentChat) return
			const fileName = this.recordFilePath.split('/').pop()
			if (this.isDangerousFileType(fileName)) {
				this.showToast('禁止上传危险文件类型')
				return
			}
			const durationSec = Math.max(1, this.recordingTime)
			
			const tempId = 'temp_' + Date.now()
			const tempMsg = {
				id: tempId,
				sender_id: this.userId,
				sender_name: this.userInfo.username,
				content: '',
				file_path: this.recordFilePath,
				file_name: '语音.mp3',
				file_size: 0,
				file_type: 'audio/mpeg',
				audio_duration: durationSec,
				created_at: new Date().toISOString(),
				status: 'uploading',
				uploadProgress: 0
			}
			
			this.messages.push(tempMsg)
			this.$nextTick(() => {
				this.scrollToBottom()
			})
			
			try {
				const uploadTask = uni.uploadFile({
					url: getApiBaseUrl(),
					filePath: this.recordFilePath,
					name: 'file',
					formData: {
						resource: 'upload',
						action: 'file'
					},
					withCredentials: true,
					success: async (uploadRes) => {
						if (uploadRes.statusCode === 200) {
							try {
								const data = JSON.parse(uploadRes.data)
								if (data.success) {
									const msgIndex = this.messages.findIndex(m => m.id === tempId)
									if (msgIndex > -1) {
										this.messages[msgIndex].file_path = data.data?.file_path || data.file_path
										this.messages[msgIndex].file_name = data.data?.file_name || data.file_name || '语音.mp3'
										this.messages[msgIndex].file_size = data.data?.file_size || data.file_size || 0
										this.messages[msgIndex].file_type = data.data?.file_type || data.file_type || 'audio/mpeg'
										this.messages[msgIndex].status = 'sending'
										this.messages[msgIndex].uploadProgress = 100
									}
									
									await this.sendFileMessageAfterUpload(tempId, data, { audio_duration: durationSec })
									
									this.recordFilePath = ''
									this.recordingTime = 0
								} else {
									const msgIndex = this.messages.findIndex(m => m.id === tempId)
									if (msgIndex > -1) {
										this.messages[msgIndex].status = 'failed'
									}
									this.showToast(data.message || '上传失败')
								}
							} catch (e) {
								const msgIndex = this.messages.findIndex(m => m.id === tempId)
								if (msgIndex > -1) {
									this.messages[msgIndex].status = 'failed'
								}
								this.showToast('解析响应失败')
							}
						} else {
							const msgIndex = this.messages.findIndex(m => m.id === tempId)
							if (msgIndex > -1) {
								this.messages[msgIndex].status = 'failed'
							}
							this.showToast('上传失败')
						}
					},
					fail: (err) => {
						const msgIndex = this.messages.findIndex(m => m.id === tempId)
						if (msgIndex > -1) {
							this.messages[msgIndex].status = 'failed'
						}
						this.showToast('上传失败，请检查网络连接')
					}
				})
				
				uploadTask.onProgressUpdate((res) => {
					const msgIndex = this.messages.findIndex(m => m.id === tempId)
					if (msgIndex > -1) {
						this.messages[msgIndex].uploadProgress = res.progress
					}
				})
			} catch (e) {
				const msgIndex = this.messages.findIndex(m => m.id === tempId)
				if (msgIndex > -1) {
					this.messages[msgIndex].status = 'failed'
				}
				this.showToast(e.message || '发送失败')
			}
		},
		
		isAudioMessage(msg) {
            if (!msg) return false
            if (msg.file_type?.startsWith('audio/')) return true
            if (msg.file_path) {
                const lowerPath = msg.file_path.toLowerCase()
                const audioExts = ['.mp3', '.wav', '.aac', '.m4a', '.ogg', '.flac', '.webm']
                if (audioExts.some(ext => lowerPath.includes(ext))) {
                    if (lowerPath.includes('.webm') && msg.video_duration && !msg.audio_duration) {
                        return false
                    }
                    return true
                }
            }
            return false
        },
		
		isPlayingAudio(msg) {
			if (!msg) return false
			const id = msg.id || msg.file_path
			return this.playingAudioId !== null && String(this.playingAudioId) === String(id)
		},
		
		getWaveHeight(index) {
			if (!this.playingAudioId) return 8
			// 波形动画：根据 waveTick 和 index 计算高度，形成流动效果
			const t = this.waveTick * 0.25 + index * 0.4
			return 8 + Math.abs(Math.sin(t)) * 16
		},
		
		formatAudioDuration(seconds) {
			if (!seconds) return '0:00'
			const mins = Math.floor(seconds / 60)
			const secs = Math.floor(seconds % 60)
			return `${mins}:${secs.toString().padStart(2, '0')}`
		},
		
		startWaveAnimation() {
			this.stopWaveAnimation()
			this.audioWaveTimer = setInterval(() => {
				this.waveTick++
			}, 80)
		},
		stopWaveAnimation() {
			if (this.audioWaveTimer) {
				clearInterval(this.audioWaveTimer)
				this.audioWaveTimer = null
			}
		},
		stopAudioPlayback() {
			if (this.currentAudioContext) {
				try {
					this.currentAudioContext.stop()
					this.currentAudioContext.destroy()
				} catch (e) {}
				this.currentAudioContext = null
			}
			this.playingAudioId = null
			this.stopWaveAnimation()
		},
		
		showVideoOptions(msg) {
			uni.showActionSheet({
				itemList: ['保存视频到相册'],
				itemColor: '#12b7f5',
				success: (res) => {
					if (res.tapIndex === 0) {
						this.saveVideoToAlbum(msg)
					}
				}
			})
		},
		
		saveVideoToAlbum(msg) {
			const videoUrl = this.getVideoUrl(msg)
			if (!videoUrl) {
				this.showToast('视频已被清理')
				return
			}
			
			uni.downloadFile({
				url: videoUrl,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveVideoToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.showToast('视频已保存到相册')
							},
							fail: (err) => {
								console.error('保存视频失败:', err)
								this.showToast('保存失败')
							}
						})
					} else {
						this.showToast('下载失败')
					}
				},
				fail: () => {
					this.showToast('下载失败')
				}
			})
		},
		
		playAudio(msg) {
			const id = msg.id || msg.file_path
			if (this.playingAudioId !== null && String(this.playingAudioId) === String(id)) {
				this.stopAudioPlayback()
				return
			}
			
			const url = this.getImageUrl(msg.file_path)
			if (!url) {
				this.showToast('语音已被清理')
				this.$set(msg, 'audioLoadFailed', true)
				return
			}
			
			this.stopAudioPlayback()
			this.playingAudioId = id
			this.startWaveAnimation()
			
			const audioContext = uni.createInnerAudioContext()
			this.currentAudioContext = audioContext
			audioContext.src = url
			audioContext.play()
			
			audioContext.onEnded(() => {
				this.stopAudioPlayback()
				audioContext.destroy()
				this.currentAudioContext = null
			})
			
			audioContext.onError(() => {
				this.showToast('语音已被清理')
				this.stopAudioPlayback()
				this.$set(msg, 'audioLoadFailed', true)
				audioContext.destroy()
				this.currentAudioContext = null
			})
		},
		
		createUploadTask(filePath, fileName, fileSize, fileType) {
			const taskId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
			const task = {
				id: taskId,
				filePath: filePath,
				fileName: fileName || '未知文件',
				fileSize: fileSize || 0,
				fileType: fileType || 'application/octet-stream',
				progress: 0,
				status: 'uploading',
				uploadTask: null,
				error: null
			}
			this.uploadTasks.unshift(task)
			return task
		},
		
		updateUploadTaskProgress(taskId, progress) {
			const task = this.uploadTasks.find(t => t.id === taskId)
			if (task) {
				task.progress = Math.min(100, Math.max(0, progress))
			}
		},
		
		isDangerousFileType(fileName) {
			const dangerousExtensions = [
				'html', 'htm', 'xml', 'php', 'php1', 'php2', 'php3', 'php4', 'php5'
			]
			const extension = fileName.split('.').pop()?.toLowerCase()
			return dangerousExtensions.includes(extension)
		},
		
		updateUploadTaskStatus(taskId, status, error = null) {
			const task = this.uploadTasks.find(t => t.id === taskId)
			if (task) {
				task.status = status
				task.error = error
				if (status === 'completed' || status === 'failed') {
					task.progress = status === 'completed' ? 100 : task.progress
				}
			}
		},
		
		cancelUploadTask(taskId) {
			const task = this.uploadTasks.find(t => t.id === taskId)
			if (task && task.uploadTask) {
				task.uploadTask.abort()
			}
			this.removeUploadTask(taskId)
		},
		
		removeUploadTask(taskId) {
			const index = this.uploadTasks.findIndex(t => t.id === taskId)
			if (index > -1) {
				this.uploadTasks.splice(index, 1)
			}
		},
		
		retryUploadTask(task) {
			this.removeUploadTask(task.id)
		},
		
		cleanupCompletedTasks() {
			const completedTasks = this.uploadTasks.filter(t => t.status === 'completed')
			if (completedTasks.length > 5) {
				const toRemove = completedTasks.slice(0, completedTasks.length - 3)
				toRemove.forEach(t => this.removeUploadTask(t.id))
			}
		},
		
		containsHtmlCode(content) {
			// 检查是否包含HTML标签
			const htmlTagRegex = /<[^>]*>/
			// 检查是否包含HTML实体
			const htmlEntityRegex = /&[a-zA-Z]+;/
			// 检查是否包含JavaScript代码
			const jsRegex = /javascript:/i
			// 检查是否包含CSS代码
			const cssRegex = /<style[^>]*>|<\/style>/
			
			return htmlTagRegex.test(content) || 
			       htmlEntityRegex.test(content) || 
			       jsRegex.test(content) || 
			       cssRegex.test(content)
		},
		
		async uploadFileWithProgress(filePath, fileName, fileSize, fileType) {
			if (this.isDangerousFileType(fileName)) {
				this.showToast('禁止上传危险文件类型')
				return Promise.reject({ message: '禁止上传危险文件类型' })
			}
			const task = this.createUploadTask(filePath, fileName, fileSize, fileType)
			
			return new Promise((resolve, reject) => {
				const uploadTask = uni.uploadFile({
					url: getApiBaseUrl(),
					filePath: filePath,
					name: 'file',
					formData: {
						resource: 'upload',
						action: 'file'
					},
					withCredentials: true,
					success: (res) => {
						if (res.statusCode === 200) {
							try {
								const data = JSON.parse(res.data)
								if (data.success) {
									this.updateUploadTaskStatus(task.id, 'completed')
									resolve(data)
								} else {
									this.updateUploadTaskStatus(task.id, 'failed', data.message || '上传失败')
									reject(data)
								}
							} catch (e) {
								this.updateUploadTaskStatus(task.id, 'failed', '解析响应失败')
								reject({ message: '解析响应失败' })
							}
						} else {
							this.updateUploadTaskStatus(task.id, 'failed', '上传失败')
							reject({ message: '上传失败' })
						}
					},
					fail: (err) => {
						this.updateUploadTaskStatus(task.id, 'failed', '网络错误')
						reject({ message: '上传失败，请检查网络连接' })
					}
				})
				
				task.uploadTask = uploadTask
				
				uploadTask.onProgressUpdate((res) => {
					this.updateUploadTaskProgress(task.id, res.progress)
				})
			})
		}
	}
}
</script>

<style lang="scss">
page {
	height: 100%;
	background: var(--bg-tertiary);
	overflow: hidden;
}

.chat-container.theme-dark .message.received .message-content {
	background: rgba(45, 45, 50, 0.9);
	border: 1rpx solid var(--border-color);
}

.chat-container.theme-dark .message-audio-wrapper,
.chat-container.theme-dark .message-file-wrapper {
	background: var(--bg-tertiary);
	border-color: var(--border-color);
}

.chat-container.theme-dark .toast {
	background: rgba(30, 30, 35, 0.9);
}

.message-video-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 200rpx;
	background: var(--bg-tertiary);
	border-radius: 12rpx;
	border: 1rpx solid var(--border-color);
	
	.error-icon {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 16rpx;
		opacity: 0.6;
	}
	
	.error-text {
		font-size: 24rpx;
		color: var(--text-secondary);
	}
}

.message-audio-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 80rpx;
	background: var(--bg-tertiary);
	border-radius: 12rpx;
	border: 1rpx solid var(--border-color);
	
	.error-icon {
		width: 32rpx;
		height: 32rpx;
		margin-bottom: 8rpx;
		opacity: 0.6;
	}
	
	.error-text {
		font-size: 20rpx;
		color: var(--text-secondary);
	}
}

.message-file-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 120rpx;
	background: var(--bg-tertiary);
	border-radius: 12rpx;
	border: 1rpx solid var(--border-color);
	
	.error-icon {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 12rpx;
		opacity: 0.6;
	}
	
	.error-text {
		font-size: 22rpx;
		color: var(--text-secondary);
	}
}

.chat-container {
	display: flex;
	height: 100vh;
	background: var(--bg-tertiary);
	overflow: hidden;
}

.main-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.profile-drawer-mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.35);
	z-index: 250;
	animation: fadeIn 0.25s ease;
}

.profile-drawer {
	position: fixed;
	left: 0;
	top: 0;
	width: 85%;
	max-width: 360px;
	height: 100vh;
	height: 100dvh;
	background: var(--bg-primary);
	z-index: 260;
	box-shadow: 4rpx 0 24rpx rgba(0, 0, 0, 0.08);
	transform: translateX(-100%);
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	display: flex;
	flex-direction: column;
	
	&.open {
		transform: translateX(0);
	}
}

.profile-drawer-header {
	padding: 32rpx 32rpx 24rpx;
	background: linear-gradient(135deg, var(--primary-color) 0%, #00a2e8 100%);
	flex-shrink: 0;
}

.profile-drawer-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: var(--radius-full);
	background: rgba(255, 255, 255, 0.35);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 48rpx;
	font-weight: 600;
	margin-bottom: 20rpx;
	overflow: hidden;
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.95);
	}
	
	.avatar-img {
		width: 100%;
		height: 100%;
		border-radius: var(--radius-full);
	}
	
	.avatar-edit-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
		
		.edit-icon {
			font-size: 40rpx;
			color: #fff;
		}
	}
	
	&:hover .avatar-edit-overlay {
		opacity: 1;
	}
}

.profile-drawer-name {
	display: block;
	font-size: 36rpx;
	font-weight: 600;
	color: #fff;
	margin-bottom: 8rpx;
}

.profile-drawer-email {
	display: block;
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.85);
}

.profile-drawer-item.version-item,
.profile-drawer-item.theme-item,
.profile-drawer-item.cache-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--spacing-md);
	
	.version-badge {
		font-size: 24rpx;
		color: var(--text-tertiary);
		font-weight: 500;
	}
	
	/* 自定义开关 - 替代原生滑块 */
	.toggle-wrap {
		flex-shrink: 0;
		align-self: center;
		width: 100rpx;
		height: 56rpx;
		border-radius: 28rpx;
		background: var(--border-color);
		position: relative;
		transition: background 0.25s ease, box-shadow 0.2s ease;
		box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
		
		.toggle-thumb {
			position: absolute;
			top: 50%;
			left: 4rpx;
			width: 48rpx;
			height: 48rpx;
			margin-top: -24rpx;
			border-radius: 50%;
			background: #fff;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15), 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
			transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		}
		
		&.on {
			background: var(--primary-color);
			box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.12), 0 0 0 1rpx rgba(18, 183, 245, 0.2);
			
			.toggle-thumb {
				transform: translateX(44rpx);
				box-shadow: 0 2rpx 10rpx rgba(18, 183, 245, 0.4), 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
			}
		}
		
		&:active .toggle-thumb {
			transform: scale(0.92);
		}
		&.on:active .toggle-thumb {
			transform: translateX(44rpx) scale(0.92);
		}
	}
}

.profile-drawer-item.cache-item {
	.cache-item-right {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex-shrink: 0;
	}
	
	.cache-chevron {
		width: 56rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		
		.chevron-icon {
			font-size: 22rpx;
			color: var(--text-tertiary);
			transition: transform 0.25s ease;
			display: inline-block;
			
			&.collapsed {
				transform: rotate(-90deg);
			}
		}
		
		&:active {
			background: var(--bg-hover);
		}
	}
}

/* 深色模式下侧边栏开关 */
.chat-container.theme-dark .profile-drawer-item .toggle-wrap {
	background: var(--border-color);
	
	.toggle-thumb {
		background: var(--bg-primary);
	}
	
	&.on {
		background: var(--primary-color);
	}
}

.profile-drawer-cache-info {
	padding: 20rpx var(--spacing-lg);
	background: var(--bg-tertiary);
	border-radius: var(--radius-lg);
	margin-bottom: var(--spacing-md);
	
	.cache-size {
		display: block;
		font-size: 24rpx;
		color: var(--text-secondary);
		margin-bottom: 16rpx;
	}
	
	.cache-actions {
		display: flex;
		gap: 16rpx;
	}
	
	.cache-btn {
		flex: 1;
		padding: 16rpx 20rpx;
		background: var(--bg-primary);
		border-radius: var(--radius-md);
		font-size: 24rpx;
		color: var(--primary-color);
		text-align: center;
		border: 1rpx solid var(--border-color);
		transition: all 0.2s ease;
		
		&:active {
			background: var(--bg-hover);
			transform: scale(0.98);
		}
	}
}

.profile-drawer-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: var(--spacing-xl);
	overflow-y: auto;
}

.profile-drawer-footer {
	margin-top: auto;
	padding-top: var(--spacing-xl);
}

.profile-drawer-item {
	padding: 28rpx var(--spacing-lg);
	background: var(--bg-secondary);
	border-radius: var(--radius-xl);
	margin-bottom: var(--spacing-md);
	font-size: 30rpx;
	color: var(--text-primary);
	transition: all 0.25s ease;
	
	&:active {
		background: var(--bg-hover);
	}
	
	&.logout {
		color: #e53935;
		font-weight: 500;
	}
	
	.item-arrow {
		color: var(--text-tertiary);
		font-size: 32rpx;
	}
}

.sidebar.sidebar-shifted {
	transform: translateX(0);
}

.sidebar {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	background: var(--bg-primary);
	overflow: hidden;
}

.sidebar-header {
	background: var(--bg-primary);
	border-bottom: 1rpx solid var(--border-light);
	flex-shrink: 0;
	padding-top: env(safe-area-inset-top);
	
	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 88rpx;
		padding: 12rpx var(--spacing-lg) 12rpx;
	}
	
	.header-title {
		font-size: 36rpx;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: -0.3rpx;
		background: linear-gradient(135deg, var(--primary-color) 0%, #00a2e8 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.header-actions {
		display: flex;
		gap: var(--spacing-xs);
		
		.action-btn {
			width: 72rpx;
			height: 72rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: var(--radius-xl);
			transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
			background: var(--bg-secondary);
			
			.icon-img {
				width: 40rpx;
				height: 40rpx;
				transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
				opacity: 0.7;
			}
			
			&:active {
				background: var(--primary-light);
				transform: scale(0.9);
				
				.icon-img {
					transform: scale(1.1);
					opacity: 1;
				}
			}
		}
	}
}

.tab-bar {
	display: flex;
	background: var(--bg-primary);
	border-bottom: 1rpx solid var(--border-light);
	flex-shrink: 0;
	padding: 0 var(--spacing-md);
	
	.tab-item {
		flex: 1;
		text-align: center;
		padding: 24rpx 0;
		font-size: 30rpx;
		font-weight: 500;
		color: var(--text-secondary);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6rpx;
		
		.badge {
			background: #ef4444;
			color: #fff;
			font-size: 20rpx;
			padding: 4rpx 10rpx;
			border-radius: 20rpx;
			font-weight: 600;
			line-height: 1;
			min-width: 28rpx;
			text-align: center;
		}
		
		&.active {
			color: var(--primary-color);
			font-weight: 600;
			
			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 3rpx;
				background: var(--primary-gradient-alt);
				border-radius: 2rpx;
				animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
			}
		}
	}
}

.chat-list {
	flex: 1;
	overflow: hidden;
}

.chat-item {
	display: flex;
	align-items: center;
	padding: var(--spacing-xl) var(--spacing-lg);
	background: var(--bg-primary);
	border-bottom: none;
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	animation: fadeInUp 0.5s ease backwards;
	position: relative;
	margin: var(--spacing-xs) var(--spacing-md);
	margin-bottom: var(--spacing-sm);
	border-radius: var(--radius-xl);
	
	@for $i from 1 through 20 {
		&:nth-child(#{$i}) {
			animation-delay: #{$i * 0.02}s;
		}
	}
	
	&:active {
		background: var(--bg-hover);
		transform: scale(0.98);
	}
	
	.chat-avatar {
		width: 96rpx;
		height: 96rpx;
		border-radius: var(--radius-xl);
		background: var(--primary-gradient-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 36rpx;
		font-weight: 600;
		margin-right: var(--spacing-lg);
		box-shadow: 0 4rpx 12rpx rgba(18, 183, 245, 0.25);
		flex-shrink: 0;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		
		&.group {
			background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
			box-shadow: 0 4rpx 12rpx rgba(245, 87, 108, 0.25);
			
			.avatar-icon {
				width: 48rpx;
				height: 48rpx;
				filter: brightness(0) invert(1);
			}
		}
	}
	
	.chat-info {
		flex: 1;
		min-width: 0;
		
		.chat-name {
			font-size: 32rpx;
			font-weight: 600;
			color: var(--text-primary);
			margin-bottom: 10rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			letter-spacing: -0.2rpx;
		}
		
		.chat-last-message {
			font-size: 26rpx;
			color: var(--text-secondary);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			line-height: 1.6;
			opacity: 0.8;
			
			.message-link {
				color: #12b7f5;
				text-decoration: underline;
				cursor: pointer;
			}
		}
	}
	
	.chat-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--spacing-xs);
		
		.unread-badge {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
			color: #fff;
			font-size: 18rpx;
			font-weight: 600;
			padding: 4rpx 10rpx;
			border-radius: 12rpx;
			min-width: 32rpx;
			text-align: center;
			box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.35);
			animation: pulse 2s ease infinite;
		}
	}
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: var(--spacing-2xl) 0;
	animation: fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	
	&.small {
		padding: var(--spacing-xl) 0;
	}
	
	.empty-icon {
		margin-bottom: var(--spacing-lg);
		opacity: 0.4;
		animation: float 4s ease-in-out infinite;
		filter: grayscale(0.2);
		
		&.empty-icon-img {
			width: 140rpx;
			height: 140rpx;
		}
	}
	
	.empty-text {
		font-size: 28rpx;
		color: var(--text-secondary);
		margin-bottom: var(--spacing-md);
		font-weight: 500;
		opacity: 0.8;
	}
	
	.empty-btn {
		margin-top: var(--spacing-lg);
		padding: 16rpx 32rpx;
		background: var(--primary-gradient-alt);
		color: #fff;
		border-radius: 24rpx;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(18, 183, 245, 0.3);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		
		&:active {
			transform: scale(0.95) translateY(2rpx);
			box-shadow: 0 2rpx 8rpx rgba(18, 183, 245, 0.25);
		}
	}
}

.loading-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--spacing-2xl) 0;
	
	.loading-spinner {
		width: 48rpx;
		height: 48rpx;
		border: 4rpx solid var(--border-light);
		border-top-color: var(--primary-color);
		border-right-color: var(--primary-color);
		border-radius: var(--radius-full);
		animation: spin 0.8s linear infinite;
		box-shadow: 0 2rpx 4rpx rgba(18, 183, 245, 0.15);
	}
	
	.loading-text {
		margin-top: var(--spacing-lg);
		font-size: 24rpx;
		color: var(--text-tertiary);
		font-weight: 500;
		opacity: 0.7;
	}
}

.loading-spinner {
	width: 48rpx;
	height: 48rpx;
	border: 4rpx solid var(--border-light);
	border-top-color: var(--primary-color);
	border-radius: var(--radius-full);
	animation: spin 0.8s linear infinite;
}

// 动画定义
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideIn {
	from {
		width: 0;
	}
	to {
		width: 80rpx;
	}
}

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
}

@keyframes float {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10rpx);
	}
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.sidebar-footer {
	background: var(--bg-primary);
	border-top: 1rpx solid var(--border-light);
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 20rpx var(--spacing-md);
	flex-shrink: 0;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	
	.footer-icon {
		width: 96rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
		position: relative;
		
		.footer-icon-img {
			width: 44rpx;
			height: 44rpx;
			opacity: 0.75;
		}
		
		&:active {
			background: var(--bg-hover);
			
			.footer-icon-img {
				opacity: 1;
			}
		}
		
		&.active .footer-icon-img {
			opacity: 1;
			filter: brightness(0) saturate(100%) invert(48%) sepia(96%) saturate(1352%) hue-rotate(165deg) brightness(98%) contrast(95%);
		}
		
		.footer-badge {
			position: absolute;
			top: 4rpx;
			right: 50%;
			transform: translate(24rpx, 0);
			background: #ef4444;
			color: #fff;
			font-size: 20rpx;
			font-weight: 600;
			padding: 4rpx 10rpx;
			border-radius: 24rpx;
			min-width: 28rpx;
			text-align: center;
			line-height: 1;
		}
	}
}

.chat-area {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	background: var(--bg-tertiary);
	overflow: hidden;
}

.chat-header {
	background: var(--bg-primary);
	border-bottom: 1rpx solid var(--border-light);
	flex-shrink: 0;
	padding-top: env(safe-area-inset-top);
	
	.header-content {
		display: flex;
		align-items: center;
		min-height: 88rpx;
		padding: 12rpx var(--spacing-lg) 12rpx;
	}
	
	.back-btn {
		width: 72rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
		border-radius: var(--radius-xl);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		
		.back-icon {
			width: 36rpx;
			height: 36rpx;
			transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
			opacity: 0.7;
		}
		
		&:active {
			background: var(--primary-light);
			transform: scale(0.9);
			
			.back-icon {
				transform: translateX(-2rpx);
				opacity: 1;
			}
		}
	}
	
	.chat-header-info {
		flex: 1;
		padding: 0 var(--spacing-md);
		
		.chat-header-name {
			font-size: 34rpx;
			font-weight: 600;
			color: var(--text-primary);
			letter-spacing: -0.3rpx;
		}
	}
	
	.header-actions {
		.action-btn {
			color: var(--text-secondary);
			width: 72rpx;
			height: 72rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--bg-secondary);
			border-radius: var(--radius-xl);
			transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
			
			.icon-img {
				transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
				opacity: 0.7;
			}
			
			&:active {
				background: var(--primary-light);
				transform: scale(0.9);
				
				.icon-img {
					transform: scale(1.1);
					opacity: 1;
				}
			}
		}
	}
}

.messages-container {
	flex: 1;
	padding: var(--spacing-md) var(--spacing-lg);
	overflow: hidden;
	background: var(--bg-secondary);
	
	@media (min-width: 750px) {
		max-width: 750px;
		margin: 0 auto;
	}
}

.message {
	display: flex;
	margin-bottom: var(--spacing-lg);
	align-items: flex-end;
	animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	padding: 0 var(--spacing-sm);
	
	&:last-child {
		margin-bottom: var(--spacing-xl);
	}
	
	&.sent {
		justify-content: flex-end;
		
		.message-content {
			background: var(--primary-gradient-alt);
			color: #fff;
			border-radius: 24rpx 6rpx 24rpx 24rpx;
			box-shadow: 0 4rpx 12rpx rgba(18, 183, 245, 0.25), 0 2rpx 4rpx rgba(18, 183, 245, 0.15);
			position: relative;
			backdrop-filter: blur(10rpx);
			
			.message-text {
				color: #fff;
			}
			
			.message-time {
				color: rgba(255, 255, 255, 0.85);
			}
		}
	}
	
	&.received {
		justify-content: flex-start;
		padding-left: 0;
		
		.message-avatar {
			margin-left: 0;
		}
		
		.message-content {
			background: rgba(255, 255, 255, 0.9);
			border-radius: 6rpx 24rpx 24rpx 24rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
			border: none;
			position: relative;
			backdrop-filter: blur(10rpx);
		}
	}
	
	.message-avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: var(--radius-xl);
		background: var(--primary-gradient-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 26rpx;
		font-weight: 600;
		flex-shrink: 0;
		box-shadow: 0 4rpx 8rpx rgba(18, 183, 245, 0.2);
		border: 2rpx solid rgba(255, 255, 255, 0.3);
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		margin: 0 var(--spacing-sm);
	}
	
	.message-content {
		max-width: 70%;
		min-width: 100rpx;
		padding: 16rpx 20rpx;
		margin: 0 var(--spacing-sm);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		position: relative;
		
		// 响应式：在小屏幕上调整最大宽度
		@media (max-width: 375px) {
			max-width: 75%;
		}
		
		&:active {
			transform: scale(0.97);
		}
		
		.message-sender {
			font-size: 22rpx;
			color: var(--primary-color);
			margin-bottom: 6rpx;
			font-weight: 600;
			letter-spacing: -0.2rpx;
			opacity: 0.9;
		}
		
		.message-recalled {
			padding: 10rpx 14rpx;
			background: rgba(0, 0, 0, 0.04);
			border-radius: var(--radius-lg);
			text-align: center;
			
			text {
				font-size: 22rpx;
				color: var(--text-tertiary);
				font-style: italic;
			}
		}
		
		.message-image-wrapper {
			position: relative;
			min-width: 180rpx;
			min-height: 180rpx;
			background: var(--bg-secondary);
			border-radius: var(--radius-lg);
			overflow: hidden;
			transition: transform 0.2s ease;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
			
			&:active {
				transform: scale(0.98);
			}
			
			.image-loading {
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--bg-secondary);
				z-index: 1;
				
				.image-loading-placeholder {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 80rpx;
					height: 80rpx;
				}
				
				.image-loading-spinner {
					width: 48rpx;
					height: 48rpx;
					border: 4rpx solid var(--border-light);
					border-top-color: var(--primary-color);
					border-radius: 50%;
					animation: spin 0.8s linear infinite;
				}
			}
			
			.message-image {
				max-width: 100%;
				max-height: 400rpx;
				border-radius: var(--radius-lg);
				display: block;
				opacity: 0;
				transition: opacity 0.3s ease;
				
				&.image-loaded {
					opacity: 1;
				}
			}
		}
		
		.message-image-error {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			min-width: 180rpx;
			min-height: 180rpx;
			background: var(--bg-secondary);
			border-radius: var(--radius-lg);
			padding: 20rpx;
			cursor: pointer;
			
			.error-icon {
				width: 48rpx;
				height: 48rpx;
				opacity: 0.5;
				margin-bottom: 8rpx;
			}
			
			.error-text {
				font-size: 24rpx;
				color: var(--text-tertiary);
			}
			
			.error-retry-hint {
				font-size: 22rpx;
				color: var(--primary-color);
				margin-top: 6rpx;
			}
		}
		
		.message-video-wrapper {
			position: relative;
			min-width: 200rpx;
			max-width: 360rpx;
			border-radius: var(--radius-lg);
			overflow: hidden;
			transition: transform 0.2s ease;
			
			&:active {
				transform: scale(0.98);
			}
			
			.video-cover {
				display: block;
				width: 100%;
				height: 240rpx;
				background: var(--bg-tertiary);
			}
			
			.video-play-overlay {
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.video-play-icon {
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				background: rgba(0, 0, 0, 0.5);
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.video-play-triangle {
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 14rpx 0 14rpx 24rpx;
				border-color: transparent transparent transparent #fff;
				margin-left: 6rpx;
			}
			
			.video-duration-badge {
				position: absolute;
				bottom: 8rpx;
				right: 8rpx;
				background: rgba(0, 0, 0, 0.6);
				color: #fff;
				font-size: 20rpx;
				padding: 4rpx 10rpx;
				border-radius: 6rpx;
			}
		}
		
		.message-audio-wrapper {
			display: flex;
			align-items: center;
			padding: 16rpx 20rpx;
			background: var(--bg-secondary);
			border-radius: var(--radius-lg);
			min-width: 200rpx;
			max-width: 400rpx;
			transition: all 0.2s ease;
			border: 1rpx solid var(--border-light);
			
			&:active {
				background: var(--bg-hover);
				transform: scale(0.98);
			}
			
			.audio-icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 16rpx;
				flex-shrink: 0;
			}
			
			.audio-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 8rpx;
				
				.audio-waveform {
					display: flex;
					align-items: center;
					gap: 4rpx;
					height: 32rpx;
					
					.wave-bar {
						width: 4rpx;
						min-height: 8rpx;
						background: var(--primary-color);
						border-radius: 2rpx;
						transition: height 0.08s ease-out;
					}
				}
				
				.audio-duration {
					font-size: 22rpx;
					color: var(--text-tertiary);
				}
			}
		}
		
		.message-file-wrapper {
			display: flex;
			align-items: center;
			padding: 12rpx 16rpx;
			background: var(--bg-secondary);
			border-radius: var(--radius-lg);
			min-width: 260rpx;
			transition: all 0.2s ease;
			border: 1rpx solid var(--border-light);
			
			&:active {
				background: var(--bg-hover);
				transform: scale(0.98);
			}
			
			.file-icon {
				width: 44rpx;
				height: 44rpx;
				margin-right: 12rpx;
				flex-shrink: 0;
				opacity: 0.8;
			}
			
			.file-info {
				flex: 1;
				
				.file-name {
					display: block;
					font-size: 26rpx;
					color: var(--text-primary);
					margin-bottom: 4rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: 260rpx;
					font-weight: 600;
				}
				
				.file-size {
					display: block;
					font-size: 20rpx;
					color: var(--text-tertiary);
				}
			}
		}
		
		.message-text {
			font-size: 30rpx;
			color: var(--text-primary);
			line-height: 1.6;
			word-break: break-word;
			letter-spacing: 0.1rpx;
			word-spacing: 0.3rpx;
			
			.message-link {
				color: #12b7f5;
				text-decoration: underline;
				cursor: pointer;
				word-break: break-all;
				
				&:hover {
					opacity: 0.8;
				}
			}
		}
		
		.message-upload-progress {
			margin-top: 12rpx;
			display: flex;
			align-items: center;
			gap: 12rpx;
			
			.upload-progress-bar {
				flex: 1;
				height: 8rpx;
				border-radius: 4rpx;
				overflow: hidden;
			}
			
			.upload-progress-text {
				font-size: 22rpx;
				color: rgba(255, 255, 255, 0.9);
				min-width: 50rpx;
				text-align: right;
			}
		}
		
		.message-footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 8rpx;
			margin-top: 12rpx;
		}
		
		.message-time {
			font-size: 20rpx;
			color: var(--text-tertiary);
			opacity: 0.65;
			font-weight: 400;
			line-height: 1;
		}
		
		.message-status {
			display: flex;
			align-items: center;
			
			.status-icon {
				font-size: 20rpx;
				color: var(--text-tertiary);
				opacity: 0.65;
				
				&.read {
					color: var(--primary-color);
					opacity: 1;
				}
				
				&.uploading {
					color: var(--primary-color);
					opacity: 1;
				}
			}
		}
	}
}

.input-area {
	background: var(--bg-primary);
	border-top: 1rpx solid var(--border-light);
	padding: 16rpx var(--spacing-lg);
	flex-shrink: 0;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	
	@media (min-width: 750px) {
		max-width: 750px;
		margin: 0 auto;
		width: 100%;
	}
}

.input-container {
	display: flex;
	align-items: center;
	background: var(--bg-secondary);
	border-radius: 24rpx;
	padding: 16rpx 20rpx;
	border: 1rpx solid var(--border-light);
	
	&:focus-within {
		border-color: var(--primary-color);
		background: var(--bg-primary);
	}
	
	.input-wrapper {
		flex: 1;
		position: relative;
		
		textarea {
			width: 100%;
			min-height: 48rpx;
			max-height: 200rpx;
			font-size: 30rpx;
			line-height: 1.5;
			background: transparent;
			color: var(--text-primary);
			padding-bottom: 40rpx;
			
			&::placeholder {
				color: var(--text-tertiary);
			}
		}
		
		.char-count {
			position: absolute;
			bottom: 10rpx;
			right: 20rpx;
			font-size: 20rpx;
			color: var(--text-secondary);
			line-height: 1;
			
			&.warning {
				color: #f59e0b;
			}
		}
	}
	
	.input-actions {
		display: flex;
		align-items: center;
		margin-left: var(--spacing-sm);
		gap: var(--spacing-sm);
		flex-shrink: 0;
		
		.more-popover-wrap {
			position: relative;
		}
		
		.more-actions-popover {
			position: absolute;
			right: 0;
			bottom: 100%;
			margin-bottom: 12rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0;
			background: var(--bg-primary);
			border-radius: var(--radius-xl);
			padding: 8rpx 0;
			box-shadow: var(--shadow-lg);
			border: 1rpx solid var(--border-light);
			animation: popoverUp 0.2s ease;
		}
		
		@keyframes popoverUp {
			from {
				opacity: 0;
				transform: translateY(-8rpx);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
		
		.btn-icon {
			width: 72rpx;
			height: 72rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: var(--radius-lg);
			
			.btn-icon-img {
				width: 40rpx;
				height: 40rpx;
			}
			
			.record-icon-img {
				width: 40rpx;
				height: 40rpx;
				
				&.recording {
					animation: pulse 1s ease infinite;
					filter: invert(24%) sepia(90%) saturate(2000%) hue-rotate(350deg);
				}
			}
			
			&:active {
				background: var(--bg-hover);
			}
			
			&.record-btn {
				min-width: 72rpx;
			}
			
			&.plus-btn {
				.plus-icon {
					font-size: 44rpx;
					font-weight: 300;
					color: var(--primary-color);
					line-height: 1;
				}
				&:active {
					background: var(--primary-light);
				}
			}
		}
		
		.record-btn-hover {
			background: var(--bg-hover);
		}
		
		.send-btn {
			height: 72rpx;
			min-width: 100rpx;
			padding: 0 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--bg-secondary);
			color: var(--text-tertiary);
			border-radius: 24rpx;
			font-size: 28rpx;
			font-weight: 600;
			transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
			box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.04);
			align-self: center;
			
			&.active {
				background: var(--primary-gradient-alt);
				color: #fff;
				box-shadow: 0 4rpx 12rpx rgba(18, 183, 245, 0.35);
			}
			
			&:active.active {
				transform: scale(0.95);
				box-shadow: 0 2rpx 8rpx rgba(18, 183, 245, 0.3);
			}
		}
	}
}

.popup-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 300;
	animation: fadeIn 0.2s ease;
}

.popup {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: var(--bg-primary);
	border-radius: 24rpx 24rpx 0 0;
	z-index: 400;
	transform: translateY(100%);
	transition: transform 0.3s ease;
	max-height: 85vh;
	box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.1);
	padding-bottom: env(safe-area-inset-bottom);
	
	// 响应式：确保弹窗在不同屏幕尺寸下正常显示
	@media (min-width: 750px) {
		max-width: 600px;
		left: 50%;
		transform: translateX(-50%) translateY(100%);
		border-radius: var(--radius-xl);
		
		&.open {
			transform: translateX(-50%) translateY(0);
		}
	}
	
	&.open {
		transform: translateY(0);
		animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		
		@media (min-width: 750px) {
			transform: translateX(-50%) translateY(0);
		}
	}
	
	.popup-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xl);
		border-bottom: 1rpx solid var(--border-light);
		position: relative;
		
		.popup-title {
			font-size: 38rpx;
			font-weight: 700;
			color: var(--text-primary);
			letter-spacing: -0.5rpx;
		}
		
		.popup-close {
			position: absolute;
			right: var(--spacing-xl);
			font-size: 38rpx;
			color: var(--text-secondary);
			padding: 12rpx;
			width: 64rpx;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--bg-secondary);
			border-radius: var(--radius-lg);
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
			
			&:active {
				background: var(--bg-hover);
				transform: scale(0.9);
			}
		}
	}
	
	.popup-content {
		padding: var(--spacing-xl);
		max-height: 60vh;
		overflow-y: auto;
		padding-bottom: calc(var(--spacing-xl) + env(safe-area-inset-bottom));
	}
	
	.form-group {
		margin-bottom: var(--spacing-xl);
		
		.label {
			display: block;
			font-size: 30rpx;
			color: var(--text-secondary);
			margin-bottom: var(--spacing-sm);
			font-weight: 500;
		}
		
		input {
			width: 100%;
			padding: var(--spacing-md) var(--spacing-lg);
			background: var(--bg-secondary);
			border-radius: var(--radius-xl);
			font-size: 32rpx;
			color: var(--text-primary);
			border: 2rpx solid transparent;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			box-shadow: var(--shadow-sm);
			
			&:focus {
				background: var(--bg-primary);
				border-color: var(--primary-color);
			}
			
			&::placeholder {
				color: var(--text-tertiary);
			}
		}
		
		textarea {
			width: 100%;
			min-height: 120rpx;
			padding: var(--spacing-md) var(--spacing-lg);
			background: var(--bg-secondary);
			border-radius: var(--radius-xl);
			font-size: 32rpx;
			color: var(--text-primary);
			border: 2rpx solid transparent;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			box-shadow: var(--shadow-sm);
			
			&:focus {
				background: var(--bg-primary);
				border-color: var(--primary-color);
			}
			
			&::placeholder {
				color: var(--text-tertiary);
			}
		}
	}
	
	.form-actions {
		display: flex;
		gap: var(--spacing-md);
		margin-top: var(--spacing-xl);
		
		.btn {
			flex: 1;
			padding: var(--spacing-lg);
			border-radius: var(--radius-xl);
			font-size: 32rpx;
			font-weight: 600;
			text-align: center;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			
			&:active {
				transform: scale(0.97);
			}
			
			&.btn-secondary {
				background: var(--bg-secondary);
				color: var(--text-primary);
			}
			
			&.btn-primary {
				background: var(--primary-gradient-alt);
				color: #fff;
				box-shadow: var(--shadow-lg);
				
				&.loading {
					opacity: 0.7;
					pointer-events: none;
				}
			}
		}
	}
	
	.popup-btn {
		width: 100%;
		padding: var(--spacing-lg);
		background: var(--primary-gradient-alt);
		color: #fff;
		border-radius: var(--radius-xl);
		font-size: 32rpx;
		font-weight: 600;
		border: none;
		box-shadow: var(--shadow-lg);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		
		&:active {
			transform: scale(0.97) translateY(2rpx);
			box-shadow: var(--shadow-md);
		}
	}
}

.search-results, .popup-content {
	.search-item, .request-item {
		display: flex;
		align-items: center;
		padding: var(--spacing-md) var(--spacing-lg);
		background: var(--bg-secondary);
		border-radius: var(--radius-xl);
		margin-bottom: var(--spacing-md);
		box-shadow: var(--shadow-sm);
		border: 1rpx solid var(--border-light);
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		animation: fadeInUp 0.4s ease backwards;
		
		&:active {
			transform: scale(0.97) translateY(1rpx);
			box-shadow: var(--shadow-md);
			background: var(--bg-hover);
		}
		
		.user-avatar {
			width: 88rpx;
			height: 88rpx;
			border-radius: var(--radius-full);
			background: var(--primary-gradient-alt);
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 32rpx;
			font-weight: 600;
			margin-right: var(--spacing-md);
			box-shadow: var(--shadow-sm);
			flex-shrink: 0;
		}
		
		.user-info {
			flex: 1;
			
			.user-name {
				display: block;
				font-size: 28rpx;
				color: var(--text-primary);
				margin-bottom: 4rpx;
				font-weight: 500;
			}
			
			.user-email {
				display: block;
				font-size: 24rpx;
				color: var(--text-tertiary);
			}
		}
		
		.add-btn, .accept-btn {
			padding: 12rpx var(--spacing-xl);
			background: var(--primary-gradient-alt);
			color: #fff;
			border-radius: var(--radius-2xl);
			font-size: 28rpx;
			font-weight: 600;
			box-shadow: var(--shadow-md);
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
			
			&:active {
				transform: scale(0.94) translateY(1rpx);
				box-shadow: var(--shadow-sm);
			}
		}
		
		.request-actions {
			display: flex;
			gap: var(--spacing-sm);
		}
		
		.reject-btn {
			padding: 12rpx var(--spacing-xl);
			background: var(--bg-tertiary);
			color: var(--text-secondary);
			border-radius: var(--radius-2xl);
			font-size: 28rpx;
			font-weight: 600;
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
			border: 1rpx solid var(--border-light);
			
			&:active {
				background: var(--bg-hover);
				transform: scale(0.94) translateY(1rpx);
			}
		}
	}
}

.toast {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: rgba(0, 0, 0, 0.75);
	color: #fff;
	padding: var(--spacing-md) var(--spacing-2xl);
	border-radius: var(--radius-lg);
	font-size: 30rpx;
	z-index: 1000;
	backdrop-filter: blur(8rpx);
	box-shadow: var(--shadow-lg);
	animation: toastIn 0.25s ease forwards;
}

@keyframes toastIn {
	from {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.92);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
}

.release-notes-popup .release-notes-subtitle {
	display: block;
	font-size: 28rpx;
	color: var(--text-secondary);
	margin-bottom: var(--spacing-md);
	font-weight: 500;
}

.release-notes-popup .release-notes-list {
	margin-bottom: var(--spacing-xl);
}

.release-notes-popup .release-notes-item {
	display: flex;
	align-items: flex-start;
	padding: var(--spacing-sm) 0;
	font-size: 28rpx;
	color: var(--text-primary);
	line-height: 1.5;
}

.release-notes-popup .release-notes-num {
	flex-shrink: 0;
	margin-right: var(--spacing-xs);
	color: var(--primary-color);
	font-weight: 600;
}

.release-notes-popup .release-notes-text {
	flex: 1;
}

.release-notes-popup .release-notes-btn {
	width: 100%;
	padding: var(--spacing-lg);
	background: var(--primary-gradient-alt);
	color: #fff;
	border-radius: var(--radius-xl);
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	transition: all 0.2s ease;
}

.release-notes-popup .release-notes-btn:active {
	transform: scale(0.98);
}

.download-progress-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--spacing-xl);
}

.download-progress-card {
	width: 100%;
	max-width: 560rpx;
	background: var(--bg-primary);
	border-radius: var(--radius-xl);
	padding: var(--spacing-2xl);
	box-shadow: var(--shadow-xl);
}

.download-progress-title {
	display: block;
	font-size: 34rpx;
	font-weight: 600;
	color: var(--text-primary);
	margin-bottom: var(--spacing-lg);
	text-align: center;
}

.download-progress-bar {
	width: 100%;
	height: 12rpx;
	border-radius: 6rpx;
	overflow: hidden;
	margin-bottom: var(--spacing-sm);
}

.download-progress-percent {
	display: block;
	font-size: 28rpx;
	color: var(--text-secondary);
	text-align: center;
}



.chat-info-section {
	padding: var(--spacing-md) 0;
	border-bottom: 1rpx solid var(--border-light);
	margin-bottom: var(--spacing-md);
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--spacing-sm) 0;
	
	.info-label {
		font-size: 28rpx;
		color: var(--text-secondary);
	}
	
	.info-value {
		font-size: 28rpx;
		color: var(--text-primary);
		font-weight: 500;
	}
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: var(--text-primary);
	margin: var(--spacing-md) 0 var(--spacing-sm) 0;
	padding-left: var(--spacing-xs);
	border-left: 4rpx solid var(--primary-color);
}

.members-list {
	max-height: 400rpx;
	margin-bottom: 20rpx;
}

.member-item {
	display: flex;
	align-items: center;
	padding: var(--spacing-md) 0;
	transition: all 0.2s ease;
	
	&:active {
		transform: translateX(4rpx);
	}
	
	.member-avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: var(--radius-full);
		background: var(--primary-gradient-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 26rpx;
		font-weight: 600;
		margin-right: var(--spacing-sm);
		box-shadow: var(--shadow-sm);
		flex-shrink: 0;
	}
	
	.member-info {
		flex: 1;
		
		.member-name {
			font-size: 28rpx;
			color: var(--text-primary);
			margin-bottom: 4rpx;
			font-weight: 500;
		}
		
		.member-role {
			font-size: 24rpx;
			color: var(--primary-color);
			font-weight: 500;
		}
	}
}

.action-buttons {
	display: flex;
	gap: var(--spacing-sm);
	margin-top: var(--spacing-lg);
	
	.action-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md);
		border-radius: var(--radius-lg);
		background: var(--bg-secondary);
		color: var(--text-primary);
		font-size: 28rpx;
		font-weight: 500;
		box-shadow: var(--shadow-sm);
		transition: all 0.2s ease;
		
		&:active {
			transform: scale(0.95);
			box-shadow: var(--shadow-md);
		}
		
		&.primary {
			background: var(--primary-gradient-alt);
			color: #fff;
			box-shadow: var(--shadow-md);
		}
	}
}

.friends-list {
	max-height: 400rpx;
	margin-bottom: 20rpx;
}

.friend-item {
	display: flex;
	align-items: center;
	padding: var(--spacing-md) 0;
	transition: all 0.2s ease;
	
	&:active {
		transform: translateX(4rpx);
	}
	
	.friend-avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: var(--radius-full);
		background: var(--primary-gradient-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 26rpx;
		font-weight: 600;
		margin-right: var(--spacing-sm);
		box-shadow: var(--shadow-sm);
		flex-shrink: 0;
	}
	
	.friend-info {
		flex: 1;
		
		.friend-name {
			font-size: 28rpx;
			color: var(--text-primary);
			font-weight: 500;
		}
	}
	
	.invite-checkbox {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid var(--border-color);
		border-radius: var(--radius-full);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: transparent;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-sm);
		
		&.checked {
			background: var(--primary-color);
			border-color: var(--primary-color);
			color: #fff;
			transform: scale(1.1);
			box-shadow: var(--shadow-md);
		}
	}
}

.invite-actions {
	margin-top: var(--spacing-md);
	
	.invite-btn {
		width: 100%;
		padding: var(--spacing-md);
		background: var(--primary-gradient-alt);
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
		text-align: center;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		transition: all 0.3s ease;
		
		&:active {
			transform: scale(0.98);
			box-shadow: var(--shadow-sm);
		}
		
		&[disabled] {
			background: var(--border-color);
			box-shadow: none;
			opacity: 0.6;
		}
	}
}

.message-menu-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.35);
	z-index: 500;
}

.message-menu {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: var(--bg-primary);
	border-radius: 24rpx 24rpx 0 0;
	z-index: 600;
	padding: 24rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.08);
	animation: slideUp 0.25s ease;
	
	.menu-item {
		padding: var(--spacing-xl);
		text-align: center;
		font-size: 32rpx;
		color: var(--text-primary);
		border-radius: var(--radius-lg);
		margin-bottom: var(--spacing-sm);
		background: var(--bg-secondary);
		transition: all 0.2s ease;
		
		&:active {
			background: var(--bg-hover);
			transform: scale(0.98);
		}
		
		&:last-child {
			margin-bottom: 0;
			color: var(--text-secondary);
		}
	}
}

.upload-manager-btn {
	position: fixed;
	right: 32rpx;
	bottom: calc(140rpx + env(safe-area-inset-bottom));
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 16rpx 24rpx;
	background: var(--bg-primary);
	border-radius: 40rpx;
	box-shadow: var(--shadow-lg);
	z-index: 100;
	animation: fadeInUp 0.3s ease;
	
	.upload-btn-icon {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.upload-spinner {
		width: 32rpx;
		height: 32rpx;
		border: 3rpx solid var(--primary-color);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	
	.upload-btn-text {
		font-size: 26rpx;
		color: var(--text-primary);
		font-weight: 500;
	}
}

.upload-manager-popup {
	.popup-content {
		max-height: 60vh;
		overflow-y: auto;
	}
}

.upload-task-item {
	display: flex;
	flex-direction: column;
	padding: var(--spacing-md);
	background: var(--bg-secondary);
	border-radius: var(--radius-lg);
	margin-bottom: var(--spacing-sm);
	border: 1rpx solid var(--border-light);
	
	.upload-task-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
		
		.upload-task-name {
			font-size: 28rpx;
			color: var(--text-primary);
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			flex: 1;
			margin-right: 16rpx;
		}
		
		.upload-task-size {
			font-size: 24rpx;
			color: var(--text-tertiary);
			flex-shrink: 0;
		}
	}
	
	.upload-task-progress-wrap {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 12rpx;
		
		.upload-task-progress {
			flex: 1;
			height: 8rpx;
			border-radius: 4rpx;
			overflow: hidden;
		}
		
		.upload-task-percent {
			font-size: 24rpx;
			color: var(--primary-color);
			font-weight: 500;
			min-width: 60rpx;
			text-align: right;
		}
	}
	
	.upload-task-status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		text {
			font-size: 24rpx;
			font-weight: 500;
		}
		
		.status-uploading {
			color: var(--primary-color);
		}
		
		.status-sending {
			color: #f59e0b;
		}
		
		.status-completed {
			color: #10b981;
		}
		
		.status-failed {
			color: #ef4444;
		}
	}
	
	.upload-task-actions {
		display: flex;
		justify-content: flex-end;
		gap: 16rpx;
		margin-top: 12rpx;
		
		.upload-task-cancel,
		.upload-task-retry,
		.upload-task-remove {
			padding: 8rpx 24rpx;
			font-size: 24rpx;
			border-radius: 20rpx;
			font-weight: 500;
			transition: all 0.2s ease;
		}
		
		.upload-task-cancel {
			background: var(--bg-tertiary);
			color: var(--text-secondary);
			
			&:active {
				background: var(--bg-hover);
			}
		}
		
		.upload-task-retry {
			background: var(--primary-color);
			color: #fff;
			
			&:active {
				transform: scale(0.95);
			}
		}
		
		.upload-task-remove {
			background: var(--bg-tertiary);
			color: var(--text-secondary);
			
			&:active {
				background: var(--bg-hover);
			}
		}
	}
}

// 扫码登录弹窗样式
.scan-login-popup {
	.popup-content {
		padding: var(--spacing-xl);
	}
}

.scan-login-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--spacing-xl) 0;
	animation: fadeIn 0.3s ease;
}

.scan-login-icon {
	width: 120rpx;
	height: 120rpx;
	background: linear-gradient(135deg, var(--primary-color) 0%, #0ea5e9 100%);
	border-radius: var(--radius-2xl);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: var(--spacing-lg);
	box-shadow: 0 8rpx 24rpx rgba(14, 165, 233, 0.3);
	animation: float 2s ease-in-out infinite;
}

.icon-desktop {
	font-size: 60rpx;
}

.scan-login-title {
	font-size: 36rpx;
	font-weight: 600;
	color: var(--text-primary);
	margin-bottom: var(--spacing-sm);
}

.scan-login-ip {
	font-size: 28rpx;
	color: var(--text-secondary);
	margin-bottom: var(--spacing-xs);
	background: var(--bg-secondary);
	padding: 8rpx 24rpx;
	border-radius: var(--radius-lg);
}

.scan-login-hint {
	font-size: 26rpx;
	color: var(--text-tertiary);
	margin-top: var(--spacing-sm);
}

.scan-login-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--spacing-2xl) 0;
	animation: fadeIn 0.3s ease;
}

.scan-loading-spinner {
	width: 56rpx;
	height: 56rpx;
	border: 4rpx solid var(--border-light);
	border-top-color: var(--primary-color);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
	margin-bottom: var(--spacing-md);
}

.scan-loading-text {
	font-size: 28rpx;
	color: var(--text-secondary);
}

.scan-login-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--spacing-xl) 0;
	animation: shake 0.5s ease;
	
	.error-text {
		font-size: 28rpx;
		color: #ef4444;
		margin-bottom: var(--spacing-md);
		text-align: center;
	}
	
	.retry-btn {
		padding: var(--spacing-md) var(--spacing-2xl);
		background: var(--primary-gradient-alt);
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-md);
		transition: all 0.2s ease;
		
		&:active {
			transform: scale(0.95);
			box-shadow: var(--shadow-sm);
		}
	}
}

.scan-login-actions {
	display: flex;
	gap: var(--spacing-md);
	margin-top: var(--spacing-xl);
	padding-top: var(--spacing-lg);
	border-top: 1rpx solid var(--border-light);
}

.scan-btn {
	flex: 1;
	padding: var(--spacing-lg) 0;
	text-align: center;
	font-size: 30rpx;
	font-weight: 500;
	border-radius: var(--radius-xl);
	transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	
	&.reject {
		background: var(--bg-tertiary);
		color: var(--text-secondary);
		border: 1rpx solid var(--border-light);
		
		&:active {
			background: var(--bg-hover);
			transform: scale(0.96);
		}
	}
	
	&.confirm {
		background: var(--primary-gradient-alt);
		color: #fff;
		box-shadow: var(--shadow-md);
		
		&:active {
			transform: scale(0.96);
			box-shadow: var(--shadow-sm);
		}
	}
}

.scan-login-success {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--spacing-2xl) 0;
	animation: scaleIn 0.4s ease;
	
	.success-icon {
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 50rpx;
		color: #fff;
		margin-bottom: var(--spacing-lg);
		box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.3);
		animation: pulse 0.5s ease;
	}
	
	.success-text {
		font-size: 36rpx;
		font-weight: 600;
		color: #10b981;
		margin-bottom: var(--spacing-xs);
	}
	
	.success-hint {
		font-size: 26rpx;
		color: var(--text-tertiary);
	}
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	10%, 30%, 50%, 70%, 90% { transform: translateX(-10rpx); }
	20%, 40%, 60%, 80% { transform: translateX(10rpx); }
}

.profile-drawer-item.color-theme-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--spacing-md);
	
	.color-theme-preview {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex-shrink: 0;
		
		.color-preview-dot {
			width: 32rpx;
			height: 32rpx;
			border-radius: 50%;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
		}
		
		.color-theme-name {
			font-size: 24rpx;
			color: var(--text-tertiary);
			font-weight: 500;
		}
	}
}

.font-preview-info {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
	
	.font-preview-name {
		font-size: 24rpx;
		color: var(--text-tertiary);
		font-weight: 500;
		max-width: 200rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.color-palette-popup {
	.popup-content {
		padding: 0;
		overflow: hidden;
	}
}

.palette-scroll {
	height: 60vh;
	max-height: 800rpx;
}

.category-tabs {
	display: flex;
	flex-wrap: wrap;
	gap: var(--spacing-sm);
	padding: var(--spacing-md);
	padding-bottom: var(--spacing-sm);
	border-bottom: 1rpx solid var(--border-light);
	position: sticky;
	top: 0;
	background: var(--bg-primary);
	z-index: 10;
}

.category-tab {
	padding: 12rpx 24rpx;
	border-radius: var(--radius-full);
	background: var(--bg-secondary);
	border: 1rpx solid var(--border-light);
	transition: all 0.2s ease;
	
	text {
		font-size: 24rpx;
		color: var(--text-secondary);
	}
	
	&.active {
		background: var(--primary-color);
		border-color: var(--primary-color);
		
		text {
			color: #fff;
		}
	}
	
	&:active {
		transform: scale(0.95);
	}
}

.color-palette-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--spacing-md);
	padding: var(--spacing-md);
}

.color-theme-card {
	position: relative;
	background: var(--bg-secondary);
	border-radius: var(--radius-xl);
	overflow: hidden;
	border: 2rpx solid var(--border-light);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	animation: fadeInUp 0.4s ease backwards;
	
	@for $i from 1 through 5 {
		&:nth-child(#{$i}) {
			animation-delay: #{$i * 0.05}s;
		}
	}
	
	&:active {
		transform: scale(0.97);
	}
	
	&.active {
		border-color: var(--primary-color);
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1), 0 0 0 2rpx rgba(18, 183, 245, 0.2);
	}
	
	.theme-preview {
		height: 140rpx;
		position: relative;
		overflow: hidden;
		
		.theme-preview-header {
			height: 40rpx;
		}
		
		.theme-preview-body {
			padding: var(--spacing-sm);
			display: flex;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}
		
		.theme-preview-avatar {
			width: 40rpx;
			height: 40rpx;
			border-radius: var(--radius-lg);
			flex-shrink: 0;
		}
		
		.theme-preview-lines {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 8rpx;
			padding-top: 4rpx;
		}
		
		.theme-preview-line {
			height: 12rpx;
			border-radius: 6rpx;
			
			&.short {
				width: 60%;
			}
		}
	}
	
	.theme-info {
		padding: var(--spacing-sm) var(--spacing-md);
		text-align: center;
		
		.theme-name {
			display: block;
			font-size: 28rpx;
			font-weight: 600;
			color: var(--text-primary);
			margin-bottom: 4rpx;
		}
		
		.theme-desc {
			display: block;
			font-size: 22rpx;
			color: var(--text-tertiary);
		}
	}
	
	.theme-check {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		width: 40rpx;
		height: 40rpx;
		background: var(--primary-color);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
		animation: scaleIn 0.3s ease;
		
		text {
			color: #fff;
			font-size: 24rpx;
			font-weight: 600;
		}
	}
}

.font-palette-popup {
	.popup-content {
		padding: 0;
	}
}

.font-palette-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--spacing-md);
	padding: var(--spacing-md);
}

.font-card {
	position: relative;
	background: var(--bg-secondary);
	border-radius: var(--radius-xl);
	overflow: hidden;
	border: 2rpx solid var(--border-light);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	animation: fadeInUp 0.4s ease backwards;
	
	@for $i from 1 through 5 {
		&:nth-child(#{$i}) {
			animation-delay: #{$i * 0.05}s;
		}
	}
	
	&:active {
		transform: scale(0.97);
	}
	
	&.active {
		border-color: var(--primary-color);
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1), 0 0 0 2rpx rgba(18, 183, 245, 0.2);
	}
	
	.font-preview {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-tertiary);
		padding: var(--spacing-sm);
		
		.font-preview-text {
			font-size: 28rpx;
			color: var(--text-primary);
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	
	.font-info {
		padding: var(--spacing-sm) var(--spacing-md);
		
		.font-name {
			display: block;
			font-size: 26rpx;
			font-weight: 600;
			color: var(--text-primary);
			margin-bottom: 4rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		
		.font-desc {
			display: block;
			font-size: 22rpx;
			color: var(--text-tertiary);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	
	.font-check {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		width: 36rpx;
		height: 36rpx;
		background: var(--primary-color);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
		animation: scaleIn 0.3s ease;
		
		text {
			color: #fff;
			font-size: 22rpx;
			font-weight: 600;
		}
	}
}

.hidden-canvas {
	position: fixed;
	left: -9999rpx;
	top: -9999rpx;
	width: 1rpx;
	height: 1rpx;
}
</style>
