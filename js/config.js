window.onReady(function() {
game = Z.extend(game, {
	load: function() {
		if (window.localStorage.game) {
			var i = Z.extend(true, {}, JSON.parse(window.localStorage.game), {items:game.items})
			game = Z.extend(true, game, i)
		}
		game.autoClick()
	},
	save: function() {
		window.localStorage.game = JSON.stringify(game)
	},
	click: function() {
		game.num++
		game.autoRate++
		game.showNum()
	},
	autoClick: function() {
		game.autoRate = 0
		game.items.forEach(function(i) {
			game.autoRate += i.bonus * i.level
		})
		game.num += game.autoRate / 35
		game.showNum()
		game.toAuto = setTimeout(game.autoClick, 1000 / 35)
		game.enableShopItems()
	},
	showNum: function() {
		if (!game.num) game.num = 0
		if (!game.autoRate) game.autoRate = 0
		var str
		if (!game.format && Intl && Intl.NumberFormat) {
			game.format = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format
		}
		if (game.format) {
			str = game.format(game.num)
		} else {
			str = game.num
		}
		game.save()
		Z('main > output').text(str)
		Z('main > small').text(game.autoRate)
	},
	openShop: function(e) {
		Z('#shop > ul').children().remove()
		game.items.forEach(function(i) {
			el = game.updateShopItem(i, Z('<li></li>'))
			Z('#shop > ul').append(el)
		})
		game.enableShopItems()
		Z('#shop').css({
			left:'100vw',display:'block'
		}).animate({
			left:0
		}, 600, 'ease-out', function() {
		})
	},
	updateShopItem: function(i, el) {
		var cost = Math.ceil(i.baseCost * Math.pow(1.4, i.level))
		if (!i.level) i.level = 0
		el.children().remove()
		el.attr('data-cost', cost)
		el.append('<span class="name">' + i.name + '</span>')
		el.append('<span class="level">' + i.level + '</span>')
		el.append('<span class="cost">' + (game.format ? game.format(cost) : cost) + '</span>')
		el.append('<span class="bonus">' + (i.bonus < 0 ? '0' + i.bonus : i.bonus) + '</span>')
		return el
	},
	closeShop: function(e) {
		Z('#shop').css({
		}).animate({
			left:'-' + Z('#shop').width() + 'px'
		}, 400, 'ease-in', function() {
			Z(this).hide()
		})
	},
	enableShopItems: function() {
		Z('#shop > ul > li').attr('disabled', null).each(function(i) {
			if (Number.parseInt(Z(this).attr('data-cost')) > game.num) Z(this).attr('disabled', 'disabled')
		})
	},
	buyItem: function(e) {
		var el = Z(e.target),
			bonus = Number.parseFloat(el.find('.bonus').text()),
			level = Number.parseFloat(el.find('.level').text()),
			name = el.find('.name').text(),
			cost = el.attr('data-cost'),
			item
		if (game.num < cost) return
		game.items.forEach(function(i) {
			if (i.name == name) item = i
		})
		item.level++
		game.num -= cost
		el = game.updateShopItem(item, el)
		game.enableShopItems()
		game.showNum()
	},
	items:[
		{
			name:'Carrots',
			baseCost:5,
			bonus:.1,
		},
		{
			name:'Nesting Hay',
			baseCost:10,
			bonus:.5,
		},
		{
			name:'Rabbit Cages',
			baseCost:30,
			bonus:1,
		},
		{
			name:'Breeding Expert',
			baseCost:70,
			bonus:5,
		},
		{
			name:'Rabbit Toys',
			baseCost:150,
			bonus:10,
		},
		{
			name:'Rabbit Perfume',
			baseCost:3000,
			bonus:200,
		},
		{
			name:'Rabbit Hormones',
			baseCost:10000,
			bonus:500,
		},
		{
			name:'Rabbit Viagra',
			baseCost:100000,
			bonus:1000,
		}
	],
})
Z('img#rabbit').on('click', game.click)
Z(document).on('click', 'a[href^="#"]', function(e) {
	e.preventDefault()
	e.stopPropagation()
})
Z(document).on('click', 'a[href="#shop"]', game.openShop)
Z(document).on('click', '#shop a[href="#main"]', game.closeShop)
Z(document).on('click', '#shop > ul > li:not([disabled])', game.buyItem)
})
