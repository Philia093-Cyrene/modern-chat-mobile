import themesConfig from './themes.js'

const THEME_KEY = 'app_theme_mode'
const COLOR_THEME_KEY = 'app_color_theme'

const THEME_LIGHT = 'light'
const THEME_DARK = 'dark'

function getTheme() {
	try {
		const saved = uni.getStorageSync(THEME_KEY)
		if (saved === THEME_DARK || saved === THEME_LIGHT) return saved
		return THEME_LIGHT
	} catch (e) {
		return THEME_LIGHT
	}
}

function setTheme(mode) {
	try {
		uni.setStorageSync(THEME_KEY, mode)
		return true
	} catch (e) {
		return false
	}
}

function isDark() {
	return getTheme() === THEME_DARK
}

function getColorTheme() {
	try {
		const saved = uni.getStorageSync(COLOR_THEME_KEY)
		if (saved && themesConfig.THEMES[saved]) return saved
		return 'default-blue'
	} catch (e) {
		return 'default-blue'
	}
}

function setColorTheme(themeId) {
	try {
		if (!themesConfig.THEMES[themeId]) {
			themeId = 'default-blue'
		}
		uni.setStorageSync(COLOR_THEME_KEY, themeId)
		return true
	} catch (e) {
		return false
	}
}

function getCurrentThemeColors() {
	const colorThemeId = getColorTheme()
	const theme = themesConfig.getThemeById(colorThemeId)
	const mode = getTheme()
	return theme[mode] || theme.light
}

function getThemeList() {
	return themesConfig.getThemeList()
}

function getThemeById(themeId) {
	return themesConfig.getThemeById(themeId)
}

function getThemesByCategory() {
	return themesConfig.getThemesByCategory()
}

export default {
	THEME_LIGHT,
	THEME_DARK,
	getTheme,
	setTheme,
	isDark,
	getColorTheme,
	setColorTheme,
	getCurrentThemeColors,
	getThemeList,
	getThemeById,
	getThemesByCategory
}
