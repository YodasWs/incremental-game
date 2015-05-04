/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
game = Z.extend(game, {
	v:'1.1.0-beta+20150503',
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
			'itemSort',
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
				Z(document).trigger(Z.Event('itembuilt', { itemName:i.name }))
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
		// Initialise any missing elements
		if (!game.autoRate[animal]) game.autoRate[animal] = 0
		if (!game.clkRate[animal]) game.clkRate[animal] = []
		if (!game.animals[animal]) game.animals[animal] = 0
		// Count manual clicks only within past second
		while (game.clkRate[animal].length && game.clkRate[animal][0] <= Date.now() - 1000) {
				game.clkRate[animal].shift()
		}
		// Build Temporary Format Functions if not loaded
		if (!game.format) game.format = {
			whole: function(s) { return s },
			rate: function(s) { return s },
			time: function(s) { return s }
		}
		str[animal] = game.format.whole(game.animals[animal])
		str['rps'] = game.format.rate(
			game.autoRate[animal] + game.clkRate[animal].length
		)
		// Animate Fast Number Increase
		if (game.autoRate[animal] > 14) {
			str[animal] = str[animal].slice(0, -1) + '<img src="www/img/nums.gif"/>'
			// Replace Successive Digits with Animation
			while ((m = game.autoRate[animal] / Math.pow(10, i++)) && m > 1.5) {
				str[animal] = str[animal].slice(0, str[animal].indexOf('<') - 1).trim(',. ')
					+ '<img src="www/img/nums.gif"/>'
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
		if (i.hidden || !i.name) return ''
		if (game.story && game.story.episode && item.episode && item.episode > game.story.episode) return ''
		if ((!i.baseCost || !i.baseCost['rabbits']) && (!i.price || !i.price_currency_code)) return ''
		var mul = 1.4 + ((i.multiplier && i.multiplier['rabbits']) ? i.multiplier['rabbits'] : 0),
			cost, price, time = 0
		if (!el) Z('.shop li').each(function() {
			var z = Z(this)
			if (z.find('.name').text() == i.name && z.parents('.shop').attr('id') == i.loc) el = z
		})
		if (!el) return ''
		el.children().remove()
		if (i.img) {
			el.append('<img src="www/img/' + i.img + '" alt="&#x2327;" />')
		}
		el.append('<span class="name">' + i.name + '</span>')
		el.append('<span class="level">' + i.level + '</span>')
		// Check if currently building item
		if (!i.finishTime || i.finishTime < Date.now()) {
			if (i.baseCost && i.baseCost['rabbits']) {
				cost = Math.ceil(i.baseCost['rabbits'] * Math.pow(mul, i.level))
				el.attr('data-cost', cost)
				el.append('<span class="cost">' + game.format.whole(cost) + '</span>')
			}
			if (i.bonus)
				el.append('<span class="bonus">' + game.format.rate(i.bonus['rabbits']) + '</span>')
			if (i.price && i.price_currency_code)
				el.append('<span class="cost price">' + game.format.money(i.price, i.price_currency_code) + '</span>')
			if (i.buildTime) {
				mul = (i.multiplier && i.multiplier['buildTime']) ? i.multiplier['buildTime'] : 1.5
				time = Math.ceil(i.buildTime * Math.pow(mul, i.level))
				el.attr('data-buildTime', time)
				el.append('<span class="buildTime">' + game.format.time(time) + '</span>')
			}
		} else {
			// Pending Item Completion
			el.data('finishTime', i.finishTime).append('<span class="wait"></span>')
		}
		return el
	},
	enableShopItems: function() {
		var li = []
		Z('.shop > ul > li').each(function(i) {
			var t = null
			if (!Z(this).children('.name').length) li.push(i)
			if (Number.parseInt(Z(this).attr('data-cost')) > game.animals['rabbits']) li.push(i)
			if (Z(this).children('.bonus').length && Number.parseInt(Z(this).attr('data-cost')) < game.autoRate['rabbits']) Z(this).remove()
			if (Z(this).children('.wait').length) {
				t = Math.floor((Number.parseInt(Z(this).data('finishTime')) - Date.now()) / 1000)
				Z(this).children('.wait').html(game.format.time(t))
				if (t < 0) game.updateShop(Z(this).parents('.shop').attr('id').trim('#'))
				li.push(i)
			}
		})
		Z('.shop > ul > li').each(function(i) {
			if (li.indexOf(i) == -1) Z(this).removeAttr('disabled')
			else Z(this).attr('disabled', 'disabled')
		})
	}
})
Z('#version').text(game.v)
Z('img#rabbit').on('tap click', game.clkRabbit)
Z('img#rabbit').on('selectstart contextmenu MSHoldVisual',false)
Z(document).on('tap click','a[href^="#"]',function(e){e.preventDefault()})

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
}
// Open the Game Menu
game.openMenu = function(e) {
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
	var t = 600, href = Z(e.target).attr('href').trim('#')
	game.showModalBG(t)
	game.updateShop(href)
	// Slide Shop into View
	Z('#' + href + '').show().css({
		left:'100vw'
	}).animate({
		left:0
	}, t, 'ease-out')
}
// Update Shop Items
game.updateShop = function(href) {
	var el, i=0, k=0
	Z('#' + href + ' > ul').children().remove()
	for (i=0; i<game.itemSort.length; i++) {
		k = game.itemSort[i]
		if (game.items[k].loc != href) continue
		el = game.updateShopItem(game.items[k], Z('<li></li>'))
		Z('#' + href + ' > ul').append(el)
	}
	if (Z('#' + href + ' > ul').children('li').length) game.enableShopItems()
	else Z('#' + href + ' > ul').append('<li disabled>No items available at this time')
	Z('#' + href).trigger('update')
}

