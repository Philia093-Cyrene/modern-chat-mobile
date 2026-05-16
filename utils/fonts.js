const FONTS = {
	'system-default': {
		id: 'system-default',
		name: '系统默认',
		description: '使用系统默认字体',
		category: 'system',
		family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		googleFont: null
	},
	'roboto': {
		id: 'roboto',
		name: 'Roboto',
		description: '现代无衬线字体',
		category: 'sans-serif',
		family: '"Roboto", sans-serif',
		googleFont: 'Roboto:wght@300;400;500;700'
	},
	'open-sans': {
		id: 'open-sans',
		name: 'Open Sans',
		description: '清晰易读的无衬线字体',
		category: 'sans-serif',
		family: '"Open Sans", sans-serif',
		googleFont: 'Open+Sans:wght@300;400;500;600;700'
	},
	'lato': {
		id: 'lato',
		name: 'Lato',
		description: '温暖友好的无衬线字体',
		category: 'sans-serif',
		family: '"Lato", sans-serif',
		googleFont: 'Lato:wght@300;400;700;900'
	},
	'montserrat': {
		id: 'montserrat',
		name: 'Montserrat',
		description: '几何风格无衬线字体',
		category: 'sans-serif',
		family: '"Montserrat", sans-serif',
		googleFont: 'Montserrat:wght@300;400;500;600;700;800'
	},
	'poppins': {
		id: 'poppins',
		name: 'Poppins',
		description: '几何圆形无衬线字体',
		category: 'sans-serif',
		family: '"Poppins", sans-serif',
		googleFont: 'Poppins:wght@300;400;500;600;700'
	},
	'inter': {
		id: 'inter',
		name: 'Inter',
		description: '专为屏幕设计',
		category: 'sans-serif',
		family: '"Inter", sans-serif',
		googleFont: 'Inter:wght@300;400;500;600;700'
	},
	'nunito': {
		id: 'nunito',
		name: 'Nunito',
		description: '圆润友好的无衬线字体',
		category: 'sans-serif',
		family: '"Nunito", sans-serif',
		googleFont: 'Nunito:wght@300;400;600;700;800'
	},
	'source-sans-pro': {
		id: 'source-sans-pro',
		name: 'Source Sans Pro',
		description: 'Adobe开源无衬线字体',
		category: 'sans-serif',
		family: '"Source Sans Pro", sans-serif',
		googleFont: 'Source+Sans_Pro:wght@300;400;600;700'
	},
	'work-sans': {
		id: 'work-sans',
		name: 'Work Sans',
		description: '现代几何无衬线字体',
		category: 'sans-serif',
		family: '"Work Sans", sans-serif',
		googleFont: 'Work_Sans:wght@300;400;500;600;700'
	},
	'raleway': {
		id: 'raleway',
		name: 'Raleway',
		description: '优雅细长无衬线字体',
		category: 'sans-serif',
		family: '"Raleway", sans-serif',
		googleFont: 'Raleway:wght@300;400;500;600;700'
	},
	'quicksand': {
		id: 'quicksand',
		name: 'Quicksand',
		description: '圆润几何无衬线字体',
		category: 'sans-serif',
		family: '"Quicksand", sans-serif',
		googleFont: 'Quicksand:wght@300;400;500;600;700'
	},
	'ubuntu': {
		id: 'ubuntu',
		name: 'Ubuntu',
		description: 'Ubuntu系统字体',
		category: 'sans-serif',
		family: '"Ubuntu", sans-serif',
		googleFont: 'Ubuntu:wght@300;400;500;700'
	},
	'rubik': {
		id: 'rubik',
		name: 'Rubik',
		description: '略带圆角的无衬线字体',
		category: 'sans-serif',
		family: '"Rubik", sans-serif',
		googleFont: 'Rubik:wght@300;400;500;600;700'
	},
	'karla': {
		id: 'karla',
		name: 'Karla',
		description: '支持多种语言的无衬线字体',
		category: 'sans-serif',
		family: '"Karla", sans-serif',
		googleFont: 'Karla:wght@300;400;500;600;700'
	},
	'ibm-plex-sans': {
		id: 'ibm-plex-sans',
		name: 'IBM Plex Sans',
		description: 'IBM企业级无衬线字体',
		category: 'sans-serif',
		family: '"IBM Plex Sans", sans-serif',
		googleFont: 'IBM_Plex_Sans:wght@300;400;500;600;700'
	},
	'noto-sans': {
		id: 'noto-sans',
		name: 'Noto Sans',
		description: 'Google多语言无衬线字体',
		category: 'sans-serif',
		family: '"Noto Sans", sans-serif',
		googleFont: 'Noto_Sans:wght@300;400;500;600;700'
	},
	'fira-sans': {
		id: 'fira-sans',
		name: 'Fira Sans',
		description: 'Mozilla开源无衬线字体',
		category: 'sans-serif',
		family: '"Fira Sans", sans-serif',
		googleFont: 'Fira_Sans:wght@300;400;500;600;700'
	},
	'mulish': {
		id: 'mulish',
		name: 'Mulish',
		description: '极简风格无衬线字体',
		category: 'sans-serif',
		family: '"Mulish", sans-serif',
		googleFont: 'Mulish:wght@300;400;500;600;700'
	},
	'josefin-sans': {
		id: 'josefin-sans',
		name: 'Josefin Sans',
		description: '几何复古无衬线字体',
		category: 'sans-serif',
		family: '"Josefin Sans", sans-serif',
		googleFont: 'Josefin_Sans:wght@300;400;500;600;700'
	},
	'barlow': {
		id: 'barlow',
		name: 'Barlow',
		description: '紧凑现代无衬线字体',
		category: 'sans-serif',
		family: '"Barlow", sans-serif',
		googleFont: 'Barlow:wght@300;400;500;600;700'
	},
	'cabin': {
		id: 'cabin',
		name: 'Cabin',
		description: '人文风格无衬线字体',
		category: 'sans-serif',
		family: '"Cabin", sans-serif',
		googleFont: 'Cabin:wght@400;500;600;700'
	},
	'mukta': {
		id: 'mukta',
		name: 'Mukta',
		description: '简洁现代无衬线字体',
		category: 'sans-serif',
		family: '"Mukta", sans-serif',
		googleFont: 'Mukta:wght@300;400;500;600;700'
	},
	'archivo': {
		id: 'archivo',
		name: 'Archivo',
		description: '复古现代无衬线字体',
		category: 'sans-serif',
		family: '"Archivo", sans-serif',
		googleFont: 'Archivo:wght@300;400;500;600;700'
	},
	'archivo-narrow': {
		id: 'archivo-narrow',
		name: 'Archivo Narrow',
		description: '紧凑复古无衬线字体',
		category: 'sans-serif',
		family: '"Archivo Narrow", sans-serif',
		googleFont: 'Archivo_Narrow:wght@400;500;600;700'
	},
	'titillium-web': {
		id: 'titillium-web',
		name: 'Titillium Web',
		description: '现代几何无衬线字体',
		category: 'sans-serif',
		family: '"Titillium Web", sans-serif',
		googleFont: 'Titillium_Web:wght@300;400;600;700'
	},
	'catamaran': {
		id: 'catamaran',
		name: 'Catamaran',
		description: '圆润几何无衬线字体',
		category: 'sans-serif',
		family: '"Catamaran", sans-serif',
		googleFont: 'Catamaran:wght@300;400;500;600;700'
	},
	'hind': {
		id: 'hind',
		name: 'Hind',
		description: '清晰现代无衬线字体',
		category: 'sans-serif',
		family: '"Hind", sans-serif',
		googleFont: 'Hind:wght@300;400;500;600;700'
	},
	'hind-siliguri': {
		id: 'hind-siliguri',
		name: 'Hind Siliguri',
		description: '孟加拉语友好字体',
		category: 'sans-serif',
		family: '"Hind Siliguri", sans-serif',
		googleFont: 'Hind_Siliguri:wght@300;400;500;600;700'
	},
	'merriweather': {
		id: 'merriweather',
		name: 'Merriweather',
		description: '屏幕优化的衬线字体',
		category: 'serif',
		family: '"Merriweather", serif',
		googleFont: 'Merriweather:wght@300;400;700;900'
	},
	'playfair-display': {
		id: 'playfair-display',
		name: 'Playfair Display',
		description: '优雅高对比衬线字体',
		category: 'serif',
		family: '"Playfair Display", serif',
		googleFont: 'Playfair_Display:wght@400;500;600;700;800;900'
	},
	'lora': {
		id: 'lora',
		name: 'Lora',
		description: '当代衬线字体',
		category: 'serif',
		family: '"Lora", serif',
		googleFont: 'Lora:wght@400;500;600;700'
	},
	'libre-baskerville': {
		id: 'libre-baskerville',
		name: 'Libre Baskerville',
		description: '经典衬线字体',
		category: 'serif',
		family: '"Libre Baskerville", serif',
		googleFont: 'Libre_Baskerville:wght@400;700'
	},
	'source-serif-pro': {
		id: 'source-serif-pro',
		name: 'Source Serif Pro',
		description: 'Adobe开源衬线字体',
		category: 'serif',
		family: '"Source Serif Pro", serif',
		googleFont: 'Source_Serif_Pro:wght@300;400;600;700'
	},
	'crimson-text': {
		id: 'crimson-text',
		name: 'Crimson Text',
		description: '经典书籍衬线字体',
		category: 'serif',
		family: '"Crimson Text", serif',
		googleFont: 'Crimson_Text:wght@400;600;700'
	},
	'eb-garamond': {
		id: 'eb-garamond',
		name: 'EB Garamond',
		description: '复古经典衬线字体',
		category: 'serif',
		family: '"EB Garamond", serif',
		googleFont: 'EB_Garamond:wght@400;500;600;700'
	},
	'libre-caslon-text': {
		id: 'libre-caslon-text',
		name: 'Libre Caslon Text',
		description: '经典Caslon衬线字体',
		category: 'serif',
		family: '"Libre Caslon Text", serif',
		googleFont: 'Libre_Caslon_Text:wght@400;700'
	},
	'spectral': {
		id: 'spectral',
		name: 'Spectral',
		description: '屏幕优化的衬线字体',
		category: 'serif',
		family: '"Spectral", serif',
		googleFont: 'Spectral:wght@300;400;500;600;700'
	},
	'cardo': {
		id: 'cardo',
		name: 'Cardo',
		description: '学术风格衬线字体',
		category: 'serif',
		family: '"Cardo", serif',
		googleFont: 'Cardo:wght@400;700'
	},
	'alegreya': {
		id: 'alegreya',
		name: 'Alegreya',
		description: '文学杂志风格衬线字体',
		category: 'serif',
		family: '"Alegreya", serif',
		googleFont: 'Alegreya:wght@400;500;600;700;800;900'
	},
	'vollkorn': {
		id: 'vollkorn',
		name: 'Vollkorn',
		description: '经典厚重衬线字体',
		category: 'serif',
		family: '"Vollkorn", serif',
		googleFont: 'Vollkorn:wght@400;500;600;700;800;900'
	},
	'cormorant': {
		id: 'cormorant',
		name: 'Cormorant',
		description: '优雅展示衬线字体',
		category: 'serif',
		family: '"Cormorant", serif',
		googleFont: 'Cormorant:wght@300;400;500;600;700'
	},
	'noto-serif': {
		id: 'noto-serif',
		name: 'Noto Serif',
		description: 'Google多语言衬线字体',
		category: 'serif',
		family: '"Noto Serif", serif',
		googleFont: 'Noto_Serif:wght@400;500;600;700'
	},
	'slabo': {
		id: 'slabo',
		name: 'Slabo',
		description: '稳健的Slab衬线字体',
		category: 'serif',
		family: '"Slabo 27px", serif',
		googleFont: 'Slabo_27px'
	},
	'bitter': {
		id: 'bitter',
		name: 'Bitter',
		description: '现代Slab衬线字体',
		category: 'serif',
		family: '"Bitter", serif',
		googleFont: 'Bitter:wght@300;400;700'
	},
	'arvo': {
		id: 'arvo',
		name: 'Arvo',
		description: '几何Slab衬线字体',
		category: 'serif',
		family: '"Arvo", serif',
		googleFont: 'Arvo:wght@400;700'
	},
	'roboto-slab': {
		id: 'roboto-slab',
		name: 'Roboto Slab',
		description: 'Roboto的Slab版本',
		category: 'serif',
		family: '"Roboto Slab", serif',
		googleFont: 'Roboto_Slab:wght@300;400;500;600;700'
	},
	'zilla-slab': {
		id: 'zilla-slab',
		name: 'Zilla Slab',
		description: 'Mozilla的Slab字体',
		category: 'serif',
		family: '"Zilla Slab", serif',
		googleFont: 'Zilla_Slab:wght@300;400;500;600;700'
	},
	'ibm-plex-serif': {
		id: 'ibm-plex-serif',
		name: 'IBM Plex Serif',
		description: 'IBM企业级衬线字体',
		category: 'serif',
		family: '"IBM Plex Serif", serif',
		googleFont: 'IBM_Plex_Serif:wght@300;400;500;600;700'
	},
	'courgette': {
		id: 'courgette',
		name: 'Courgette',
		description: '优雅手写字体',
		category: 'handwriting',
		family: '"Courgette", cursive',
		googleFont: 'Courgette'
	},
	'dancing-script': {
		id: 'dancing-script',
		name: 'Dancing Script',
		description: '活泼手写字体',
		category: 'handwriting',
		family: '"Dancing Script", cursive',
		googleFont: 'Dancing_Script:wght@400;500;600;700'
	},
	'pacifico': {
		id: 'pacifico',
		name: 'Pacifico',
		description: '复古手写字体',
		category: 'handwriting',
		family: '"Pacifico", cursive',
		googleFont: 'Pacifico'
	},
	'satisfy': {
		id: 'satisfy',
		name: 'Satisfy',
		description: '优雅签名字体',
		category: 'handwriting',
		family: '"Satisfy", cursive',
		googleFont: 'Satisfy'
	},
	'great-vibes': {
		id: 'great-vibes',
		name: 'Great Vibes',
		description: '华丽书法字体',
		category: 'handwriting',
		family: '"Great Vibes", cursive',
		googleFont: 'Great_Vibes'
	},
	'kaushan-script': {
		id: 'kaushan-script',
		name: 'Kaushan Script',
		description: '毛笔风格字体',
		category: 'handwriting',
		family: '"Kaushan Script", cursive',
		googleFont: 'Kaushan_Script'
	},
	'sacramento': {
		id: 'sacramento',
		name: 'Sacramento',
		description: '优雅连笔字体',
		category: 'handwriting',
		family: '"Sacramento", cursive',
		googleFont: 'Sacramento'
	},
	'cookie': {
		id: 'cookie',
		name: 'Cookie',
		description: '复古手写字体',
		category: 'handwriting',
		family: '"Cookie", cursive',
		googleFont: 'Cookie'
	},
	'shadows-into-light': {
		id: 'shadows-into-light',
		name: 'Shadows Into Light',
		description: '手写笔记风格',
		category: 'handwriting',
		family: '"Shadows Into Light", cursive',
		googleFont: 'Shadows_Into_Light'
	},
	'indie-flower': {
		id: 'indie-flower',
		name: 'Indie Flower',
		description: '可爱手写字体',
		category: 'handwriting',
		family: '"Indie Flower", cursive',
		googleFont: 'Indie_Flower'
	},
	'architects-daughter': {
		id: 'architects-daughter',
		name: "Architects Daughter",
		description: '建筑手写风格',
		category: 'handwriting',
		family: '"Architects Daughter", cursive',
		googleFont: 'Architects_Daughter'
	},
	'patrick-hand': {
		id: 'patrick-hand',
		name: 'Patrick Hand',
		description: '友好手写字体',
		category: 'handwriting',
		family: '"Patrick Hand", cursive',
		googleFont: 'Patrick_Hand'
	},
	'caveat': {
		id: 'caveat',
		name: 'Caveat',
		description: '自然手写字体',
		category: 'handwriting',
		family: '"Caveat", cursive',
		googleFont: 'Caveat:wght@400;500;600;700'
	},
	'kalam': {
		id: 'kalam',
		name: 'Kalam',
		description: '印度手写风格',
		category: 'handwriting',
		family: '"Kalam", cursive',
		googleFont: 'Kalam:wght@300;400;700'
	},
	'handlee': {
		id: 'handlee',
		name: 'Handlee',
		description: '随意手写字体',
		category: 'handwriting',
		family: '"Handlee", cursive',
		googleFont: 'Handlee'
	},
	'gloria-hallelujah': {
		id: 'gloria-hallelujah',
		name: 'Gloria Hallelujah',
		description: '有趣手写字体',
		category: 'handwriting',
		family: '"Gloria Hallelujah", cursive',
		googleFont: 'Gloria_Hallelujah'
	},
	'rock-salt': {
		id: 'rock-salt',
		name: 'Rock Salt',
		description: '粗犷手写字体',
		category: 'handwriting',
		family: '"Rock Salt", cursive',
		googleFont: 'Rock_Salt'
	},
	'homemade-apple': {
		id: 'homemade-apple',
		name: 'Homemade Apple',
		description: '家庭手写字体',
		category: 'handwriting',
		family: '"Homemade Apple", cursive',
		googleFont: 'Homemade_Apple'
	},
	'special-elite': {
		id: 'special-elite',
		name: 'Special Elite',
		description: '打字机风格字体',
		category: 'handwriting',
		family: '"Special Elite", cursive',
		googleFont: 'Special_Elite'
	},
	'permanent-marker': {
		id: 'permanent-marker',
		name: 'Permanent Marker',
		description: '马克笔风格字体',
		category: 'handwriting',
		family: '"Permanent Marker", cursive',
		googleFont: 'Permanent_Marker'
	},
	'covered-by-your-grace': {
		id: 'covered-by-your-grace',
		name: 'Covered By Your Grace',
		description: '优雅手写字体',
		category: 'handwriting',
		family: '"Covered By Your Grace", cursive',
		googleFont: 'Covered_By_Your_Grace'
	},
	'ubuntu-mono': {
		id: 'ubuntu-mono',
		name: 'Ubuntu Mono',
		description: 'Ubuntu等宽字体',
		category: 'monospace',
		family: '"Ubuntu Mono", monospace',
		googleFont: 'Ubuntu_Mono:wght@400;700'
	},
	'fira-code': {
		id: 'fira-code',
		name: 'Fira Code',
		description: '编程连字等宽字体',
		category: 'monospace',
		family: '"Fira Code", monospace',
		googleFont: 'Fira_Code:wght@300;400;500;600;700'
	},
	'source-code-pro': {
		id: 'source-code-pro',
		name: 'Source Code Pro',
		description: 'Adobe开源等宽字体',
		category: 'monospace',
		family: '"Source Code Pro", monospace',
		googleFont: 'Source_Code_Pro:wght@300;400;500;600;700'
	},
	'jetbrains-mono': {
		id: 'jetbrains-mono',
		name: 'JetBrains Mono',
		description: 'JetBrains编程字体',
		category: 'monospace',
		family: '"JetBrains Mono", monospace',
		googleFont: 'JetBrains_Mono:wght@300;400;500;600;700'
	},
	'inconsolata': {
		id: 'inconsolata',
		name: 'Inconsolata',
		description: '经典等宽字体',
		category: 'monospace',
		family: '"Inconsolata", monospace',
		googleFont: 'Inconsolata:wght@300;400;500;600;700'
	},
	'roboto-mono': {
		id: 'roboto-mono',
		name: 'Roboto Mono',
		description: 'Roboto等宽字体',
		category: 'monospace',
		family: '"Roboto Mono", monospace',
		googleFont: 'Roboto_Mono:wght@300;400;500;600;700'
	},
	'space-mono': {
		id: 'space-mono',
		name: 'Space Mono',
		description: '复古等宽字体',
		category: 'monospace',
		family: '"Space Mono", monospace',
		googleFont: 'Space_Mono:wght@400;700'
	},
	'ibm-plex-mono': {
		id: 'ibm-plex-mono',
		name: 'IBM Plex Mono',
		description: 'IBM企业级等宽字体',
		category: 'monospace',
		family: '"IBM Plex Mono", monospace',
		googleFont: 'IBM_Plex_Mono:wght@300;400;500;600;700'
	},
	'pt-mono': {
		id: 'pt-mono',
		name: 'PT Mono',
		description: 'PT等宽字体',
		category: 'monospace',
		family: '"PT Mono", monospace',
		googleFont: 'PT_Mono'
	},
	'noto-sans-mono': {
		id: 'noto-sans-mono',
		name: 'Noto Sans Mono',
		description: 'Google等宽字体',
		category: 'monospace',
		family: '"Noto Sans Mono", monospace',
		googleFont: 'Noto_Sans_Mono:wght@300;400;500;600;700'
	},
	'oswald': {
		id: 'oswald',
		name: 'Oswald',
		description: '紧凑展示字体',
		category: 'display',
		family: '"Oswald", sans-serif',
		googleFont: 'Oswald:wght@300;400;500;600;700'
	},
	'bebas-neue': {
		id: 'bebas-neue',
		name: 'Bebas Neue',
		description: '全大写展示字体',
		category: 'display',
		family: '"Bebas Neue", sans-serif',
		googleFont: 'Bebas_Neue'
	},
	'anton': {
		id: 'anton',
		name: 'Anton',
		description: '粗体展示字体',
		category: 'display',
		family: '"Anton", sans-serif',
		googleFont: 'Anton'
	},
	'righteous': {
		id: 'righteous',
		name: 'Righteous',
		description: '复古展示字体',
		category: 'display',
		family: '"Righteous", sans-serif',
		googleFont: 'Righteous'
	},
	'bangers': {
		id: 'bangers',
		name: 'Bangers',
		description: '漫画风格字体',
		category: 'display',
		family: '"Bangers", cursive',
		googleFont: 'Bangers'
	},
	'bungee': {
		id: 'bungee',
		name: 'Bungee',
		description: '城市展示字体',
		category: 'display',
		family: '"Bungee", cursive',
		googleFont: 'Bungee'
	},
	'alfa-slab-one': {
		id: 'alfa-slab-one',
		name: 'Alfa Slab One',
		description: '厚重Slab展示字体',
		category: 'display',
		family: '"Alfa Slab One", serif',
		googleFont: 'Alfa_Slab_One'
	},
	'passion-one': {
		id: 'passion-one',
		name: 'Passion One',
		description: '热情展示字体',
		category: 'display',
		family: '"Passion One", cursive',
		googleFont: 'Passion_One:wght@400;700;900'
	},
	'fredoka-one': {
		id: 'fredoka-one',
		name: 'Fredoka One',
		description: '圆润展示字体',
		category: 'display',
		family: '"Fredoka One", cursive',
		googleFont: 'Fredoka_One'
	},
	'lobster': {
		id: 'lobster',
		name: 'Lobster',
		description: '经典展示字体',
		category: 'display',
		family: '"Lobster", cursive',
		googleFont: 'Lobster'
	},
	'lobster-two': {
		id: 'lobster-two',
		name: 'Lobster Two',
		description: 'Lobster变体字体',
		category: 'display',
		family: '"Lobster Two", cursive',
		googleFont: 'Lobster_Two:wght@400;700'
	},
	'comfortaa': {
		id: 'comfortaa',
		name: 'Comfortaa',
		description: '圆润几何字体',
		category: 'display',
		family: '"Comfortaa", cursive',
		googleFont: 'Comfortaa:wght@300;400;500;600;700'
	},
	'poiret-one': {
		id: 'poiret-one',
		name: 'Poiret One',
		description: '艺术装饰字体',
		category: 'display',
		family: '"Poiret One", cursive',
		googleFont: 'Poiret_One'
	},
	'audiowide': {
		id: 'audiowide',
		name: 'Audiowide',
		description: '科技展示字体',
		category: 'display',
		family: '"Audiowide", cursive',
		googleFont: 'Audiowide'
	},
	'vast-shadow': {
		id: 'vast-shadow',
		name: 'Vast Shadow',
		description: '复古阴影字体',
		category: 'display',
		family: '"Vast Shadow", cursive',
		googleFont: 'Vast_Shadow'
	},
	'black-ops-one': {
		id: 'black-ops-one',
		name: 'Black Ops One',
		description: '军事风格字体',
		category: 'display',
		family: '"Black Ops One", cursive',
		googleFont: 'Black_Ops_One'
	},
	'press-start-2p': {
		id: 'press-start-2p',
		name: 'Press Start 2P',
		description: '复古游戏字体',
		category: 'display',
		family: '"Press Start 2P", cursive',
		googleFont: 'Press_Start_2P'
	},
	'vt323': {
		id: 'vt323',
		name: 'VT323',
		description: '终端显示字体',
		category: 'display',
		family: '"VT323", monospace',
		googleFont: 'VT323'
	},
	'orbitron': {
		id: 'orbitron',
		name: 'Orbitron',
		description: '科幻展示字体',
		category: 'display',
		family: '"Orbitron", sans-serif',
		googleFont: 'Orbitron:wght@400;500;600;700;800;900'
	},
	'secular-one': {
		id: 'secular-one',
		name: 'Secular One',
		description: '现代希伯来字体',
		category: 'display',
		family: '"Secular One", sans-serif',
		googleFont: 'Secular_One'
	},
	'chakra-petch': {
		id: 'chakra-petch',
		name: 'Chakra Petch',
		description: '泰语科技字体',
		category: 'display',
		family: '"Chakra Petch", sans-serif',
		googleFont: 'Chakra_Petch:wght@300;400;500;600;700'
	},
	'noto-sans-sc': {
		id: 'noto-sans-sc',
		name: '思源黑体',
		description: 'Adobe中文黑体',
		category: 'cjk',
		family: '"Noto Sans SC", sans-serif',
		googleFont: 'Noto_Sans_SC:wght@300;400;500;600;700'
	},
	'noto-serif-sc': {
		id: 'noto-serif-sc',
		name: '思源宋体',
		description: 'Adobe中文宋体',
		category: 'cjk',
		family: '"Noto Serif SC", serif',
		googleFont: 'Noto_Serif_SC:wght@300;400;500;600;700'
	},
	'ma-shan-zheng': {
		id: 'ma-shan-zheng',
		name: '马善政楷体',
		description: '中文楷体风格',
		category: 'cjk',
		family: '"Ma Shan Zheng", cursive',
		googleFont: 'Ma_Shan_Zheng'
	},
	'zcool-xiaowei': {
		id: 'zcool-xiaowei',
		name: '站酷小薇体',
		description: '中文艺术字体',
		category: 'cjk',
		family: '"ZCOOL XiaoWei", serif',
		googleFont: 'ZCOOL_XiaoWei'
	},
	'zcool-qingke-huangyou': {
		id: 'zcool-qingke-huangyou',
		name: '站酷庆科黄油体',
		description: '中文手写风格',
		category: 'cjk',
		family: '"ZCOOL QingKe HuangYou", cursive',
		googleFont: 'ZCOOL_QingKe_HuangYou'
	},
	'liu-jian-mao-cao': {
		id: 'liu-jian-mao-cao',
		name: '刘建毛草',
		description: '中文草书风格',
		category: 'cjk',
		family: '"Liu Jian Mao Cao", cursive',
		googleFont: 'Liu_Jian_Mao_Cao'
	},
	'long-cang': {
		id: 'long-cang',
		name: '龙藏体',
		description: '中文书法风格',
		category: 'cjk',
		family: '"Long Cang", cursive',
		googleFont: 'Long_Cang'
	},
	'zhi-mang-xing': {
		id: 'zhi-mang-xing',
		name: '芝麻星',
		description: '中文手写风格',
		category: 'cjk',
		family: '"Zhi Mang Xing", cursive',
		googleFont: 'Zhi_Mang_Xing'
	},
	'noto-sans-jp': {
		id: 'noto-sans-jp',
		name: 'Noto Sans JP',
		description: '日文无衬线字体',
		category: 'cjk',
		family: '"Noto Sans JP", sans-serif',
		googleFont: 'Noto_Sans_JP:wght@300;400;500;600;700'
	},
	'noto-serif-jp': {
		id: 'noto-serif-jp',
		name: 'Noto Serif JP',
		description: '日文衬线字体',
		category: 'cjk',
		family: '"Noto Serif JP", serif',
		googleFont: 'Noto_Serif_JP:wght@300;400;500;600;700'
	},
	'noto-sans-kr': {
		id: 'noto-sans-kr',
		name: 'Noto Sans KR',
		description: '韩文无衬线字体',
		category: 'cjk',
		family: '"Noto Sans KR", sans-serif',
		googleFont: 'Noto_Sans_KR:wght@300;400;500;600;700'
	},
	'noto-serif-kr': {
		id: 'noto-serif-kr',
		name: 'Noto Serif KR',
		description: '韩文衬线字体',
		category: 'cjk',
		family: '"Noto Serif KR", serif',
		googleFont: 'Noto_Serif_KR:wght@300;400;500;600;700'
	},
	'kosugi-maru': {
		id: 'kosugi-maru',
		name: 'Kosugi Maru',
		description: '日文圆润字体',
		category: 'cjk',
		family: '"Kosugi Maru", sans-serif',
		googleFont: 'Kosugi_Maru'
	},
	'sawarabi-gothic': {
		id: 'sawarabi-gothic',
		name: 'Sawarabi Gothic',
		description: '日文哥特字体',
		category: 'cjk',
		family: '"Sawarabi Gothic", sans-serif',
		googleFont: 'Sawarabi_Gothic'
	},
	'm-plus-rounded-1c': {
		id: 'm-plus-rounded-1c',
		name: 'M PLUS Rounded 1c',
		description: '日文圆润字体',
		category: 'cjk',
		family: '"M PLUS Rounded 1c", sans-serif',
		googleFont: 'M_PLUS_Rounded_1c:wght@300;400;500;600;700'
	},
	'zen-maru-gothic': {
		id: 'zen-maru-gothic',
		name: 'Zen Maru Gothic',
		description: '日文圆角字体',
		category: 'cjk',
		family: '"Zen Maru Gothic", sans-serif',
		googleFont: 'Zen_Maru_Gothic:wght@300;400;500;600;700'
	},
	'kiwi-maru': {
		id: 'kiwi-maru',
		name: 'Kiwi Maru',
		description: '日文衬线字体',
		category: 'cjk',
		family: '"Kiwi Maru", serif',
		googleFont: 'Kiwi_Maru:wght@300;400;500'
	},
	'nanum-gothic': {
		id: 'nanum-gothic',
		name: 'Nanum Gothic',
		description: '韩文无衬线字体',
		category: 'cjk',
		family: '"Nanum Gothic", sans-serif',
		googleFont: 'Nanum_Gothic:wght@400;700;800'
	},
	'nanum-myeongjo': {
		id: 'nanum-myeongjo',
		name: 'Nanum Myeongjo',
		description: '韩文明朝体',
		category: 'cjk',
		family: '"Nanum Myeongjo", serif',
		googleFont: 'Nanum_Myeongjo:wght@400;700;800'
	},
	'nanum-pen-script': {
		id: 'nanum-pen-script',
		name: 'Nanum Pen Script',
		description: '韩文手写字体',
		category: 'cjk',
		family: '"Nanum Pen Script", cursive',
		googleFont: 'Nanum_Pen_Script'
	},
	'gamja-flower': {
		id: 'gamja-flower',
		name: 'Gamja Flower',
		description: '韩文可爱字体',
		category: 'cjk',
		family: '"Gamja Flower", cursive',
		googleFont: 'Gamja_Flower'
	},
	'do-hyeon': {
		id: 'do-hyeon',
		name: 'Do Hyeon',
		description: '韩文展示字体',
		category: 'cjk',
		family: '"Do Hyeon", sans-serif',
		googleFont: 'Do_Hyeon'
	},
	'black-han-sans': {
		id: 'black-han-sans',
		name: 'Black Han Sans',
		description: '韩文粗体字体',
		category: 'cjk',
		family: '"Black Han Sans", sans-serif',
		googleFont: 'Black_Han_Sans'
	},
	'stylish': {
		id: 'stylish',
		name: 'Stylish',
		description: '韩文时尚字体',
		category: 'cjk',
		family: '"Stylish", sans-serif',
		googleFont: 'Stylish'
	},
	'gugi': {
		id: 'gugi',
		name: 'Gugi',
		description: '韩文展示字体',
		category: 'cjk',
		family: '"Gugi", cursive',
		googleFont: 'Gugi'
	},
	'cute-font': {
		id: 'cute-font',
		name: 'Cute Font',
		description: '韩文可爱字体',
		category: 'cjk',
		family: '"Cute Font", cursive',
		googleFont: 'Cute_Font'
	},
	'gaegu': {
		id: 'gaegu',
		name: 'Gaegu',
		description: '韩文手写字体',
		category: 'cjk',
		family: '"Gaegu", cursive',
		googleFont: 'Gaegu:wght@300;400;700'
	},
	'hi-melody': {
		id: 'hi-melody',
		name: 'Hi Melody',
		description: '韩文旋律字体',
		category: 'cjk',
		family: '"Hi Melody", cursive',
		googleFont: 'Hi_Melody'
	},
	'sunflower': {
		id: 'sunflower',
		name: 'Sunflower',
		description: '韩文向日葵字体',
		category: 'cjk',
		family: '"Sunflower", sans-serif',
		googleFont: 'Sunflower:wght@300;500;700'
	},
	'diphylleia': {
		id: 'diphylleia',
		name: 'Diphylleia',
        description: '韩文衬线字体',
        category: 'cjk',
        family: '"Diphylleia", serif',
        googleFont: 'Diphylleia'
	 },
	'zcool-kuaile': {
        id: 'zcool-kuaile',
        name: '站酷快乐体',
        description: '中文快乐艺术字体',
        category: 'chinese-art',
        family: '"ZCOOL KuaiLe", cursive',
        googleFont: 'ZCOOL_KuaiLe'
    },
    'zcool-qingke-huangyou': {
        id: 'zcool-qingke-huangyou',
        name: '站酷庆科黄油体',
        description: '中文手写艺术字体',
        category: 'chinese-art',
        family: '"ZCOOL QingKe HuangYou", cursive',
        googleFont: 'ZCOOL_QingKe_HuangYou'
    },
    'zcool-xiaowei': {
        id: 'zcool-xiaowei',
        name: '站酷小薇体',
        description: '中文艺术字体',
        category: 'chinese-art',
        family: '"ZCOOL XiaoWei", serif',
        googleFont: 'ZCOOL_XiaoWei'
    },
    'zcool-gaosuhei': {
        id: 'zcool-gaosuhei',
        name: '站酷高端黑',
        description: '中文高端黑体',
        category: 'chinese-art',
        family: '"ZCOOL GaoSuHei", sans-serif',
        googleFont: 'ZCOOL_GaoSuHei'
    },
    'zcool-wenyi': {
        id: 'zcool-wenyi',
        name: '站酷文艺体',
        description: '中文文艺风格字体',
        category: 'chinese-art',
        family: '"ZCOOL WenYi", sans-serif',
        googleFont: 'ZCOOL_WenYi'
    },
    'zcool-bangshu': {
        id: 'zcool-bangshu',
        name: '站酷榜书体',
        description: '中文榜书风格字体',
        category: 'chinese-art',
        family: '"ZCOOL BangShu", sans-serif',
        googleFont: 'ZCOOL_BangShu'
    },
    'zcool-simhei': {
        id: 'zcool-simhei',
        name: '站酷思源黑体',
        description: '中文思源黑体',
        category: 'chinese-art',
        family: '"ZCOOL SimHei", sans-serif',
        googleFont: 'ZCOOL_SimHei'
    },
    'zcool-kuheiti': {
        id: 'zcool-kuheiti',
        name: '站酷酷黑体',
        description: '中文酷黑体',
        category: 'chinese-art',
        family: '"ZCOOL KuHeiTi", sans-serif',
        googleFont: 'ZCOOL_KuHeiTi'
    },
    'zcool-leishu': {
        id: 'zcool-leishu',
        name: '站酷雷书体',
        description: '中文雷书风格字体',
        category: 'chinese-art',
        family: '"ZCOOL LeiShu", sans-serif',
        googleFont: 'ZCOOL_LeiShu'
    },
    'zcool-yunkang': {
        id: 'zcool-yunkang',
        name: '站酷云康体',
        description: '中文云康风格字体',
        category: 'chinese-art',
        family: '"ZCOOL YunKang", sans-serif',
        googleFont: 'ZCOOL_YunKang'
    },
    'zcool-shouzhuanti': {
        id: 'zcool-shouzhuanti',
        name: '站酷手账体',
        description: '中文手账风格字体',
        category: 'chinese-art',
        family: '"ZCOOL ShouZhuanti", cursive',
        googleFont: 'ZCOOL_ShouZhuanti'
    },
    'zcool-huakang': {
        id: 'zcool-huakang',
        name: '站酷花康体',
        description: '中文花康风格字体',
        category: 'chinese-art',
        family: '"ZCOOL HuaKang", cursive',
        googleFont: 'ZCOOL_HuaKang'
    },
    'zcool-xiaobai': {
        id: 'zcool-xiaobai',
        name: '站酷小白体',
        description: '中文小白风格字体',
        category: 'chinese-art',
        family: '"ZCOOL XiaoBai", sans-serif',
        googleFont: 'ZCOOL_XiaoBai'
    },
    'zcool-daqian': {
        id: 'zcool-daqian',
        name: '站酷大千体',
        description: '中文大千风格字体',
        category: 'chinese-art',
        family: '"ZCOOL DaQian", sans-serif',
        googleFont: 'ZCOOL_DaQian'
    },
    'zcool-gongkaixiang': {
        id: 'zcool-gongkaixiang',
        name: '站酷龚楷祥体',
        description: '中文龚楷风格字体',
        category: 'chinese-art',
        family: '"ZCOOL GongKaiXiang", serif',
        googleFont: 'ZCOOL_GongKaiXiang'
    },
    'zcool-xingkai': {
        id: 'zcool-xingkai',
        name: '站酷行楷体',
        description: '中文行楷风格字体',
        category: 'chinese-art',
        family: '"ZCOOL XingKai", cursive',
        googleFont: 'ZCOOL_XingKai'
    },
    'zcool-yueyuan': {
        id: 'zcool-yueyuan',
        name: '站酷悦圆体',
        description: '中文悦圆风格字体',
        category: 'chinese-art',
        family: '"ZCOOL YueYuan", sans-serif',
        googleFont: 'ZCOOL_YueYuan'
    },
    'zcool-heiti': {
        id: 'zcool-heiti',
        name: '站酷黑体',
        description: '中文黑体',
        category: 'chinese-art',
        family: '"ZCOOL HeiTi", sans-serif',
        googleFont: 'ZCOOL_HeiTi'
    },
    'zcool-songti': {
        id: 'zcool-songti',
        name: '站酷宋体',
        description: '中文宋体',
        category: 'chinese-art',
        family: '"ZCOOL SongTi", serif',
        googleFont: 'ZCOOL_SongTi'
    },
    'zcool-kaiti': {
        id: 'zcool-kaiti',
        name: '站酷楷体',
        description: '中文楷体',
        category: 'chinese-art',
        family: '"ZCOOL KaiTi", serif',
        googleFont: 'ZCOOL_KaiTi'
    },
    'zcool-caoshu': {
        id: 'zcool-caoshu',
        name: '站酷草书体',
        description: '中文草书风格字体',
        category: 'chinese-art',
        family: '"ZCOOL CaoShu", cursive',
        googleFont: 'ZCOOL_CaoShu'
    },
    'zcool-xingshu': {
        id: 'zcool-xingshu',
        name: '站酷行书体',
        description: '中文行书风格字体',
        category: 'chinese-art',
        family: '"ZCOOL XingShu", cursive',
        googleFont: 'ZCOOL_XingShu'
    },
    'zcool-lishu': {
        id: 'zcool-lishu',
        name: '站酷隶书体',
        description: '中文隶书风格字体',
        category: 'chinese-art',
        family: '"ZCOOL LiShu", serif',
        googleFont: 'ZCOOL_LiShu'
    },
    'zcool-weibei': {
        id: 'zcool-weibei',
        name: '站酷魏碑体',
        description: '中文魏碑风格字体',
        category: 'chinese-art',
        family: '"ZCOOL WeiBei", serif',
        googleFont: 'ZCOOL_WeiBei'
    },
    'zcool-lishu-jp': {
        id: 'zcool-lishu-jp',
        name: '站酷隶书日文',
        description: '日文隶书风格字体',
        category: 'chinese-art',
        family: '"ZCOOL LiShu JP", serif',
        googleFont: 'ZCOOL_LiShu_JP'
    },
    'ma-shan-zheng': {
        id: 'ma-shan-zheng',
        name: '马善政楷体',
        description: '中文楷体风格',
        category: 'chinese-art',
        family: '"Ma Shan Zheng", cursive',
        googleFont: 'Ma_Shan_Zheng'
    },
    'long-cang': {
        id: 'long-cang',
        name: '龙藏体',
        description: '中文书法风格',
        category: 'chinese-art',
        family: '"Long Cang", cursive',
        googleFont: 'Long_Cang'
    },
    'liu-jian-mao-cao': {
        id: 'liu-jian-mao-cao',
        name: '刘建毛草',
        description: '中文草书风格',
        category: 'chinese-art',
        family: '"Liu Jian Mao Cao", cursive',
        googleFont: 'Liu_Jian_Mao_Cao'
    },
    'zhi-mang-xing': {
        id: 'zhi-mang-xing',
        name: '芝麻星',
        description: '中文手写风格',
        category: 'chinese-art',
        family: '"Zhi Mang Xing", cursive',
        googleFont: 'Zhi_Mang_Xing'
    },
    'huang-you': {
        id: 'huang-you',
        name: '黄油体',
        description: '中文手写艺术字体',
        category: 'chinese-art',
        family: '"Huang You", cursive',
        googleFont: 'Huang_You'
    },
    'xingkai-sc': {
        id: 'xingkai-sc',
        name: '行楷简体',
        description: '中文行楷简体',
        category: 'chinese-art',
        family: '"Xingkai SC", cursive',
        googleFont: 'Xingkai_SC'
    },
    'chengzi': {
        id: 'chengzi',
        name: '橙子体',
        description: '中文可爱字体',
        category: 'chinese-art',
        family: '"Chengzi", cursive',
        googleFont: 'Chengzi'
    },
    'baotux': {
        id: 'baotux',
        name: '报图体',
        description: '中文报图风格字体',
        category: 'chinese-art',
        family: '"Baotux", sans-serif',
        googleFont: 'Baotux'
    },
    'shufa-kaiti': {
        id: 'shufa-kaiti',
        name: '书法楷体',
        description: '中文书法楷体',
        category: 'chinese-art',
        family: '"Shufa Kaiti", serif',
        googleFont: 'Shufa_Kaiti'
    },
    'shufa-caoshu': {
        id: 'shufa-caoshu',
        name: '书法草书',
        description: '中文书法草书',
        category: 'chinese-art',
        family: '"Shufa Caoshu", cursive',
        googleFont: 'Shufa_Caoshu'
    },
    'shufa-xingshu': {
        id: 'shufa-xingshu',
        name: '书法行书',
        description: '中文书法行书',
        category: 'chinese-art',
        family: '"Shufa Xingshu", cursive',
        googleFont: 'Shufa_Xingshu'
    },
    'shufa-lishu': {
        id: 'shufa-lishu',
        name: '书法隶书',
        description: '中文书法隶书',
        category: 'chinese-art',
        family: '"Shufa Lishu", serif',
        googleFont: 'Shufa_Lishu'
    },
    'shufa-weibei': {
        id: 'shufa-weibei',
        name: '书法魏碑',
        description: '中文书法魏碑',
        category: 'chinese-art',
        family: '"Shufa Weibei", serif',
        googleFont: 'Shufa_Weibei'
    },
    'shufa-songti': {
        id: 'shufa-songti',
        name: '书法宋体',
        description: '中文书法宋体',
        category: 'chinese-art',
        family: '"Shufa Songti", serif',
        googleFont: 'Shufa_Songti'
    },
    'shufa-heiti': {
        id: 'shufa-heiti',
        name: '书法黑体',
        description: '中文书法黑体',
        category: 'chinese-art',
        family: '"Shufa Heiti", sans-serif',
        googleFont: 'Shufa_Heiti'
    },
    'shufa-yuanti': {
        id: 'shufa-yuanti',
        name: '书法圆体',
        description: '中文书法圆体',
        category: 'chinese-art',
        family: '"Shufa Yuanti", sans-serif',
        googleFont: 'Shufa_Yuanti'
    },
    'shufa-fangti': {
        id: 'shufa-fangti',
        name: '书法方体',
        description: '中文书法方体',
        category: 'chinese-art',
        family: '"Shufa Fangti", sans-serif',
        googleFont: 'Shufa_Fangti'
    },
    'shufa-changti': {
        id: 'shufa-changti',
        name: '书法长体',
        description: '中文书法长体',
        category: 'chinese-art',
        family: '"Shufa Changti", sans-serif',
        googleFont: 'Shufa_Changti'
    },
    'shufa-kuanhei': {
        id: 'shufa-kuanhei',
        name: '书法宽黑',
        description: '中文书法宽黑体',
        category: 'chinese-art',
        family: '"Shufa Kuanhei", sans-serif',
        googleFont: 'Shufa_Kuanhei'
    },
    'shufa-xikai': {
        id: 'shufa-xikai',
        name: '书法细楷',
        description: '中文书法细楷',
        category: 'chinese-art',
        family: '"Shufa Xikai", serif',
        googleFont: 'Shufa_Xikai'
    },
    'shufa-cukai': {
        id: 'shufa-cukai',
        name: '书法粗楷',
        description: '中文书法粗楷',
        category: 'chinese-art',
        family: '"Shufa Cukai", serif',
        googleFont: 'Shufa_Cukai'
    },
    'shufa-shouxie': {
        id: 'shufa-shouxie',
        name: '书法手写',
        description: '中文书法手写体',
        category: 'chinese-art',
        family: '"Shufa Shouxie", cursive',
        googleFont: 'Shufa_Shouxie'
    },
    'shufa-yishu': {
        id: 'shufa-yishu',
        name: '书法艺术',
        description: '中文书法艺术体',
        category: 'chinese-art',
        family: '"Shufa Yishu", cursive',
        googleFont: 'Shufa_Yishu'
    },
    'shufa-gufeng': {
        id: 'shufa-gufeng',
        name: '书法古风',
        description: '中文书法古风体',
        category: 'chinese-art',
        family: '"Shufa Gufeng", serif',
        googleFont: 'Shufa_Gufeng'
    },
    'shufa-xiandai': {
        id: 'shufa-xiandai',
        name: '书法现代',
        description: '中文书法现代体',
        category: 'chinese-art',
        family: '"Shufa Xiandai", sans-serif',
        googleFont: 'Shufa_Xiandai'
    },
    'shufa-fugu': {
        id: 'shufa-fugu',
        name: '书法复古',
        description: '中文书法复古体',
        category: 'chinese-art',
        family: '"Shufa Fugu", serif',
        googleFont: 'Shufa_Fugu'
    },
    'shufa-qingxin': {
        id: 'shufa-qingxin',
        name: '书法清新',
        description: '中文书法清新体',
        category: 'chinese-art',
        family: '"Shufa Qingxin", sans-serif',
        googleFont: 'Shufa_Qingxin'
    },
    'shufa-danya': {
        id: 'shufa-danya',
        name: '书法淡雅',
        description: '中文书法淡雅体',
        category: 'chinese-art',
        family: '"Shufa Danya", serif',
        googleFont: 'Shufa_Danya'
    },
    'shufa-huopo': {
        id: 'shufa-huopo',
        name: '书法活泼',
        description: '中文书法活泼体',
        category: 'chinese-art',
        family: '"Shufa Huopo", cursive',
        googleFont: 'Shufa_Huopo'
    },
    'shufa-wenrou': {
        id: 'shufa-wenrou',
        name: '书法温柔',
        description: '中文书法温柔体',
        category: 'chinese-art',
        family: '"Shufa Wenrou", sans-serif',
        googleFont: 'Shufa_Wenrou'
    },
    'shufa-gaoya': {
        id: 'shufa-gaoya',
        name: '书法高雅',
        description: '中文书法高雅体',
        category: 'chinese-art',
        family: '"Shufa Gaoya", serif',
        googleFont: 'Shufa_Gaoya'
    },
    'shufa-shishang': {
        id: 'shufa-shishang',
        name: '书法时尚',
        description: '中文书法时尚体',
        category: 'chinese-art',
        family: '"Shufa Shishang", sans-serif',
        googleFont: 'Shufa_Shishang'
    },
    'shufa-jianyue': {
        id: 'shufa-jianyue',
        name: '书法简约',
        description: '中文书法简约体',
        category: 'chinese-art',
        family: '"Shufa Jianyue", sans-serif',
        googleFont: 'Shufa_Jianyue'
    },
    'shufa-houzhong': {
        id: 'shufa-houzhong',
        name: '书法厚重',
        description: '中文书法厚重体',
        category: 'chinese-art',
        family: '"Shufa Houzhong", sans-serif',
        googleFont: 'Shufa_Houzhong'
    },
    'shufa-lingli': {
        id: 'shufa-lingli',
        name: '书法灵动',
        description: '中文书法灵动体',
        category: 'chinese-art',
        family: '"Shufa Lingli", cursive',
        googleFont: 'Shufa_Lingli'
    },
    'shufa-duanli': {
        id: 'shufa-duanli',
        name: '书法端庄',
        description: '中文书法端庄体',
        category: 'chinese-art',
        family: '"Shufa Duanli", serif',
        googleFont: 'Shufa_Duanli'
    },
    'shufa-pugu': {
        id: 'shufa-pugu',
        name: '书法古朴',
        description: '中文书法古朴体',
        category: 'chinese-art',
        family: '"Shufa Pugu", serif',
        googleFont: 'Shufa_Pugu'
    },
    'shufa-xiuyi': {
        id: 'shufa-xiuyi',
        name: '书法秀逸',
        description: '中文书法秀逸体',
        category: 'chinese-art',
        family: '"Shufa Xiuyi", cursive',
        googleFont: 'Shufa_Xiuyi'
    },
    'shufa-bengfang': {
        id: 'shufa-bengfang',
        name: '书法奔放',
        description: '中文书法奔放体',
        category: 'chinese-art',
        family: '"Shufa Bengfang", cursive',
        googleFont: 'Shufa_Bengfang'
    },
    'shufa-hanhou': {
        id: 'shufa-hanhou',
        name: '书法憨厚',
        description: '中文书法憨厚体',
        category: 'chinese-art',
        family: '"Shufa Hanhou", sans-serif',
        googleFont: 'Shufa_Hanhou'
    },
    'shufa-jingzhi': {
        id: 'shufa-jingzhi',
        name: '书法精致',
        description: '中文书法精致体',
        category: 'chinese-art',
        family: '"Shufa Jingzhi", serif',
        googleFont: 'Shufa_Jingzhi'
    },
    'shufa-shuaitian': {
        id: 'shufa-shuaitian',
        name: '书法率天',
        description: '中文书法率天体',
        category: 'chinese-art',
        family: '"Shufa Shuaitian", cursive',
        googleFont: 'Shufa_Shuaitian'
    },
    'shufa-xiaosa': {
        id: 'shufa-xiaosa',
        name: '书法潇洒',
        description: '中文书法潇洒体',
        category: 'chinese-art',
        family: '"Shufa Xiaosa", cursive',
        googleFont: 'Shufa_Xiaosa'
    },
    'shufa-chenwen': {
        id: 'shufa-chenwen',
        name: '书法沉稳',
        description: '中文书法沉稳体',
        category: 'chinese-art',
        family: '"Shufa Chenwen", serif',
        googleFont: 'Shufa_Chenwen'
    },
    'shufa-haoqi': {
        id: 'shufa-haoqi',
        name: '书法豪气',
        description: '中文书法豪气体',
        category: 'chinese-art',
        family: '"Shufa Haoqi", sans-serif',
        googleFont: 'Shufa_Haoqi'
    },
    'shufa-xiaqiao': {
        id: 'shufa-xiaqiao',
        name: '书法小巧',
        description: '中文书法小巧体',
        category: 'chinese-art',
        family: '"Shufa Xiaqiao", sans-serif',
        googleFont: 'Shufa_Xiaqiao'
    },
    'shufa-dafang': {
        id: 'shufa-dafang',
        name: '书法大方',
        description: '中文书法大方体',
        category: 'chinese-art',
        family: '"Shufa Dafang", sans-serif',
        googleFont: 'Shufa_Dafang'
    },
    'shufa-jiaomei': {
        id: 'shufa-jiaomei',
        name: '书法娇美',
        description: '中文书法娇美体',
        category: 'chinese-art',
        family: '"Shufa Jiaomei", cursive',
        googleFont: 'Shufa_Jiaomei'
    },
    'shufa-yingjun': {
        id: 'shufa-yingjun',
        name: '书法英俊',
        description: '中文书法英俊体',
        category: 'chinese-art',
        family: '"Shufa Yingjun", sans-serif',
        googleFont: 'Shufa_Yingjun'
    },
    'shufa-qilin': {
        id: 'shufa-qilin',
        name: '书法奇林',
        description: '中文书法奇林体',
        category: 'chinese-art',
        family: '"Shufa Qilin", cursive',
        googleFont: 'Shufa_Qilin'
    },
    'shufa-menghuan': {
        id: 'shufa-menghuan',
        name: '书法梦幻',
        description: '中文书法梦幻体',
        category: 'chinese-art',
        family: '"Shufa Menghuan", cursive',
        googleFont: 'Shufa_Menghuan'
    },
    'shufa-tongqu': {
        id: 'shufa-tongqu',
        name: '书法童趣',
        description: '中文书法童趣体',
        category: 'chinese-art',
        family: '"Shufa Tongqu", cursive',
        googleFont: 'Shufa_Tongqu'
    },
    'shufa-keai': {
        id: 'shufa-keai',
        name: '书法可爱',
        description: '中文书法可爱体',
        category: 'chinese-art',
        family: '"Shufa Keai", cursive',
        googleFont: 'Shufa_Keai'
    },
    'shufa-weimei': {
        id: 'shufa-weimei',
        name: '书法唯美',
        description: '中文书法唯美体',
        category: 'chinese-art',
        family: '"Shufa Weimei", serif',
        googleFont: 'Shufa_Weimei'
    },
    'shufa-langman': {
        id: 'shufa-langman',
        name: '书法浪漫',
        description: '中文书法浪漫体',
        category: 'chinese-art',
        family: '"Shufa Langman", cursive',
        googleFont: 'Shufa_Langman'
    },
    'shufa-qingchun': {
        id: 'shufa-qingchun',
        name: '书法青春',
        description: '中文书法青春体',
        category: 'chinese-art',
        family: '"Shufa Qingchun", sans-serif',
        googleFont: 'Shufa_Qingchun'
    },
    'shufa-yangguang': {
        id: 'shufa-yangguang',
        name: '书法阳光',
        description: '中文书法阳光体',
        category: 'chinese-art',
        family: '"Shufa Yangguang", sans-serif',
        googleFont: 'Shufa_Yangguang'
    },
    'shufa-wennuan': {
        id: 'shufa-wennuan',
        name: '书法温暖',
        description: '中文书法温暖体',
        category: 'chinese-art',
        family: '"Shufa Wennuan", sans-serif',
        googleFont: 'Shufa_Wennuan'
    },
    'shufa-qingliang': {
        id: 'shufa-qingliang',
        name: '书法清亮',
        description: '中文书法清亮体',
        category: 'chinese-art',
        family: '"Shufa Qingliang", sans-serif',
        googleFont: 'Shufa_Qingliang'
    },
    'shufa-shenmi': {
        id: 'shufa-shenmi',
        name: '书法神秘',
        description: '中文书法神秘体',
        category: 'chinese-art',
        family: '"Shufa Shenmi", serif',
        googleFont: 'Shufa_Shenmi'
    },
    'shufa-huanxiang': {
        id: 'shufa-huanxiang',
        name: '书法幻想',
        description: '中文书法幻想体',
        category: 'chinese-art',
        family: '"Shufa Huanxiang", cursive',
        googleFont: 'Shufa_Huanxiang'
    },
    'shufa-chuangxiang': {
        id: 'shufa-chuangxiang',
        name: '书法创想',
        description: '中文书法创想体',
        category: 'chinese-art',
        family: '"Shufa Chuangxiang", sans-serif',
        googleFont: 'Shufa_Chuangxiang'
    },
    'shufa-linggan': {
        id: 'shufa-linggan',
        name: '书法灵感',
        description: '中文书法灵感体',
        category: 'chinese-art',
        family: '"Shufa Linggan", cursive',
        googleFont: 'Shufa_Linggan'
    },
    'shufa-yishujia': {
        id: 'shufa-yishujia',
        name: '书法艺术佳',
        description: '中文书法艺术佳体',
        category: 'chinese-art',
        family: '"Shufa Yishujia", cursive',
        googleFont: 'Shufa_Yishujia'
    }
}

