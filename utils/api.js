const API_BASE_URL_KEY = "api_base_url";
const DEFAULT_API_URL = "https://chat.hyacine.com.cn/chat/api.php";

const requestCache = new Map();
const pendingRequests = new Map();
const CACHE_DURATION = 10000;

const requestQueue = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500;
const MAX_CONCURRENT_REQUESTS = 2;
let activeRequests = 0;

export function getApiBaseUrl() {
  try {
    const url = uni.getStorageSync(API_BASE_URL_KEY);
    return url && typeof url === "string" && url.trim()
      ? url.trim()
      : DEFAULT_API_URL;
  } catch (e) {
    return DEFAULT_API_URL;
  }
}

export function setApiBaseUrl(url) {
  if (!url || typeof url !== "string") return;
  const trimmed = url.trim();
  if (!trimmed) return;
  let finalUrl = trimmed;
  if (!/\/api\.php(\?.*)?$/i.test(finalUrl)) {
    finalUrl = trimmed.replace(/\/+$/, "") + "/api.php";
  }
  uni.setStorageSync(API_BASE_URL_KEY, finalUrl);
}

async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;

  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    setTimeout(() => processQueue(), 100);
    return;
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    setTimeout(
      () => processQueue(),
      MIN_REQUEST_INTERVAL - timeSinceLastRequest,
    );
    return;
  }

  isProcessingQueue = true;
  const { options, resolve, reject } = requestQueue.shift();

  try {
    activeRequests++;
    lastRequestTime = Date.now();
    const result = await executeRequest(options);
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    activeRequests--;
    isProcessingQueue = false;
    setTimeout(() => processQueue(), 50);
  }
}

function executeRequest(options) {
  const baseUrl = getApiBaseUrl();
  const {
    resource,
    action,
    data = {},
    method = "POST",
    skipCache = false,
    retryCount = 0,
  } = options;

  const cacheKey = `${resource}:${action}:${JSON.stringify(data)}`;

  if (!skipCache && retryCount === 0) {
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.time < CACHE_DURATION) {
      console.log("API 缓存命中:", cacheKey);
      return Promise.resolve(cached.data);
    }

    if (pendingRequests.has(cacheKey)) {
      console.log("API 请求合并:", cacheKey);
      return pendingRequests.get(cacheKey);
    }
  }

  const promise = new Promise((resolve, reject) => {
    const requestData = {
      resource,
      action,
      ...data,
    };

    console.log("API 请求:", {
      url: baseUrl,
      method,
      data: requestData,
      retryCount,
    });

    uni.request({
      url: baseUrl,
      method,
      data: requestData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      withCredentials: true,
      success: (res) => {
        console.log("API 响应:", res.statusCode, res.data);

        if (res.statusCode === 200) {
          const data = res.data;
          if (data && data.endpoints) {
            reject({ message: "API 请求失败，请检查网络连接" });
            return;
          }
          if (data && data.success) {
            if (!skipCache && retryCount === 0) {
              requestCache.set(cacheKey, { data, time: Date.now() });
            }
            resolve(data);
            return;
          }
          reject(
            data && typeof data === "object" ? data : { message: "请求失败" },
          );
          return;
        }
        if (res.statusCode === 401) {
          uni.removeStorageSync("userInfo");
          uni.removeStorageSync("isLoggedIn");
          reject({ message: "请先登录" });
          return;
        }
        if (res.statusCode === 429) {
          reject({ message: "请求过于频繁，请稍后再试", code: 429 });
          return;
        }
        const msg = (res.data && res.data.message) || res.data || "请求失败";
        reject({ message: typeof msg === "string" ? msg : "请求失败" });
      },
      fail: (err) => {
        console.log("API 请求失败:", err);
        reject({ message: err.errMsg || "网络错误，请检查网络连接" });
      },
      complete: () => {
        pendingRequests.delete(cacheKey);
      },
    });
  });

  if (!skipCache && retryCount === 0) {
    pendingRequests.set(cacheKey, promise);
  }

  return promise;
}

const request = (options) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      options,
      resolve,
      reject,
    });
    processQueue();
  });
};

const uploadFile = (filePath, onProgress) => {
  return executeUpload(filePath, onProgress);
};

const uploadAvatar = (filePath, onProgress) => {
  return executeUploadAvatar(filePath, onProgress);
};

