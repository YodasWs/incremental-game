/**
 * Rabbit Farm
 * Copyright © 2015–2016 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */

// On DOM ready, fire deviceready event
;(function() {
	var a = function() {
		// http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
		var event = document.createEvent("HTMLEvents")
		event.initEvent('deviceready', true, true);event.eventName = 'deviceready';event.memo = {}
		document.dispatchEvent(event)
	},c=0,b=function(){if(!c){if(document.readyState=='complete'){a();c=true}}}
	if(document.readyState=='complete')b()
	else if(Element.prototype.addEventListener)document.addEventListener('readystatechange',b)
	else if(Element.prototype.attachEvent)document.attachEvent('onreadystatechange',b)
})();

// console
if (!window.console) var console = {
	error:function(){},
	log:function(){}
}

// device, http://docs.phonegap.com/en/3.0.0/cordova_device_device.md.html#Device
window.device = {
	model:(function() {
		var a = navigator.userAgent.match(/(Edge|MSIE|Android)/)
		if (a && a[0]) return a[0].trim()
		a = navigator.userAgent.match(/(Edge|MSIE|Trident|Android|Chrome|Safari|Firefox)/)
		if (a && a[0]) return a[0].trim()
		return 'unknown'
	})(),
	platform:(function() {
		var p = (navigator.userAgent.match(/\w*(Win|iOS|iPod|iPhone|iPad|Mac|Android)\w*/))[0].trim()
		if (p.search(/(iOS|iPod|iPhone|iPad)/) > -1) p = 'iOS'
		if (p.indexOf('Mac') > -1) p = 'MacIntel'
		if (p.indexOf('Win') > -1) p = 'Win32NT'
		return p
	})(),
	version:(function() {
		var v = navigator.userAgent.match(/(Edge|MSIE|Android)\/?\s*([\d\.]*)/)
		if (v && v[2]) return v[2].trim()
		return (navigator.userAgent.match(/(Chrome|Safari|Firefox)\/?\s*([\d\.]*)/))[2].trim()
	})(),
	isVirtual:true,
	uuid:'testing',
	cordova:'sam-testing'
}

navigator = navigator || {}
if (!navigator.maxTouchPoints) navigator.maxTouchPoints = 0

// geolocation, http://docs.phonegap.com/en/2.9.0/cordova_geolocation_geolocation.md.html#Geolocation
if (!navigator.geolocation)
navigator.geolocation = {
	getCurrentPosition:function(success,error,options) {
		if (typeof error === 'function')
			error({code:1,message:'Position Unavailable on this device'})
	},
	watchPosition:function(success,error,options) {
		if (typeof error === 'function')
			error({code:1,message:'Position Unavailable on this device'})
		return 'faulty'
	},
	clearPosition:function(){}
}
if (false)
navigator.geolocation.getCurrentPosition(function(position) {
	console.log('geolocation: ' + position.latitude + ', ' + position.longitude)
}, function(error) {
	console.log('geolocation: ' + error.message)
})

// vibration, https://github.com/apache/cordova-plugin-vibration/blob/5adf530d3663226ad6913de6cfc8493672334023/doc/index.md
navigator.vibrate = navigator.vibrate || function(t){}

// camera, http://docs.phonegap.com/en/3.0.0/cordova_camera_camera.md.html#Camera
window.camera = window.camera || {
	getPicture:function(){},
	cleanup:function(){}
}

// for desktop testing
console.log('userAgent: ' + navigator.userAgent)
console.log('device: ' + JSON.stringify(device))