// Close Open Shop
game.closeShops = function(e) {
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
	return false
}

// Open About Screen
game.openAbout = function(e) {
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

// Buy Item from Shop
game.buyItem = function(e) {
	var el = Z(e.target),
		name = el.find('.name').text(),
		cost = el.attr('data-cost'),
		item, data, k
	// Validate Purchase
	if (cost && game.animals['rabbits'] < cost) return
	Z.each(game.items, function(j,i) {
		if (i.name == name) {
			item = i
			k = j
		}
	})
	if (!item) return
	if (!item.level) item.level = 0
	// Consolidate Item Data for Purchase/Consume
	data = { itemName:item.name, itemId:k }
	if (cost) data.cost = cost
	if (el.attr('data-buildTime'))
		data.buildTime = el.attr('data-buildTime')
	// Finalize Purchase
	if (item.price)
		Z(document).trigger(Z.Event('buyitem', Z.extend(data, {price:item.price})))
	else
		Z(document).trigger(Z.Event('itemconsumed', data))
}

// Consume Bought Item
Z(document).on('itemconsumed', function(e) {
	var item
	Z.each(game.items, function(j,i) {
		if (i.name == e.itemName) item = i
	})
	if (!item) return false
	// Buy Item and Update Game State
	if (e.cost) game.animals['rabbits'] -= e.cost
	if (!e.buildTime) {
		Z(document).trigger(Z.Event('itembuilt', { itemName:item.name }))
	} else {
		item.finishTime = Date.now() + e.buildTime * 1000
	}
})

// Finish Building Item
Z(document).on('itembuilt', function(e) {
	if (!e.itemName && !e.itemId) return false
	var item
	Z.each(game.items, function(j,i) {
		if (i.name == e.itemName || j == e.itemId) item = i
	})
	if (!item) return false
	if (item.finishTime && item.finishTime >= Date.now()) return false
	delete item.finishTime
	item.level++
	game.save()
	game.updateShopItem(item)
	game.enableShopItems()
	game.showNums('rabbits')
})

// Restart Game
game.restart = function(e) {
	game.closeMenu()
	// Reset Items
	Z.each(game.items, function(j,i) {
		delete i.finishTime
		delete i.hidden
		i.level = 0
		if (i.story || i.episode) delete game.items[j]
	})
	// Reset Game State
	;[
	].forEach(function(a) {
		delete game[a]
	})
	game.locs = []
	Z.each(game.animals, function(i) {
		delete game.animals[i]
	})
	game.animals['rabbits'] = 0
	// Save and Load
	window.localStorage.game = JSON.stringify(game)
	game.load()
	game.showShops()
}

var evtClick = 'tap click'
if (platform.indexOf('Android') != -1) evtClick = 'tap'

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

// Load Tutorial
Z(document).one('gameLoaded', function(e) {
	if (game.animals.rabbits) return
	var a,m,d=document,t='script'
	a=d.createElement(t);m=d.getElementsByTagName(t)[0];a.async=1
	a.src='js/tutorial.js';m.parentNode.insertBefore(a,m)
	a=d.createElement('link');a.rel="stylesheet"
	a.href='css/tutorial.css';m.parentNode.insertBefore(a,m)
})

// Build Localization Rules
Z(document).one('gameLoaded', function(e) {
	try { if (Intl && Intl.NumberFormat)
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
	game.format.time = function(sec) {
		var min = 0, hr = 0, d = 0, time = []
		if (sec >= 60) {
			min = Math.floor(sec / 60)
			if (min >= 60) {
				hr = Math.floor(min / 60)
				if (hr >= 24)
					d = Math.floor(hr / 24)
				hr = hr % 24
			}
			min = min % 60
		}
		sec = sec % 60
		if (d) time.push(d + 'd')
		if (hr) time.push(hr + 'h')
		if (min) time.push(min + 'm')
		if (sec) time.push(sec + 's')
		return time.length ? time.join(' ') : '0s'
	}
	game.format.money = (function() {
		/*
		try { if (Intl && Intl.NumberFormat)
			return function(s,c) {
				return (new Intl.Numberformat('en-US', { style: 'currency', currency: c })).format(s)
			}
		} catch (e) {
		}
		/**/
		return function(s,c) {
			var d = 2, p = '.'
			switch (c) {
				case 'USD':c='$';break
				case 'GBP':c='£';break
				case 'EUR':c='&euro;';p=',';break
				case 'KRW':c='&#x20a9;';d=0;break
				case 'CNY':case'JPY':c='&#xa5;';d=0;break
				default:c+=' '
			}
			return c+ game.format.whole(Math.floor(s)) +
				(d? p + (Math.floor((s - Math.floor(s)) * Math.pow(10, d)) / Math.pow(10, d) + '').substr(-1 * d) : '')
		}
	})()
})

})
window.error_log = function(msg) {
	if (Z && Z.ajax) Z.ajax({
		type:'POST',
		url:'http://1feed.me/log.php',
		data:{'msg':msg + '; browser: ' + platform}
	})
}

// Error Handling
window.onerror = function(msg, file, line) {
	error_log(msg +  '; ' + file + ' line ' + line)
}