function executeUpload(filePath, onProgress) {
  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: getApiBaseUrl(),
      filePath: filePath,
      name: "file",
      formData: {
        resource: "upload",
        action: "file",
      },
      withCredentials: true,
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data);
          if (data.success) {
            resolve(data);
          } else {
            reject(data);
          }
        } else {
          reject({ message: "上传失败" });
        }
      },
      fail: (err) => {
        reject({ message: "上传失败，请检查网络连接" });
      },
    });

    if (onProgress && typeof onProgress === "function") {
      uploadTask.onProgressUpdate((res) => {
        onProgress({
          progress: res.progress,
          totalBytesSent: res.totalBytesSent,
          totalBytesExpectedToSend: res.totalBytesExpectedToSend,
        });
      });
    }
  });
}

function executeUploadAvatar(filePath, onProgress) {
  return new Promise((resolve, reject) => {
    console.log("开始上传头像:", filePath);

    const userInfo = uni.getStorageSync("userInfo");
    const userId = userInfo ? userInfo.id : null;

    console.log("当前用户 ID:", userId);
    console.log("用户信息:", userInfo);

    const uploadTask = uni.uploadFile({
      url: getApiBaseUrl(),
      filePath: filePath,
      name: "avatar",
      formData: {
        resource: "avatar",
        action: "upload",
      },
      withCredentials: true,
      success: (res) => {
        console.log("=== 头像上传响应开始 ===");
        console.log("状态码:", res.statusCode);
        console.log("响应数据类型:", typeof res.data);
        console.log("响应数据:", res.data);

        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data);
            console.log("解析后的数据:", data);
            if (data.success) {
              console.log("头像上传成功:", data);
              resolve(data);
            } else {
              console.error("头像上传失败:", data);
              reject(data);
            }
          } catch (e) {
            console.error("解析响应失败:", e);
            console.error("原始响应字符串:", res.data);
            reject({ message: "服务器响应格式错误：" + e.message });
          }
        } else {
          console.error("头像上传 HTTP 错误:", res.statusCode);
          console.error("响应内容:", res.data);

          let errorMsg = `上传失败，状态码：${res.statusCode}`;
          try {
            const errorData = JSON.parse(res.data);
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch (e) {
            console.log("无法解析错误响应");
          }

          reject({ message: errorMsg });
        }
        console.log("=== 头像上传响应结束 ===");
      },
      fail: (err) => {
        console.error("=== 头像上传网络错误 ===");
        console.error("错误详情:", err);
        reject({ message: "上传失败，请检查网络连接" });
      },
    });

    if (onProgress && typeof onProgress === "function") {
      uploadTask.onProgressUpdate((res) => {
        console.log("上传进度:", res.progress);
        onProgress({
          progress: res.progress,
          totalBytesSent: res.totalBytesSent,
          totalBytesExpectedToSend: res.totalBytesExpectedToSend,
        });
      });
    }
  });
}

const auth = {
  login: (email, password) => {
    return request({
      resource: "auth",
      action: "login",
      data: { email, password },
      skipCache: true,
    });
  },

  register: (username, email, password, phone = "", smsCode = "") => {
    return request({
      resource: "auth",
      action: "register",
      data: { username, email, password, phone, sms_code: smsCode },
      skipCache: true,
    });
  },

  logout: () => {
    return request({
      resource: "auth",
      action: "logout",
      skipCache: true,
    });
  },
};

const sms = {
  send: (phone) => {
    return request({
      resource: "sms",
      action: "send",
      data: { phone },
      skipCache: true,
    });
  },

  verify: (phone, code) => {
    return request({
      resource: "sms",
      action: "verify",
      data: { phone, code },
      skipCache: true,
    });
  },
};

const user = {
  getInfo: (userId) => {
    return request({
      resource: "user",
      action: "get_info",
      data: userId ? { user_id: userId } : {},
    });
  },

  updateInfo: (data) => {
    return request({
      resource: "user",
      action: "update_info",
      data,
      skipCache: true,
    });
  },

  uploadAvatar: (filePath, onProgress) => {
    return uploadAvatar(filePath, onProgress);
  },

  search: (keyword) => {
    return request({
      resource: "user",
      action: "search",
      data: { q: keyword },
    });
  },
};

const friends = {
  list: () => {
    return request({
      resource: "friends",
      action: "list",
    });
  },

  sendRequest: (friendId) => {
    return request({
      resource: "friends",
      action: "send_request",
      data: { friend_id: friendId },
      skipCache: true,
    });
  },

  getRequests: () => {
    return request({
      resource: "friends",
      action: "get_requests",
    });
  },

  acceptRequest: (requestId) => {
    return request({
      resource: "friends",
      action: "accept_request",
      data: { request_id: requestId },
      skipCache: true,
    });
  },

  rejectRequest: (requestId) => {
    return request({
      resource: "friends",
      action: "reject_request",
      data: { request_id: requestId },
      skipCache: true,
    });
  },
};

