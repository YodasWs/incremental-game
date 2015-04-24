/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
// Prevent False Double Tap
var c = false,
tapComplete = function() {
	c = false
}
setTapComplete = function() {
	setTimeout(tapComplete, 200)
}

game = Z.extend(game, {
	v:'1.1.0-beta',
	animals:{
		rabbits:0
	},
	autoRate:{
		rabbits:0
	},
	clkRate:{
		rabbits:[]
	},
	load: function() {
		if (window.localStorage.game) {
			var savedGame = JSON.parse(window.localStorage.game)
			// Upgrade items Array to Object
			if (Array.isArray(savedGame.items)) {
				savedGame.items = Z.extend(true, {}, savedGame.items)
			}
			// Merge Data
			game = Z.extend(
				true, // Merge Recursively
				game, // Game object
				savedGame, // Saved Data
				{
					// Necessary Updated Game Data
					v:game.v,
					items:game.items
				}
			)
			// Update Save File
			if (game.rabbits) {
				game.animals['rabbits'] = game.rabbits
				delete game.rabbits
			}
			$(document).trigger('gameLoaded')
		}
		game.showShops()
		game.autoClick()
	},
	save: function() {
		// Copy Game Data
		var g = Z.extend(true, {}, game)
		// Delete Unnecessary Data
		Z.each(g.items, function(j,i) {
			for (k in i) {
				if (Z.inArray(k, [
					'finishTime',
					'hidden',
					'level'
				]) > -1) continue
				delete i[k]
			}
			if (!i.hidden)
				delete i.hidden
		})
		;[
			'autoRate',
			'clkRate',
			'format',
			'toAuto'
		].forEach(function(a) {
			delete g[a]
		})
		// Save
		window.localStorage.game = JSON.stringify(g)
	},
	clkRabbit: function() {
		game.animals['rabbits']++
		game.clkRate['rabbits'].push(Date.now())
		game.showNums('rabbits')
		return false
	},
	autoClick: function() {
		// Reset Auto Rates to Zero
		Z.each(game.autoRate, function(k) {
			game.autoRate[k] = 0
		})
		// Recalculate Auto Rates
		Z.each(game.items, function(j,i) {
			if (!i.level) i.level = 0
			if (!i.bonus) return true // continue
			Z.each(i.bonus, function(k) {
				game.autoRate[k] += i.bonus[k] * i.level
			})
		})
		// Add Auto Clicked Animals
		Z.each(game.autoRate, function(k) {
			game.animals[k] += game.autoRate[k]
		})
		// Build Pending Items
		Z.each(game.items, function(j,i) {
			if (i.finishTime && i.finishTime < Date.now()) {
				delete i.finishTime
				i.level++
			}
		})
		// Update Game State
		game.showNums('rabbits')
		clearTimeout(game.toAuto)
		game.toAuto = setTimeout(game.autoClick, 1000)
		if (Math.floor(Date.now() / 1000) % 5 == 0) game.save()
		if (Math.floor(Date.now() / 1000) % 60 == Math.floor(Math.random() * 10)) Z(document).trigger('chkStory')
		if ((!game.locs || game.locs.length == 0) && game.animals['rabbits'] > 99) Z(document).trigger('chkStory')
		game.enableShopItems()
	},
	showNums: function(animal) {
		var str = {}, i = 2, m
		try { if (!game.format && Intl && Intl.NumberFormat)
			game.format = {
				whole: (new Intl.NumberFormat('en-US', {maximumFractionDigits: 0})).format,
				rate: (new Intl.NumberFormat('en-US', {maximumFractionDigits: 1})).format
			}
		} catch (e) {
		}
		// For browsers without Intl
		if (!game.format) game.format = {
			whole: function(a) {
				// Get Int
				a = '' + Math.floor(a)
				// Add Commas
				for (var i=a.length-3; i>0; i-=4)
					a = [a.slice(0,i), a.slice(i)].join(',')
				return a
			},
			rate: function(a) {
				return Math.round(a * 10) / 10
			}
		}
		// Initialise any missing elements
		if (!game.autoRate[animal]) game.autoRate[animal] = 0
		if (!game.clkRate[animal]) game.clkRate[animal] = []
		if (!game.animals[animal]) game.animals[animal] = 0
		// Count manual clicks only within past second
		while (game.clkRate[animal].length && game.clkRate[animal][0] <= Date.now() - 1000) {
				game.clkRate[animal].shift()
		}
		str[animal] = game.format.whole(game.animals[animal])
		str['rps'] = game.format.rate(
			game.autoRate[animal] + game.clkRate[animal].length
		)
		// Animate Fast Number Increase
		if (game.autoRate[animal] > 14) {
			str[animal] = str[animal].slice(0, -1) + '<img src="img/nums.gif"/>'
			// Replace Successive Digits with Animation
			while ((m = game.autoRate[animal] / Math.pow(10, i++)) && m > 1.5) {
				str[animal] = str[animal].slice(0, str[animal].indexOf('<') - 1).trim(',. ')
					+ '<img src="img/nums.gif"/>'
					+ str[animal].substring(str[animal].indexOf('<'))
			}
			// Add Commas
			var j = str[animal].length
			if (str[animal].split('<').length - 1 >= 3)
			for (i=0; i<str[animal].split('<').length - 1; i++) {
				j = str[animal].lastIndexOf('<', j - 1)
				if (i % 3 == 2)
				str[animal] = [
					str[animal].slice(0, j),
					str[animal].slice(j)
				].join(',')
			}
		}
		Z('main > output').html(str[animal])
		Z('main > small').text(str['rps'])
	},
	updateShopItem: function(i, el) {
		if (!i.level) i.level = 0
		if (i.hidden) return ''
		if (!i.baseCost || !i.baseCost['rabbits']) return ''
		var mul = 1.4 + ((i.multiplier && i.multiplier['rabbits']) ? i.multiplier['rabbits'] : 0)
			cost = Math.ceil(i.baseCost['rabbits'] * Math.pow(mul, i.level))
		el.children().remove()
		el.attr('data-cost', cost)
		if (i.img) {
			el.append('<img src="img/' + i.img + '" alt="&#x2327;" />')
		}
		el.append('<span class="name">' + i.name + '</span>')
		el.append('<span class="level">' + i.level + '</span>')
		// Check if currently building item
		if (!i.finishTime || i.finishTime < Date.now()) {
			el.append('<span class="cost">' + game.format.whole(cost) + '</span>')
			if (i.bonus)
				el.append('<span class="bonus">' + game.format.rate(i.bonus['rabbits']) + '</span>')
			if (i.buildTime) {
				mul = (i.multiplier && i.multiplier['buildTime']) ? i.multiplier['buildTime'] : 1.5
				cost = Math.ceil(i.buildTime * Math.pow(mul, i.level))
				el.attr('data-buildTime', cost)
				el.append('<span class="buildTime">' + cost + ' sec</span>')
			}
		} else {
			// Pending Item Completion
			el.data('finishTime', i.finishTime).append('<span class="wait"></span>')
		}
		return el
	},
	enableShopItems: function() {
		Z('.shop > ul > li').attr('disabled', null).each(function(i) {
			var t = null
			if (!Z(this).children('.name').length) Z(this).attr('disabled', 'disabled')
			if (Number.parseInt(Z(this).attr('data-cost')) > game.animals['rabbits']) Z(this).attr('disabled', 'disabled')
			if (Z(this).children('.bonus').length && Number.parseInt(Z(this).attr('data-cost')) < game.autoRate['rabbits']) Z(this).remove()
			if (Z(this).children('.wait').length) {
				t = Math.floor((Number.parseInt(Z(this).data('finishTime')) - Date.now()) / 1000)
				Z(this).attr('disabled', 'disabled').children('.wait').html(t)
				if (t <= 0) game.updateShop(Z(this).parents('.shop').attr('id').trim('#'))
			}
		})
	}
})
Z('#version').text(game.v)
Z('img#rabbit').on('tap click', game.clkRabbit)
Z('img#rabbit').on('selectstart contextmenu MSHoldVisual',false)
Z(document).on('tap click','a[href^="#"]',false)

