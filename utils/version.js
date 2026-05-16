export const APP_VERSION = 'V0.7.8'
export const APP_VERSION_CODE = 78

export const RELEASE_NOTES = {
	'V0.7.8': {
		title: 'V0.7.8 更新内容',
		items: [
			'新增调色盘功能 - 支持120+种主题配色，17个分类',
			'新增字体库功能 - 支持200+种字体，8个分类',
			'新增中文艺术字体 - 站酷系列、书法系列等100+种',
			'主题支持明暗模式切换',
			'字体实时预览和动态加载',
			'优化扫码登录功能 - 新增拍照扫描模式，支持黑底二维码识别',
			'优化了UI交互体验'
		]
	},
	'V0.7.7': {
		title: 'V0.7.7 更新内容',
		items: [
			'新增扫码登录网页端功能 - 支持APP扫描二维码登录网页版',
			'添加了手机号验证',
			'优化了交互逻辑',
			'修复了一些已知问题'
		]
	}
}

export function getReleaseNote( version ) {
	if (RELEASE_NOTES[version]) {
		return RELEASE_NOTES[version]
	}
	return {
		title: '更新内容',
		items: [
			'本次更新带来了新的功能和优化，快去体验吧！'
		]
	}
}