const messages = {
  history: (friendId, limit = 5000) => {
    return request({
      resource: "messages",
      action: "history",
      data: { friend_id: friendId, limit },
    });
  },

  send: (receiverId, content) => {
    return request({
      resource: "messages",
      action: "send",
      data: { receiver_id: receiverId, content },
      skipCache: true,
    });
  },

  sendFile: (receiverId, fileInfo) => {
    return request({
      resource: "messages",
      action: "send_file",
      data: {
        receiver_id: receiverId,
        file_path: fileInfo.file_path,
        file_name: fileInfo.file_name,
        file_size: fileInfo.file_size,
        file_type: fileInfo.file_type,
        audio_duration: fileInfo.audio_duration,
        video_duration: fileInfo.video_duration,
        video_cover: fileInfo.video_cover,
      },
      skipCache: true,
    });
  },

  recall: (messageId) => {
    return request({
      resource: "messages",
      action: "recall",
      data: { message_id: messageId },
      skipCache: true,
    });
  },

  delete: (messageId) => {
    return request({
      resource: "messages",
      action: "delete",
      data: { message_id: messageId },
      skipCache: true,
    });
  },

  poll: (lastTime, chatType, chatId) => {
    return request({
      resource: "messages",
      action: "poll",
      data: { last_time: lastTime, chat_type: chatType, chat_id: chatId },
      skipCache: true,
    });
  },
};

const groups = {
  list: () => {
    return request({
      resource: "groups",
      action: "list",
    });
  },

  create: (name, memberIds = []) => {
    return request({
      resource: "groups",
      action: "create",
      data: { name, member_ids: memberIds },
      skipCache: true,
    });
  },

  members: (groupId) => {
    return request({
      resource: "groups",
      action: "members",
      data: { group_id: groupId },
    });
  },

  addMembers: (groupId, memberIds) => {
    return request({
      resource: "groups",
      action: "add_members",
      data: { group_id: groupId, member_ids: memberIds },
      skipCache: true,
    });
  },

  messages: (groupId, limit = 5000) => {
    return request({
      resource: "groups",
      action: "messages",
      data: { group_id: groupId, limit },
    });
  },

  sendMessage: (groupId, content) => {
    return request({
      resource: "groups",
      action: "send_message",
      data: { group_id: groupId, content },
      skipCache: true,
    });
  },

  sendFile: (groupId, fileInfo) => {
    return request({
      resource: "groups",
      action: "send_file",
      data: {
        group_id: groupId,
        file_path: fileInfo.file_path,
        file_name: fileInfo.file_name,
        file_size: fileInfo.file_size,
        file_type: fileInfo.file_type,
        audio_duration: fileInfo.audio_duration,
        video_duration: fileInfo.video_duration,
        video_cover: fileInfo.video_cover,
      },
      skipCache: true,
    });
  },

  leave: (groupId) => {
    return request({
      resource: "groups",
      action: "leave",
      data: { group_id: groupId },
      skipCache: true,
    });
  },

  recall: (messageId) => {
    return request({
      resource: "groups",
      action: "recall",
      data: { message_id: messageId },
      skipCache: true,
    });
  },

  deleteMessage: (messageId) => {
    return request({
      resource: "groups",
      action: "delete_message",
      data: { message_id: messageId },
      skipCache: true,
    });
  },
};

const scanLogin = {
  scan: (qid) => {
    return request({
      resource: "scan_login",
      action: "scan",
      data: { qid },
      skipCache: true,
    });
  },

  confirm: (qid, vkey) => {
    return request({
      resource: "scan_login",
      action: "confirm",
      data: { qid, vkey },
      skipCache: true,
    });
  },

  reject: (qid) => {
    return request({
      resource: "scan_login",
      action: "reject",
      data: { qid },
      skipCache: true,
    });
  },

  getIp: (qid) => {
    return request({
      resource: "scan_login",
      action: "get_ip",
      data: { qid },
      skipCache: true,
    });
  },
};

const vkey = {
  generate: (userId) => {
    return request({
      resource: "vkey",
      action: "generate",
      data: { user_id: userId },
      skipCache: true,
    });
  },

  get: (userId) => {
    return request({
      resource: "vkey",
      action: "get",
      data: { user_id: userId },
      skipCache: true,
    });
  },
};

export default {
  auth,
  sms,
  user,
  friends,
  messages,
  groups,
  scanLogin,
  vkey,
  uploadFile,
};