const FONT_ORDER = [
	'system-default',
	'roboto', 'open-sans', 'lato', 'montserrat', 'poppins', 'inter', 'nunito', 'source-sans-pro', 'work-sans',
	'raleway', 'quicksand', 'ubuntu', 'rubik', 'karla', 'ibm-plex-sans', 'noto-sans', 'fira-sans', 'mulish', 'josefin-sans',
	'barlow', 'cabin', 'mukta', 'archivo', 'archivo-narrow', 'titillium-web', 'catamaran', 'hind', 'hind-siliguri',
	'merriweather', 'playfair-display', 'lora', 'libre-baskerville', 'source-serif-pro', 'crimson-text', 'eb-garamond',
	'libre-caslon-text', 'spectral', 'cardo', 'alegreya', 'vollkorn', 'cormorant', 'noto-serif', 'slabo', 'bitter',
	'arvo', 'roboto-slab', 'zilla-slab', 'ibm-plex-serif',
	'courgette', 'dancing-script', 'pacifico', 'satisfy', 'great-vibes', 'kaushan-script', 'sacramento', 'cookie',
	'shadows-into-light', 'indie-flower', 'architects-daughter', 'patrick-hand', 'caveat', 'kalam', 'handlee',
	'gloria-hallelujah', 'rock-salt', 'homemade-apple', 'special-elite', 'permanent-marker', 'covered-by-your-grace',
	'ubuntu-mono', 'fira-code', 'source-code-pro', 'jetbrains-mono', 'inconsolata', 'roboto-mono', 'space-mono',
	'ibm-plex-mono', 'pt-mono', 'noto-sans-mono',
	'oswald', 'bebas-neue', 'anton', 'righteous', 'bangers', 'bungee', 'alfa-slab-one', 'passion-one', 'fredoka-one',
	'lobster', 'lobster-two', 'comfortaa', 'poiret-one', 'audiowide', 'vast-shadow', 'black-ops-one', 'press-start-2p',
	'vt323', 'orbitron', 'secular-one', 'chakra-petch',
	'noto-sans-sc', 'noto-serif-sc', 'noto-sans-jp', 'noto-serif-jp', 'noto-sans-kr', 'noto-serif-kr',
	'kosugi-maru', 'sawarabi-gothic', 'm-plus-rounded-1c', 'zen-maru-gothic', 'kiwi-maru',
	'nanum-gothic', 'nanum-myeongjo', 'nanum-pen-script', 'gamja-flower', 'do-hyeon', 'black-han-sans',
	'stylish', 'gugi', 'cute-font', 'gaegu', 'hi-melody', 'sunflower', 'diphylleia',
	'zcool-kuaile', 'zcool-qingke-huangyou', 'zcool-xiaowei', 'zcool-gaosuhei', 'zcool-wenyi', 'zcool-bangshu',
	'zcool-simhei', 'zcool-kuheiti', 'zcool-leishu', 'zcool-yunkang', 'zcool-shouzhuanti', 'zcool-huakang',
	'zcool-xiaobai', 'zcool-daqian', 'zcool-gongkaixiang', 'zcool-xingkai', 'zcool-yueyuan',
	'zcool-heiti', 'zcool-songti', 'zcool-kaiti', 'zcool-caoshu', 'zcool-xingshu', 'zcool-lishu',
	'zcool-weibei', 'zcool-lishu-jp',
	'ma-shan-zheng', 'long-cang', 'liu-jian-mao-cao', 'zhi-mang-xing', 'huang-you', 'xingkai-sc', 'chengzi', 'baotux',
	'shufa-kaiti', 'shufa-caoshu', 'shufa-xingshu', 'shufa-lishu', 'shufa-weibei', 'shufa-songti', 'shufa-heiti',
	'shufa-yuanti', 'shufa-fangti', 'shufa-changti', 'shufa-kuanhei', 'shufa-xikai', 'shufa-cukai',
	'shufa-shouxie', 'shufa-yishu', 'shufa-gufeng', 'shufa-xiandai', 'shufa-fugu', 'shufa-qingxin',
	'shufa-danya', 'shufa-huopo', 'shufa-wenrou', 'shufa-gaoya', 'shufa-shishang', 'shufa-jianyue', 'shufa-houzhong',
	'shufa-lingli', 'shufa-duanli', 'shufa-pugu', 'shufa-xiuyi', 'shufa-bengfang', 'shufa-hanhou', 'shufa-jingzhi',
	'shufa-shuaitian', 'shufa-xiaosa', 'shufa-chenwen', 'shufa-haoqi', 'shufa-xiaqiao', 'shufa-dafang',
	'shufa-jiaomei', 'shufa-yingjun', 'shufa-qilin', 'shufa-menghuan', 'shufa-tongqu', 'shufa-keai',
	'shufa-weimei', 'shufa-langman', 'shufa-qingchun', 'shufa-yangguang', 'shufa-wennuan', 'shufa-qingliang',
	'shufa-shenmi', 'shufa-huanxiang', 'shufa-chuangxiang', 'shufa-linggan', 'shufa-yishujia'
]