// Close the Game Menu
game.closeMenu = function(e,t) {
	if (Z('body > nav').css('display') != 'block') return
	t=t?t:400
	Z('body > nav').css({
		left:0
	}).animate({
		left:'-' + Z('body > nav').width() + 'px'
	}, t, function() {
		Z('body > nav').hide()
	})
	var l = Z('#main').css('left')
	Z('#main').css({
		left:(l && l != 'auto' ? l : '0px')
	}).animate({
		left:0
	}, t)
	setTapComplete()
}
// Open the Game Menu
game.openMenu = function(e) {
	if (c) return
	c = true
	if (Z('body > nav').css('display') != 'block') {
		var t=400
		Z('body > nav').show().css({
			left: '-' + Z('body > nav').width() + 'px'
		}).animate({
			left:'0px'
		}, t)
		var l = Z('#main').css('left')
		Z('#main').css({
			left:(l && l != 'auto' ? l : '0px')
		}).animate({
			left:Z('body > nav').width() + 'px'
		}, t)
	} else game.closeMenu()
	setTapComplete()
	return false
}

// Display Shop Buttons
game.showShops = function() {
	Z('#lnkShop').children('a').hide()
	if (game.locs) Z('#lnkShop').children('a').each(function(i, l) {
		var href = Z(this).attr('href').trim('#')
		if (Z.inArray(href, game.locs) > -1) 
			Z(this).show()
	})
	Z('#lnkShop > a[href="#shop"]').show()
}

