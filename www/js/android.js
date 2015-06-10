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
window.skus = [
	'nesting_box'
]
window.onReady(function() {
	if (platform.indexOf('Android') == -1) return;
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

	// Touch Screen
	Z('body').addClass('touch')

	// Menu Height
	if (v < 4.4) Z('body>nav').css({height:h})

	/** License Check and In-App Billing **/
	if (window.inappbilling) {
//	if (window.inappbilling && window.AndroidLicensePlugin) {
		Z(document).on('gameLoaded', function() {
			// Check Android License
//			AndroidLicensePlugin.check(function(d) {
				// TODO: Verify d.signedData and d.signature on a server
				// Start InAppBilling
				inappbilling.init(function(r) {
					// In-app Billing Initiated!
					var prods = {}, txt = ''
					if (typeof r == 'string') r = JSON.parse(r)
					// Merge Item Listings
					if (game.showStory) {
						txt = "Successfully loaded " + r.length + " available products!"
						Z('#story').children().remove()
						Z('#story').append('<h1>Status Update</h1>').append('<a href="#main">&#xd7;</a>').append('<p>' + txt)
						Z('#story').append('<p style="font-family: monospace; white-space: pre-line">' + JSON.stringify(r))
						game.showStory()
					}
					try {
						Z.each(r, function(i,p) {
							prods[p.productId] = p
							prods[p.productId].hidden = false
						})
						game.items = Z.extend(true, game.items, prods)
					} catch (e) {
						txt = "Error merging items: " + e.message
						if (game.showStory) {
							Z('#story').children().remove()
							Z('#story').append('<h1>Error</h1>').append('<a href="#main">&#xd7;</a>').append('<p>' + txt)
							game.showStory()
						}
						error_log(txt)
					}
				}, function(e) {
					error_log('Could not start inappbilling: ' + e.message)
				}, {showLog:false}, skus)
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
