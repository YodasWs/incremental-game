/**
 * Rabbit Farm
 * Copyright © 2015–2016 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
/**
 * Polyfills and Plugins for Android
 */
game.skus = [
	'nesting_box'
]
window.onReady(function() {
	if(device.platform.indexOf('Android')==-1)return
	var v = device.version ? Number.parseFloat(device.version) : 0,
		h = Z(window).height(), w = Z(window).width()

	// Placement of Shop Modal
	Z(document).on('update','.shop',function(){
		Z(this).css({position:'absolute',height:'auto','min-height':h*.7+'px',top:h*.2+'px'})
	})
	// Placement of Story Modal
	Z(document).on('update','#story',function(){
		Z(this).css({position:'absolute',height:'auto','min-height':h*.5+'px',top:h*.3+'px',width:w*.8+'px',left:w*.1+'px'})
	})

	// Placement of About Modal
	Z(document).on('reveal','#about',function(){
		Z('html,body').scrollTop(0)
		Z(this).css({top:h+'px'}).animate({
			top:'200px'
		}, 400)
	})

	// Touch Screen
	Z('body').addClass('touch')

	// Menu Height
	if (v < 4.4) Z('body>nav').css({height:h})

	/** License Check and In-App Billing **/
	if (window.inappbilling) {
//	if (window.inappbilling && window.AndroidLicensePlugin)
		Z(document).one('gameLoaded', function() {
			// Check Android License
//			AndroidLicensePlugin.check(function(d) {
				// TODO: Verify d.signedData and d.signature on a server
				// Start InAppBilling
				inappbilling.init(function() {
					// In-app Billing Initiated!
					inappbilling.getAvailableProducts(function(r) {
						var prods = {}, txt = ''
						if (typeof r == 'string') r = JSON.parse(r)
						error_log("Successfully loaded " + r.length + " available products!" + "\n" + JSON.stringify(r))
						// TODO: Merge Item Listings
						try {
							Z.each(r, function(i,p) {
								prods[p.productId] = p
								prods[p.productId].hidden = false
							})
							game.items = Z.extend(true, game.items, prods)
							Z(document).trigger('needsort')
						} catch (e) {
							error_log("Error merging items: " + e.message)
						}
					}, function(e) {
						error_log('Could not get available products; ' + e.message)
					})
				}, function(e) {
					error_log('Could not start inappbilling: ' + e.message)
				}, game.skus)
//			}, function(e) {
//				error_log('Could not check Android App License; ' + e)
//			})
		})
		// Purchase In-app Product
		Z(document).on('buyitem', function(e) {
			inappbilling.buy(function(r) {
				Z(document).trigger(Z.Event('consumeitem', e))
			}, function(m) {
				error_log('Failed to make purchase: ' + m)
				Z(document).trigger(Z.Event('refunditem', e))
			}, e.itemId)
		})
		// Consume In-app Product
		Z(document).on('consumeitem', function(e) {
			inappbilling.consumePurchase(function(r) {
				Z(document).trigger(Z.Event('itemconsumed', e))
			}, function(m) {
				error_log('Failed to consume product: ' + m)
				Z(document).trigger(Z.Event('refunditem', e))
			}, e.itemId)
		})
	}
})
