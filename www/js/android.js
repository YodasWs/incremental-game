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
	if (platform.indexOf('Android') == -1) return;
	var h = Z(window).height(), w = Z(window).width()
	// Placement of Shop Modal
	Z(document).on('update','.shop',function(){
		Z(this).css({position:'absolute',height:h*.7+'px',top:h*.2+'px'})
	})
	// Placement of Story Modal
	Z(document).on('update','#story',function(){
		Z(this).css({position:'absolute',height:h*.5+'px',top:h*.3+'px',width:w*.8+'px',left:w*.1+'px'})
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
			// Load Available Products
			inappbilling.getAvailableProducts(function(r) {
				if (typeof r == 'string') r = JSON.parse(r)
				// Merge Item Listings
				var prods = {}
				Z.each(r, function(i,p) {
					prod[p.productId] = p
					prod[p.productId].hidden = false
				})
				game.items = Z.extend(true, game.items, prods)
			}, function(e) {
				error_log('Could not load product list: ' + e)
			})
		}, function(e) {
			error_log('Could not start inappbilling: ' + e)
		}, {})
	})
	// Purchase In-app Product
	Z(document).on('buyitem', function(e) {
		inappbilling.buy(function(r) {
			Z(document).trigger(Z.Event('consumeitem', e))
		}, function(e) {
			error_log('Failed to make purchase: ' + e)
		}, e.itemId)
	})
	// Consume In-app Product
	Z(document).on('consumeitem', function(e) {
		inappbilling.consumePurchase(function(r) {
			Z(document).trigger(Z.Event('itemconsumed', e))
		}, function(e) {
			error_log('Failed to consume product: ' + e)
		}, e.itemId)
	})
})
