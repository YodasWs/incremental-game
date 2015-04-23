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
		name:'Breeding Expert',
		baseCost:{ rabbits:200 },
		loc:'shop',
		bonus:{ rabbits:5 }
	},
	4:{
		img:'rabbits/toy.png',
		name:'Rabbit Toys',
		baseCost:{ rabbits:500 },
		loc:'shop',
		bonus:{ rabbits:10 }
	},
	5:{
		img:'perfume.png',
		name:'Rabbit Perfume',
		baseCost:{ rabbits:5000 },
		loc:'shop',
		bonus:{ rabbits:100 }
	},
	6:{
		img:'needle.png',
		name:'Rabbit Hormones',
		baseCost:{ rabbits:15000 },
		loc:'shop',
		bonus:{ rabbits:200 }
	},
	7:{
		name:'Rabbit Viagra',
		baseCost:{ rabbits:300000 },
		loc:'shop',
		bonus:{ rabbits:1000 }
	}
}
