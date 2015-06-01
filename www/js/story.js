/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
	/** Continue Story **/
	Z(document).on('chkStory', function() {
		if (!game.openLocs) game.openLocs = []
		if (Math.floor(Date.now() / 1000) % 10 == Math.floor(Math.random() * 4)) foxAttack()
		else if (Z.inArray('carpenter', game.openLocs) == -1 && game.animals['rabbits'] > 99) foxAttack()
	})

	/** Initialize Items **/
	Z(document).on('gameLoaded', function() {
		if (!game.locs) game.locs = []
		// Fencing
		if (!game.items.fencing) game.items.fencing = {
			hidden: true,
			level: 0
		}
		game.items.fencing = Z.extend(true, game.items.fencing, {
			name:'Fencing',
			img: 'carpenter/picket-fence.png',
			baseCost: { rabbits: 100 },
			multiplier: { rabbits: .6 },
			loc: 'carpenter',
			buildTime: 60,
			story: true
		})
	})

	// Prevent too many upgrades between story
	Z(document).on('itemconsumed', function(e) {
		switch (e.itemId) {
		case 'fencing':
			if (game.items.fencing.level > Math.log10(game.animals.rabbits) + 1)
				game.items.fencing.hidden = true
			break;
		}
	})

	game.showStory = function(cb) {
		game.hideModalBG(0,function(){game.showModalBG(200)})
		Z('#story').show().css({
			opacity: 0
		}).animate({
			opacity: 1
		}, 200, function() {
			if (Z.isFunction(cb)) cb()
		}).trigger('update')
	}

	var foxAttack = function() {
		if (Z('#story').css('display') == 'block') return
		if (game.animals.rabbits < 10) return
		game.hideModals()
		var txt = '', num = 0
		// Open Carpenter's Shop
		if (Z.inArray('carpenter', game.openLocs) == -1) {
			game.openLocs.push('carpenter')
			game.showShops()
		}
		if (!game.items.fencing) {
			setTimeout(function() { $(document).trigger('gameLoaded') }, 500)
			game.items.fencing = {
				hidden: true,
				level: 0
			}
		}
		// Attack!
		if (game.items.fencing.level > Math.log10(game.animals.rabbits)) {
			// Adequate Fencing Saved Rabbits
			txt = 'A fox was spotted in the night! Try as he might, thankfully he didn\'t get through the fence.'
			if (game.items.fencing.level > 1) game.items.fencing.level--
			game.items.fencing.hidden = (game.items.fencing.level - Math.log10(game.animals.rabbits) > 2)
			if (!game.items.fencing.level) game.items.fencing.hidden = false
		} else {
			// Need more fencing, lost rabbits
			num = Math.floor((Math.round(Math.random() * 10) + 10) / 100 * game.animals.rabbits)
			num = Math.max(num, game.autoRate.rabbits * 60)
			num = Math.min(game.animals.rabbits, num)
			txt = 'A fox came and carried away ' + game.format.whole(num) + ' rabbits in the night! We should build some fences&hellip;'
			game.items.fencing.hidden = false
			game.animals.rabbits -= num
		}
		// Display Event Modal
		Z('#story').children().remove()
		Z('#story').append('<h1>Fox Attack!</h1>').append('<a href="#main">&#xd7;</a>').append('<p>' + txt)
		game.showStory()
	},
	episode1 = function() {
		if (game.animals.rabbits < 20) return
		if (game.story) episode2()
		game.story = { episode: 1 }
	},
	episode2 = function() {
		if (game.story.episode > 2) episode3()
		game.story.episode = 2
	},
	episode3 = function() {
	}
})