const FONT_CATEGORIES = {
	system: { name: '系统', fonts: ['system-default'] },
	'sans-serif': { name: '无衬线', fonts: ['roboto', 'open-sans', 'lato', 'montserrat', 'poppins', 'inter', 'nunito', 'source-sans-pro', 'work-sans', 'raleway', 'quicksand', 'ubuntu', 'rubik', 'karla', 'ibm-plex-sans', 'noto-sans', 'fira-sans', 'mulish', 'josefin-sans', 'barlow', 'cabin', 'mukta', 'archivo', 'archivo-narrow', 'titillium-web', 'catamaran', 'hind', 'hind-siliguri'] },
	serif: { name: '衬线', fonts: ['merriweather', 'playfair-display', 'lora', 'libre-baskerville', 'source-serif-pro', 'crimson-text', 'eb-garamond', 'libre-caslon-text', 'spectral', 'cardo', 'alegreya', 'vollkorn', 'cormorant', 'noto-serif', 'slabo', 'bitter', 'arvo', 'roboto-slab', 'zilla-slab', 'ibm-plex-serif'] },
	handwriting: { name: '手写', fonts: ['courgette', 'dancing-script', 'pacifico', 'satisfy', 'great-vibes', 'kaushan-script', 'sacramento', 'cookie', 'shadows-into-light', 'indie-flower', 'architects-daughter', 'patrick-hand', 'caveat', 'kalam', 'handlee', 'gloria-hallelujah', 'rock-salt', 'homemade-apple', 'special-elite', 'permanent-marker', 'covered-by-your-grace'] },
	monospace: { name: '等宽', fonts: ['ubuntu-mono', 'fira-code', 'source-code-pro', 'jetbrains-mono', 'inconsolata', 'roboto-mono', 'space-mono', 'ibm-plex-mono', 'pt-mono', 'noto-sans-mono'] },
	display: { name: '展示', fonts: ['oswald', 'bebas-neue', 'anton', 'righteous', 'bangers', 'bungee', 'alfa-slab-one', 'passion-one', 'fredoka-one', 'lobster', 'lobster-two', 'comfortaa', 'poiret-one', 'audiowide', 'vast-shadow', 'black-ops-one', 'press-start-2p', 'vt323', 'orbitron', 'secular-one', 'chakra-petch'] },
	cjk: { name: '中日韩', fonts: ['noto-sans-sc', 'noto-serif-sc', 'noto-sans-jp', 'noto-serif-jp', 'noto-sans-kr', 'noto-serif-kr', 'kosugi-maru', 'sawarabi-gothic', 'm-plus-rounded-1c', 'zen-maru-gothic', 'kiwi-maru', 'nanum-gothic', 'nanum-myeongjo', 'nanum-pen-script', 'gamja-flower', 'do-hyeon', 'black-han-sans', 'stylish', 'gugi', 'cute-font', 'gaegu', 'hi-melody', 'sunflower', 'diphylleia'] },
	'chinese-art': { name: '中文艺术', fonts: ['zcool-kuaile', 'zcool-qingke-huangyou', 'zcool-xiaowei', 'zcool-gaosuhei', 'zcool-wenyi', 'zcool-bangshu', 'zcool-simhei', 'zcool-kuheiti', 'zcool-leishu', 'zcool-yunkang', 'zcool-shouzhuanti', 'zcool-huakang', 'zcool-xiaobai', 'zcool-daqian', 'zcool-gongkaixiang', 'zcool-xingkai', 'zcool-yueyuan', 'zcool-heiti', 'zcool-songti', 'zcool-kaiti', 'zcool-caoshu', 'zcool-xingshu', 'zcool-lishu', 'zcool-weibei', 'zcool-lishu-jp', 'ma-shan-zheng', 'long-cang', 'liu-jian-mao-cao', 'zhi-mang-xing', 'huang-you', 'xingkai-sc', 'chengzi', 'baotux', 'shufa-kaiti', 'shufa-caoshu', 'shufa-xingshu', 'shufa-lishu', 'shufa-weibei', 'shufa-songti', 'shufa-heiti', 'shufa-yuanti', 'shufa-fangti', 'shufa-changti', 'shufa-kuanhei', 'shufa-xikai', 'shufa-cukai', 'shufa-shouxie', 'shufa-yishu', 'shufa-gufeng', 'shufa-xiandai', 'shufa-fugu', 'shufa-qingxin', 'shufa-danya', 'shufa-huopo', 'shufa-wenrou', 'shufa-gaoya', 'shufa-shishang', 'shufa-jianyue', 'shufa-houzhong', 'shufa-lingli', 'shufa-duanli', 'shufa-pugu', 'shufa-xiuyi', 'shufa-bengfang', 'shufa-hanhou', 'shufa-jingzhi', 'shufa-shuaitian', 'shufa-xiaosa', 'shufa-chenwen', 'shufa-haoqi', 'shufa-xiaqiao', 'shufa-dafang', 'shufa-jiaomei', 'shufa-yingjun', 'shufa-qilin', 'shufa-menghuan', 'shufa-tongqu', 'shufa-keai', 'shufa-weimei', 'shufa-langman', 'shufa-qingchun', 'shufa-yangguang', 'shufa-wennuan', 'shufa-qingliang', 'shufa-shenmi', 'shufa-huanxiang', 'shufa-chuangxiang', 'shufa-linggan', 'shufa-yishujia'] }
}