// Open Shop
game.openShop = function(e) {
	if (c) return
	c = true
	var t = 600, href = Z(e.target).attr('href').trim('#')
	game.showModalBG(t)
	game.updateShop(href)
	// Slide Shop into View
	Z('#' + href + '').trigger('update').show().css({
		left:'100vw'
	}).animate({
		left:0
	}, t, 'ease-out')
}
// Update Shop Items
game.updateShop = function(href) {
	Z('#' + href + ' > ul').children().remove()
	Z.each(game.items, function(j,i) {
		if (i.loc != href) return
		var el = game.updateShopItem(i, Z('<li></li>'))
		Z('#' + href + ' > ul').append(el)
	})
	if (Z('#' + href + ' > ul').children('li').length) game.enableShopItems()
	else Z('#' + href + ' > ul').append('<li disabled>No items available at this time')
}

// Close Open Shop
game.closeShops = function(e) {
	if (c) return
	c = true
	Z('#lnkShop').children('a').each(function() {
		var href = Z(this).attr('href').trim('#'), t = 400
		if (Z('#' + href).css('display') == 'block') {
			game.hideModalBG(t)
			Z('#' + href).css({
			}).animate({
				left:'-' + Z('#' + href).width() + 'px'
			}, t, 'ease-in', function() {
				Z(this).hide()
			})
		}
	})
}

// Show Modal Background Screen
game.showModalBG = function(t) {
	t = t?t:400
	Z('main').css({
		'-webkit-filter':'blur(0)',
		filter:'blur(0)'
	}).animate({
		'-webkit-filter':'blur(2px)',
		filter:'blur(2px)'
	}, t*2)
	Z('#modal-bg').show().css({
		opacity:0
	}).animate({
		opacity:0.4
	}, t)
}
// Hide Modal Background Screen
game.hideModalBG = function(t,cb) {
	if (Z('#modal-bg').css('display') != 'block') {
		if (Z.isFunction(cb)) cb()
		return
	}
	t = t?t:400
	Z('main').css({
		'-webkit-filter':'blur(2px)',
		filter:'blur(2px)'
	}).animate({
		'-webkit-filter':'blur(0)',
		filter:'blur(0)'
	}, t*2)
	Z('#modal-bg').css({
		opacity:0.4
	}).animate({
		opacity:0
	}, t, function() {
		Z(this).hide()
		if (Z.isFunction(cb)) cb()
	})
}

// Hide Modals
game.hideModals = function(e) {
	if (Z('#about').css('display') == 'block')
		game.closeAbout(e)
	if (Z('#story').css('display') == 'block')
		game.closeStory(e)
	game.closeShops(e)
}
game.closeAll = function(e) {
	game.closeMenu()
	game.hideModals()
	setTapComplete()
	return false
}

