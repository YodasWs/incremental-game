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
	// Padding for Shop Item Images
	Z(document).on('update','#shop',function(){Z(this).children('ul').children('li').css({padding:'5px 10px 5px 2.5rem'})})
	// Menu Height
	Z('body>nav').css({height:Z(window).height()})
	// Touch Screen
	Z('body').addClass('touch')
})