function getFontList() {
	return FONT_ORDER.map(id => {
		const font = FONTS[id]
		return {
			id: font.id,
			name: font.name,
			description: font.description,
			category: font.category,
			family: font.family,
			googleFont: font.googleFont
		}
	})
}

function getFontsByCategory() {
	const result = {}
	for (const [categoryId, category] of Object.entries(FONT_CATEGORIES)) {
		result[categoryId] = {
			name: category.name,
			fonts: category.fonts.map(id => {
				const font = FONTS[id]
				return {
					id: font.id,
					name: font.name,
					description: font.description,
					family: font.family,
					googleFont: font.googleFont
				}
			})
		}
	}
	return result
}

function getFontById(fontId) {
	return FONTS[fontId] || FONTS['system-default']
}

function getDefaultFont() {
	return FONTS['system-default']
}

function getGoogleFontUrl(fontId) {
	const font = FONTS[fontId]
	if (!font || !font.googleFont) return null
	return `https://fonts.googleapis.com/css2?family=${font.googleFont.replace(/:/g, ':wght@').replace(/@/g, '&display=swap').replace('wght@wght@', 'wght@')}`
}

function getGoogleFontsUrl(fontIds) {
	const families = []
	fontIds.forEach(id => {
		const font = FONTS[id]
		if (font && font.googleFont) {
			families.push(`family=${font.googleFont}`)
		}
	})
	if (families.length === 0) return null
	return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

export default {
	FONTS,
	FONT_ORDER,
	FONT_CATEGORIES,
	getFontList,
	getFontsByCategory,
	getFontById,
	getDefaultFont,
	getGoogleFontUrl,
	getGoogleFontsUrl
}
