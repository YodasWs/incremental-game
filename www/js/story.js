/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
	// Continue Story
	Z(document).on('chkStory', function() {
		if (Math.floor(Date.now() / 1000) % 10 == Math.floor(Math.random() * 4)) foxAttack()
	})

	/** Initialize Items **/

	// Fencing
	if (!game.items.fencing) game.items.fencing = {
		name:'Fencing',
		hidden: true,
		level: 0
	}
	game.items.fencing = Z.extend(true, game.items.fencing, {
		baseCost: { rabbits: 100 },
		multiplier: { rabbits: .6 },
		loc: 'carpenter',
		story: true
	})

	var foxAttack = function() {
		if (Z('#story').css('display') == 'block') return
		if (game.animals.rabbits < 10) return
		game.hideModals()
		var txt = '', num = 0
		// Open Carpenter's Shop
		if (!game.locs) {
			game.locs = ['carpenter']
			game.showShops()
		}
		// Attack!
		if (game.items.fencing.level > Math.log10(game.animals.rabbits)) {
			// Adequate Fencing Saved Rabbits
			txt = 'A fox was spotted in the night! Try as he might, thankfully he didn\'t get through the fence.'
			if (game.items.fencing.level > 1) game.items.fencing.level--
			game.items.fencing.hidden = (game.items.fencing.level - Math.log10(game.animals.rabbits) > 2)
		} else {
			// Need more fencing, lost rabbits
			num = Math.floor((Math.round(Math.random() * 5) + 5) / 100 * game.animals.rabbits)
			txt = 'A fox came and carried away ' + game.format.whole(num) + ' rabbits in the night! We should build some fences&hellip;'
			game.items.fencing.hidden = false
			game.animals.rabbits -= num
		}
		// Display Event Modal
		Z('#story').children().remove()
		game.hideModalBG(0,function(){game.showModalBG(200)})
		Z('#story').append('<h1>Fox Attack!</h1>').append('<a href="#main">&#xd7;</a>').append('<p>' + txt).show().css({
			opacity: 0
		}).animate({
			opacity: 1
		}, 200, function() {
		}).trigger('update')
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
