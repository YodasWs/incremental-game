/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
game.items = {
	0:{
		name:'Carrots',
		baseCost:{ rabbits:5 },
		loc:'shop',
		bonus:{ rabbits:.1 },
		img:'carrot.png'
	},
	1:{
		name:'Nesting Hay',
		baseCost:{ rabbits:20 },
		loc:'shop',
		bonus:{ rabbits:.5 },
		img:'haybale.png'
	},
	2:{
		img:'rabbits/cage.png',
		name:'Rabbit Cages',
		baseCost:{ rabbits:50 },
		loc:'shop',
		bonus:{ rabbits:1 }
	},
	3:{
		img:'rabbits/breeder.png',
		name:'Rabbit Care Books',
		baseCost:{ rabbits:500 },
		loc:'shop',
		bonus:{ rabbits:5 }
	},
	4:{
		img:'rabbits/toy.png',
		name:'Rabbit Toys',
		baseCost:{ rabbits:3000 },
		loc:'shop',
		bonus:{ rabbits:10 }
	},
	5:{
		img:'perfume.png',
		name:'Rabbit Perfume',
		baseCost:{ rabbits:10000 },
		loc:'shop',
		bonus:{ rabbits:100 }
	},
	6:{
		img:'needle.png',
		name:'Rabbit Hormones',
		baseCost:{ rabbits:25000 },
		loc:'shop',
		bonus:{ rabbits:200 }
	},
	nesting_box:{
		name:'Nesting Box',
		loc:'shop',
		bonus:{ rabbits:500 },
		buildTime:120
	},
	7:{
		img:'pill.png',
		name:'Rabbit Viagra',
		baseCost:{ rabbits:300000 },
		loc:'shop',
		bonus:{ rabbits:1000 }
	}
}
window.onReady(function() {
	// Sort Items in Shops
	Z(document).on('gameLoaded', function() {
		game.itemSort = []
		Z.each(game.items, function(k,i) {
			game.itemSort.push(k)
		})
		game.itemSort.sort(function(a,b) {
			var r = 0
			if (game.items[a].order != null && game.items[b].order != null && game.items[a].order != game.items[b].order)
				r = Math.sign(game.items[a].order - game.items[b].order)
			if (r == 0 && game.items[a].baseCost && game.items[b].baseCost) {
				if (game.items[a].baseCost.rabbits && game.items[b].baseCost.rabbits)
					r = Math.sign(game.items[a].baseCost.rabbits - game.items[b].baseCost.rabbits)
			}
			return r
		})
	})
})
