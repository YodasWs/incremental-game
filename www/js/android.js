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
})
