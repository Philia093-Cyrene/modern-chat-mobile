import fontsConfig from './fonts.js'

const STORAGE_KEY = 'app_font'

let currentFont = 'system-default'
let loadedFonts = new Set(['system-default'])

function init() {
	const savedFont = uni.getStorageSync(STORAGE_KEY)
	if (savedFont && fontsConfig.FONTS[savedFont]) {
		currentFont = savedFont
	}
	return currentFont
}

function getFont() {
	return currentFont
}

function setFont(fontId) {
	const font = fontsConfig.getFontById(fontId)
	if (font) {
		currentFont = fontId
		uni.setStorageSync(STORAGE_KEY, fontId)
		loadFont(fontId)
		return true
	}
	return false
}

function getFontFamily() {
	const font = fontsConfig.getFontById(currentFont)
	return font.family
}

function loadFont(fontId) {
	if (loadedFonts.has(fontId)) return Promise.resolve()
	
	const font = fontsConfig.getFontById(fontId)
	if (!font || !font.googleFont) return Promise.resolve()
	
	return new Promise((resolve, reject) => {
		// #ifdef H5
		const link = document.createElement('link')
		link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`
		link.rel = 'stylesheet'
		link.onload = () => {
			loadedFonts.add(fontId)
			resolve()
		}
		link.onerror = reject
		document.head.appendChild(link)
		// #endif
		
		// #ifndef H5
		loadedFonts.add(fontId)
		resolve()
		// #endif
	})
}

function preloadFonts(fontIds) {
	const promises = fontIds.map(id => loadFont(id))
	return Promise.allSettled(promises)
}

function getFontList() {
	return fontsConfig.getFontList()
}

function getFontsByCategory() {
	return fontsConfig.getFontsByCategory()
}

function getFontById(fontId) {
	return fontsConfig.getFontById(fontId)
}

function getDefaultFont() {
	return fontsConfig.getDefaultFont()
}

function applyFont(element) {
	// #ifdef H5
	const font = fontsConfig.getFontById(currentFont)
	if (element && element.style) {
		element.style.fontFamily = font.family
	}
	// #endif
}

function getFontStyle() {
	const font = fontsConfig.getFontById(currentFont)
	return `font-family: ${font.family};`
}

export default {
	init,
	getFont,
	setFont,
	getFontFamily,
	loadFont,
	preloadFonts,
	getFontList,
	getFontsByCategory,
	getFontById,
	getDefaultFont,
	applyFont,
	getFontStyle
}
