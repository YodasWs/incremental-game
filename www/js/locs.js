/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
game.locs = {
	shop:{
		name:'Country Store',
		type:'shop'
	},
	carpenter:{
		name:'Carpenter\'s Shop',
		type:'shop'
	}
}
window.onReady(function() {
	Z.each(game.locs, function(i,l) {
		// Build Links to Locations
		switch (l.type) {
		case 'shop':
			var lnk = Z('<a>').attr('href', '#' + i).text(l.name).addClass('shop')
			Z('body > nav > a[href="#destroy"]').before(lnk.clone())
			Z('#lnkShop').append(lnk.clone())
			break;
		}
	})
})
