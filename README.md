# Modern Chat (UniApp)

基于 UniApp 的现代化聊天应用，支持多端部署（微信小程序、App、H5）。

## 功能特性

- 📱 **跨平台支持** - 一套代码，多端运行（微信小程序、iOS、Android、H5）
- 🔐 **用户登录** - 安全的用户认证系统
- 💬 **实时聊天** - 即时消息发送与接收
- 📹 **视频通话** - 基于 Agora SDK 的音视频通话
- 🎨 **精美界面** - 现代化的 UI 设计

## 技术栈

- **框架**: UniApp (Vue 3)
- **UI**: UniApp Components
- **音视频**: Agora RTC SDK NG
- **二维码**: jsQR

## 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- HBuilderX (推荐用于开发和构建)

### 安装依赖

```bash
npm install
```

或使用 pnpm：

```bash
pnpm install
```

### 开发运行

**方式一：使用 HBuilderX**

1. 打开 HBuilderX
2. 导入项目
3. 点击工具栏的"运行"按钮，选择运行目标

**方式二：命令行**

```bash
# 开发模式
npm run dev:h5
npm run dev:mp-weixin

# 构建生产版本
npm run build:h5
npm run build:mp-weixin
```

## 项目结构

```
modernchat-app-main/
├── components/           # 自定义组件
│   └── VideoPlayer/      # 视频播放器组件
├── pages/               # 页面
│   ├── login/           # 登录页面
│   └── chat/            # 聊天页面
├── static/              # 静态资源
│   ├── icons/           # 图标文件
│   └── logo.*           # 应用图标
├── store/               # 状态管理
│   └── user.js          # 用户状态
├── utils/               # 工具函数
│   ├── api.js           # API 接口
│   ├── cache.js         # 缓存工具
│   ├── theme.js         # 主题配置
│   ├── font.js          # 字体工具
│   └── videoCache.js    # 视频缓存
├── App.vue              # 应用入口
├── main.js              # 主入口文件
├── manifest.json        # 应用配置
├── pages.json           # 页面路由配置
├── uni.scss             # 全局样式变量
└── package.json         # 项目配置
```

## 页面说明

| 页面 | 路径 | 说明 |
|------|------|------|
| 登录页 | `pages/login/login` | 用户登录入口 |
| 聊天页 | `pages/chat/chat` | 主聊天界面 |

## API 接口

### 用户相关

- `POST /api/user/login` - 用户登录
- `POST /api/user/logout` - 用户退出
- `GET /api/user/info` - 获取用户信息

### 聊天相关

- `GET /api/chat/list` - 获取聊天列表
- `GET /api/chat/messages` - 获取消息列表
- `POST /api/chat/send` - 发送消息

## 配置说明

### manifest.json

主要配置项：
- `name` - 应用名称
- `appid` - 应用标识
- `description` - 应用描述
- `versionName` - 版本名称
- `versionCode` - 版本号

### pages.json

配置页面路由和全局样式：
- `pages` - 页面数组
- `globalStyle` - 全局样式配置

## 许可证

MIT License

## 作者

Modern Chat Team