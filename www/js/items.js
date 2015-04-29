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
		order:0,
		img:'carrot.png'
	},
	1:{
		name:'Nesting Hay',
		baseCost:{ rabbits:20 },
		loc:'shop',
		bonus:{ rabbits:.5 },
		order:0,
		img:'haybale.png'
	},
	2:{
		img:'rabbits/cage.png',
		name:'Rabbit Cages',
		baseCost:{ rabbits:50 },
		loc:'shop',
		order:0,
		bonus:{ rabbits:1 }
	},
	3:{
		img:'rabbits/breeder.png',
		name:'Rabbit Care Books',
		baseCost:{ rabbits:200 },
		loc:'shop',
		order:0,
		bonus:{ rabbits:5 }
	},
	4:{
		img:'rabbits/toy.png',
		name:'Rabbit Toys',
		baseCost:{ rabbits:500 },
		loc:'shop',
		order:0,
		bonus:{ rabbits:10 }
	},
	5:{
		img:'perfume.png',
		name:'Rabbit Perfume',
		baseCost:{ rabbits:5000 },
		loc:'shop',
		order:0,
		bonus:{ rabbits:100 }
	},
	6:{
		img:'needle.png',
		name:'Rabbit Hormones',
		baseCost:{ rabbits:15000 },
		loc:'shop',
		order:0,
		bonus:{ rabbits:200 }
	},
	7:{
		img:'pill.png',
		name:'Rabbit Viagra',
		baseCost:{ rabbits:300000 },
		loc:'shop',
		order:2,
		bonus:{ rabbits:1000 }
	},
	8:{
		name:'Nesting Box',
		loc:'shop',
		order:1,
		bonus:{ rabbits:500 },
		buildTime:120,
		price:0.99,
		price_currency_code:'USD'
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
			if (game.items[a].order != null && game.items[b].order != null && game.items[a].order != game.items[b].order)
				return Math.sign(game.items[a].order - game.items[b].order)
			if (game.items[a].baseCost && game.items[b].baseCost) {
				if (game.items[a].baseCost.rabbits && game.items[b].baseCost.rabbits)
					return Math.sign(game.items[a].baseCost.rabbits - game.items[b].baseCost.rabbits)
			}
			return 0
		})
	})
})
