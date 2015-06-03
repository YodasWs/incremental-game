/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
	// Use Cordova Globalization Plugin
	try {
		// Safari throws a fit over Intl
		if (Intl && Intl.NumberFormat) return
	} catch (e) {
	}
	if (!navigator.globalization) return
	navigator.globalization.getNumberPattern(function(p) {
	})
	game.format = {
		whole: (function(a) {
		}),
		rate: function(a) {
		},
		money: function(s,c) {
		}
	}
})
