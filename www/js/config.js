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

game = Z.extend(game, {
	v:'1.0.4a',
	animals:{
		rabbits:0
	},
	autoRate:{
		rabbits:0
	},
	load: function() {
		if (window.localStorage.game) {
			// Merge Data
			game = Z.extend(
				true, // Merge Recursively
				game, // Game object
				JSON.parse(window.localStorage.game), // Saved Data
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
			delete i.img
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
		game.animals['rabbits']++
		game.autoRate['rabbits']++
		game.showNums()
		return false
	},
	autoClick: function() {
		game.autoRate['rabbits'] = 0
		game.items.forEach(function(i) {
			if (!i.level) i.level = 0
			game.autoRate['rabbits'] += i.bonus['rabbits'] * i.level
		})
		game.animals['rabbits'] += game.autoRate['rabbits']
		game.showNums()
		clearTimeout(game.toAuto)
		game.toAuto = setTimeout(game.autoClick, 1000)
		game.enableShopItems()
	},
	showNums: function() {
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
		str['rabbits'] = game.format.whole(game.animals['rabbits'])
		str['rps'] = game.format.rate(game.autoRate['rabbits'])
		game.save()
		// Animate Fast Number Increase
		if (game.autoRate['rabbits'] > 14) {
			str['rabbits'] = str['rabbits'].slice(0, -1) + '<img src="img/nums.gif"/>'
			// Replace Successive Digits with Animation
			while ((m = game.autoRate['rabbits'] / Math.pow(10, i++)) && m > 1.5) {
				str['rabbits'] = str['rabbits'].slice(0, str['rabbits'].indexOf('<') - 1).trim(',. ')
					+ '<img src="img/nums.gif"/>'
					+ str['rabbits'].substring(str['rabbits'].indexOf('<'))
			}
			// Add Commas
			var j = str['rabbits'].length
			if (str['rabbits'].split('<').length - 1 >= 3)
			for (i=0; i<str['rabbits'].split('<').length - 1; i++) {
				j = str['rabbits'].lastIndexOf('<', j - 1)
				if (i % 3 == 2)
				str['rabbits'] = [
					str['rabbits'].slice(0, j),
					str['rabbits'].slice(j)
				].join(',')
			}
		}
		Z('main > output').html(str['rabbits'])
		Z('main > small').text(str['rps'])
	},
	updateShopItem: function(i, el) {
		if (!i.level) i.level = 0
		var cost = Math.ceil(i.baseCost['rabbits'] * Math.pow(1.4, i.level))
		el.children().remove()
		el.attr('data-cost', cost)
		if (i.img) {
			el.append('<img src="img/' + i.img + '" alt="&#x2327;" />')
		}
		el.append('<span class="name">' + i.name + '</span>')
		el.append('<span class="level">' + i.level + '</span>')
		el.append('<span class="cost">' + game.format.whole(cost) + '</span>')
		el.append('<span class="bonus">' + game.format.rate(i.bonus['rabbits']) + '</span>')
		return el
	},
	enableShopItems: function() {
		Z('#shop > ul > li').attr('disabled', null).each(function(i) {
			if (Number.parseInt(Z(this).attr('data-cost')) > game.animals['rabbits']) Z(this).attr('disabled', 'disabled')
			if (Number.parseInt(Z(this).attr('data-cost')) < game.autoRate['rabbits']) Z(this).remove()
		})
	},
	items:[
		{
			name:'Carrots',
			baseCost:{ rabbits:5 },
			bonus:{ rabbits:.1 },
			img:'carrot.png'
		},
		{
			name:'Nesting Hay',
			baseCost:{ rabbits:20 },
			bonus:{ rabbits:.5 },
			img:'haybale.png'
		},
		{
			img:'rabbits/cage.png',
			name:'Rabbit Cages',
			baseCost:{ rabbits:50 },
			bonus:{ rabbits:1 }
		},
		{
			img:'rabbits/breeder.png',
			name:'Breeding Expert',
			baseCost:{ rabbits:200 },
			bonus:{ rabbits:5 }
		},
		{
			name:'Rabbit Toys',
			baseCost:{ rabbits:500 },
			bonus:{ rabbits:10 }
		},
		{
			name:'Rabbit Perfume',
			baseCost:{ rabbits:5000 },
			bonus:{ rabbits:100 }
		},
		{
			name:'Rabbit Hormones',
			baseCost:{ rabbits:15000 },
			bonus:{ rabbits:200 }
		},
		{
			name:'Rabbit Viagra',
			baseCost:{ rabbits:300000 },
			bonus:{ rabbits:1000 }
		}
	]
})
Z('#version').text(game.v)
Z('img#rabbit').on('tap click', game.clkRabbit)
Z('img#rabbit').on('selectstart contextmenu MSHoldVisual',false)
Z(document).on('tap click','a[href^="#"]',false)

// Close the Game Menu
game.closeMenu = function(e,t) {
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
	return false
}

// Open the Country Store
game.openShop = function(e) {
	if (c) return
	c = true
	var t = 600
	game.showModalBG(t)
	Z('#shop > ul').children().remove()
	game.items.forEach(function(i) {
		el = game.updateShopItem(i, Z('<li></li>'))
		Z('#shop > ul').append(el)
	})
	game.enableShopItems()
	Z('#shop').trigger('update').show().css({
		left:'100vw'
	}).animate({
		left:0
	}, t, 'ease-out')
}
// Close the Country Store
game.closeShop = function(e) {
	if (c) return
	c = true
	var t = 400
	game.hideModalBG(t)
	Z('#shop').css({
	}).animate({
		left:'-' + Z('#shop').width() + 'px'
	}, t, 'ease-in', function() {
		Z(this).hide()
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
game.hideModalBG = function(t) {
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
	})
}

// Hide Modals
game.hideModals = function(e) {
	if (Z('#about').css('display') == 'block')
		game.closeAbout()
	if (Z('#shop').css('display') == 'block')
		game.closeShop()
}
game.closeAll = function(e) {
	game.closeMenu()
	game.hideModals()
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
	Z('#about').animate({
		top:'100vh'
	}, t, function() {
		Z('#about').hide()
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
	game.items.forEach(function(i) {
		if (i.name == name) item = i
	})
	if (!item) return
	if (!item.level) item.level = 0
	item.level++
	game.animals['rabbits'] -= cost
	el = game.updateShopItem(item, el)
	game.enableShopItems()
	game.showNums()
}
// Restart Game
game.restart = function(e) {
	if (c) return
	c = true
	var g = Z.extend(true, {}, game)
	g.items.forEach(function(i) {
		delete i.baseCost
		delete i.bonus
		i.level = 0
	})
	game.items.forEach(function(i) {
		i.level = 0
	})
	g.animals['rabbits'] = 0
	window.localStorage.game = JSON.stringify(g)
	game.closeMenu()
	game.load()
}

var evtClick = 'tap click'
if (device.platform.indexOf('Android') != -1) evtClick = 'tap'

// User Interaction Events
Z(document).on(evtClick, '#shop > ul > li:not([disabled])', game.buyItem)
Z(document).on(evtClick, 'body > nav a[href="#main"]', game.closeMenu)
Z(document).on(evtClick, '#about a[href="#main"]', game.closeAbout)
Z(document).on(evtClick, '#shop a[href="#main"]', game.closeShop)
Z(document).on(evtClick, 'a[href="#destroy"]', game.restart)
Z(document).on(evtClick, 'a[href="#about"]', game.openAbout)
Z(document).on(evtClick, 'a[href="#menu"]', game.openMenu)
Z(document).on(evtClick, 'a[href="#shop"]', game.openShop)
Z(document).on(evtClick, '#modal-bg', game.hideModals)

Z(document).on(evtClick, function(){ setTimeout(tapComplete, 200) })

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

error_log = function(e) {
	Z.ajax({
		type:'POST',
		url:'http://1feed.me/log.php',
		data:{'msg':e.message + '; browser: ' + device.platform}
	})
}
if(Element.prototype.addEventListener)window.addEventListener('error',error_log)
else if(Element.prototype.attachEvent)window.attachEvent('error',error_log)
