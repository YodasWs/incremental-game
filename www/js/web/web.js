/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.dir = ''
window.onReady(function() {
	// Remove redundant PhoneGap Build www directory from image source
	Z('img').each(function() {
		t = Z(this)
		if (t.attr('src').indexOf('www/') == 0)
			t.attr('src', t.attr('src').substr(4))
	})
})
