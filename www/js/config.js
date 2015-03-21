/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
game = Z.extend(game, {
	v:'1.0.2a',
	rabbits:0,
	autoRate:0,
	load: function() {
		if (window.localStorage.game) {
			// Merge Data
			game = Z.extend(
				true,
				game,
				JSON.parse(window.localStorage.game), // Saved Data
				{
					// Necessary Updated Game Data
					v:game.v,
					items:game.items
				}
			)
		}
		game.autoClick()
	},
	save: function() {
		// Copy Game Data
		var g = Z.extend(true, {}, game)
		// Delete Unnecessary Data
		g.items.forEach(function(i) {
			delete i.baseCost
			delete i.bonus
		})
		;[
			'autoRate',
			'format',
			'toAuto'
		].forEach(function(a) {
			delete g[a]
		})
		// Save
		window.localStorage.game = JSON.stringify(g)
	},
	clkRabbit: function() {
		game.rabbits++
		game.autoRate++
		game.showNums()
	},
	autoClick: function() {
		game.autoRate = 0
		game.items.forEach(function(i) {
			if (!i.level) i.level = 0
			game.autoRate += i.bonus * i.level
		})
		var clicksPerSecond = 1
		if (game.autoRate > 100)
			clicksPerSecond = 10
		if (game.autoRate > 1000)
			clicksPerSecond = 20
		if (game.autoRate > 5000)
			clicksPerSecond = 35
		game.rabbits += game.autoRate / clicksPerSecond
		game.showNums()
		game.toAuto = setTimeout(game.autoClick, 1000 / clicksPerSecond)
		game.enableShopItems()
	},
	showNums: function() {
		var str = {}
		if (!game.format && Intl && Intl.NumberFormat) {
			game.format = {
				whole: new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format,
				rate: new Intl.NumberFormat('en-US', {maximumFractionDigits: 1}).format
			}
		}
		if (game.format) {
			str['rabbits'] = game.format.whole(game.rabbits)
			str['rps'] = game.format.rate(game.autoRate)
		} else {
			str['rabbits'] = game.rabbits
			str['rps'] = game.autoRate
		}
		game.save()
		Z('main > output').text(str['rabbits'])
		Z('main > small').text(str['rps'])
	},
	updateShopItem: function(i, el) {
		var cost = Math.ceil(i.baseCost * Math.pow(1.4, i.level))
		if (!i.level) i.level = 0
		el.children().remove()
		el.attr('data-cost', cost)
		el.append('<span class="name">' + i.name + '</span>')
		el.append('<span class="level">' + i.level + '</span>')
		el.append('<span class="cost">' + (game.format ? game.format.whole(cost) : cost) + '</span>')
		el.append('<span class="bonus">' + (game.format ? game.format.rate(i.bonus) : i.bonus) + '</span>')
		return el
	},
	enableShopItems: function() {
		Z('#shop > ul > li').attr('disabled', null).each(function(i) {
			if (Number.parseInt(Z(this).attr('data-cost')) > game.rabbits) Z(this).attr('disabled', 'disabled')
		})
	},
	items:[
		{
			name:'Carrots',
			baseCost:5,
			bonus:.1,
		},
		{
			name:'Nesting Hay',
			baseCost:20,
			bonus:.5,
		},
		{
			name:'Rabbit Cages',
			baseCost:50,
			bonus:1,
		},
		{
			name:'Breeding Expert',
			baseCost:100,
			bonus:5,
		},
		{
			name:'Rabbit Toys',
			baseCost:300,
			bonus:10,
		},
		{
			name:'Rabbit Perfume',
			baseCost:5000,
			bonus:100,
		},
		{
			name:'Rabbit Hormones',
			baseCost:15000,
			bonus:200,
		},
		{
			name:'Rabbit Viagra',
			baseCost:300000,
			bonus:1000,
		}
	]
})
Z('#version').text(game.v)
Z('img#rabbit').on('tap click', game.clkRabbit)
Z(document).on('tap click', 'a[href^="#"]', function(e) {
	e.preventDefault()
	e.stopPropagation()
})
// Close the Game Menu
game.closeMenu = function(e,t) {
	var time = t ? t : 400
	Z('body > nav').css({
		left:0
	}).animate({
		left:'-' + Z('body > nav').width() + 'px'
	}, time, function() {
		Z('body > nav').hide()
	})
	var l = Z('#main').css('left')
	Z('#main').css({
		left:(l && l != 'auto' ? l : '0px')
	}).animate({
		left:0
	}, time)
}
// Open the Game Menu
Z(document).on('tap click', 'a[href="#menu"]', function(e) {
	if (Z('body > nav').css('display') != 'block') {
		var time = 400
		Z('body > nav').show().css({
			left: '-' + Z('body > nav').width() + 'px'
		}).animate({
			left:'0px'
		}, time)
		var l = Z('#main').css('left')
		Z('#main').css({
			left:(l && l != 'auto' ? l : '0px')
		}).animate({
			left:Z('body > nav').width() + 'px'
		}, time)
	} else game.closeMenu()
})
Z(document).on('tap click', 'body > nav a[href="#main"]', game.closeMenu)
// Open the Country Store
Z(document).on('tap click', 'a[href="#shop"]', function(e) {
	Z('#shop > ul').children().remove()
	game.items.forEach(function(i) {
		el = game.updateShopItem(i, Z('<li></li>'))
		Z('#shop > ul').append(el)
	})
	game.enableShopItems()
	Z('#shop').show().css({
		left:'100vw'
	}).animate({
		left:0
	}, 600, 'ease-out', function() {
	})
})
// Close the Country Store
Z(document).on('tap click', '#shop a[href="#main"]', function(e) {
	Z('#shop').css({
	}).animate({
		left:'-' + Z('#shop').width() + 'px'
	}, 400, 'ease-in', function() {
		Z(this).hide()
	})
})
// Open About Screen
Z(document).on('tap click', 'a[href="#about"]', function(e) {
	game.closeMenu(e,200)
	$('#about').show().css({
		top:'100vh'
	}).animate({
		top:'calc(100vh - ' + $('#about').height() + 'px)'
	}, 400, 'ease-out')
})
// Close About Screen
Z(document).on('tap click', '#about a[href="#main"]', function(e) {
	$('#about').animate({
		top:'100vh'
	}, 200, function() {
		$('#about').hide()
	})
})
// Buy Item from Country Store
Z(document).on('tap click', '#shop > ul > li:not([disabled])', function(e) {
	var el = Z(e.target),
		bonus = Number.parseFloat(el.find('.bonus').text()),
		level = Number.parseFloat(el.find('.level').text()),
		name = el.find('.name').text(),
		cost = el.attr('data-cost'),
		item
	if (game.rabbits < cost) return
	game.items.forEach(function(i) {
		if (i.name == name) item = i
	})
	if (!item.level) item.level = 0
	item.level++
	game.rabbits -= cost
	el = game.updateShopItem(item, el)
	game.enableShopItems()
	game.showNums()
})
// Restart Game
Z(document).on('tap click', 'a[href="#destroy"]', function(e) {
	var g = Z.extend(true, {}, game)
	g.items.forEach(function(i) {
		delete i.baseCost
		delete i.bonus
		i.level = 0
	})
	game.items.forEach(function(i) {
		delete i.level
	})
	g.rabbits = 0
	window.localStorage.game = JSON.stringify(g)
	game.load()
})
})
