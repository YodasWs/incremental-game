/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
/**
 * Polyfills and Plugins for Android
 */
window.onReady(function() {
	if (device.platform.indexOf('Android') == -1) return;
	var h = Z(window).height()
	// Placement of Shop Modal
	Z(document).on('update','.shop,#story',function(){
		Z(this).css({height:h*.7+'px',top:h*.2+'px'})
	})
	// Menu Height
	Z('body>nav').css({height:h})
	// Touch Screen
	Z('body').addClass('touch')
	// Placement of About Modal
	Z(document).on('revealstart revealend','#about',function(){
		Z(this).css({top:(h-200)+'px'})
	})
	// Build In-app Products
	Z(document).on('gameLoaded', function() {
		if (!inappbilling) return true
		inappbilling.init(function() {
			// In-app Billing Initiated!
			inappbilling.getPurchases(function(r) {
				// TODO: Received list of prior purchases, now what?
			}, function(e) {
				error_log('Could not load purchase history: ' + e)
			})
		}, function(e) {
			error_log('Could not start inappbilling: ' + e)
		}, {})
	})
})