// Open About Screen
game.openAbout = function(e) {
	if (c) return
	c = true
	var t = 400
	game.showModalBG(t)
	game.closeMenu(e,t/2)
	Z('#about').trigger('revealstart').show().css({
		top:'100vh'
	}).animate({
		top:'calc(100vh - ' + Z('#about').height() + 'px)'
	}, t, 'ease-out', function() {
		Z('#about').trigger('revealend')
	})
}
// Close About Screen
game.closeAbout = function(e) {
	if (c) return
	c = true
	var t = 200
	game.hideModalBG(t)
	try {
		Z('#about').animate({
			top:'100vh'
		}, t, function() {
			Z('#about').hide()
		})
	} catch (er) {
		Z('#about').animate({
			top:'100%'
		}, t, function() {
			Z('#about').hide()
		})
	}
}

// Close Story Modal
game.closeStory = function(e) {
	var t = 400
	game.hideModalBG(t)
	Z('#story').animate({
		opacity: 0
	}, t, 'ease-in', function() {
		Z(this).hide().children().remove()
	})
}

// Buy Item from Country Store
game.buyItem = function(e) {
	if (c) return
	c = true
	var el = Z(e.target),
		name = el.find('.name').text(),
		cost = el.attr('data-cost'),
		item
	if (game.animals['rabbits'] < cost) return
	Z.each(game.items, function(j,i) {
		if (i.name == name) item = i
	})
	if (!item) return
	if (!item.level) item.level = 0
	game.animals['rabbits'] -= cost
	if (!item.buildTime) {
		item.level++
	} else {
		item.finishTime = Date.now() + el.attr('data-buildTime') * 1000
	}
	game.save()
	game.updateShopItem(item, el)
	game.enableShopItems()
	game.showNums('rabbits')
}
// Restart Game
game.restart = function(e) {
	if (c) return
	c = true
	var g = Z.extend(true, {}, game)
	Z.each(g.items, function(j,i) {
		delete i.finishTime
		delete i.baseCost
		delete i.bonus
		i.level = 0
		if (i.story) delete g.items[j]
	})
	g.locs = []
	game.locs = []
	Z.each(g.animals, function(i) {
		delete g.animals[i]
	})
	g.animals['rabbits'] = 0
	window.localStorage.game = JSON.stringify(g)
	game.closeMenu()
	game.load()
	game.showShops()
}

var evtClick = 'tap click'
if (device.platform.indexOf('Android') != -1) evtClick = 'tap'

// User Interaction Events
Z(document).on(evtClick, '.shop > ul > li:not([disabled])', game.buyItem)
Z(document).on(evtClick, 'section.shop a[href="#main"]', game.closeShops)
Z(document).on(evtClick, 'body > nav a[href="#main"]', game.closeMenu)
Z(document).on(evtClick, '#about a[href="#main"]', game.closeAbout)
Z(document).on(evtClick, '#story a[href="#main"]', game.closeStory)
Z(document).on(evtClick, 'a[href="#destroy"]', game.restart)
Z(document).on(evtClick, 'a[href="#about"]', game.openAbout)
Z(document).on(evtClick, 'a[href="#menu"]', game.openMenu)
Z(document).on(evtClick, '#lnkShop > a', game.openShop)
Z(document).on(evtClick, '#modal-bg', game.hideModals)

Z(document).on(evtClick, setTapComplete)

// Pause/Resume Game
Z(document).on('pause', function() { clearTimeout(game.toAuto) })
Z(document).on('resume', game.autoClick)

// Keyboard Support
Z(document).on('keydown', function(e) {
	switch (e.keyCode) {
		// ESC from modals
		case 27:
			game.closeAll(e)
			break;
	}
})

// Mobile Button Support
Z(document).on('backbutton', game.closeAll)
Z(document).on('menubutton', game.openMenu)

})
window.error_log = function(msg) {
	if (Z && Z.ajax) Z.ajax({
		type:'POST',
		url:'http://1feed.me/log.php',
		data:{'msg':msg + '; browser: ' + device.platform}
	})
}

// Error Handling
window.onerror = function(msg, file, line) {
	error_log('msg':msg +  '; ' + file + ' line ' + line)
}
