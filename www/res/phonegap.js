// On document load, fire deviceready event
window.addEventListener('load', function() {
	// http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
	var event = document.createEvent("HTMLEvents")
	event.initEvent('deviceready', true, true)
	event.eventName = 'deviceready'
	event.memo = {}
	document.dispatchEvent(event)
}, false)

// console
if (!window.console) var console = {
	error:function(){},
	log:function(){}
}

// device, http://docs.phonegap.com/en/3.0.0/cordova_device_device.md.html#Device
var device = {
	name:(function() {
		return (navigator.userAgent.match(/\((.*?;)?\s*(.*?(windows|linux).*?)\)/i))[2].trim()
	})(),
	platform:(function() {
		return (navigator.userAgent.match(/\w*(IE|Chrome|Safari|iPod|iPhone|Android)\w*/))[0].trim()
	})(),
	version:(function() {
		return (navigator.userAgent.match(/(IE|Chrome|Safari|Firefox)\/?\s*([\d\.]*)/))[2].trim()
	})(),
	uuid:'testing',
	cordova:'sam-testing'
}
device.model = device.name
console.log('userAgent: ' + navigator.userAgent)
console.log('device: ' + JSON.stringify(device))

// geolocation, http://docs.phonegap.com/en/2.9.0/cordova_geolocation_geolocation.md.html#Geolocation
if (!navigator) var navigator = {}
if (!navigator.geolocation) {
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
}
navigator.geolocation.getCurrentPosition(function(position) {
	console.log('geolocation: ' + position.latitude + ', ' + position.longitude)
}, function(error) {
	console.log('geolocation: ' + error.message)
})

// vibration, https://github.com/apache/cordova-plugin-vibration/blob/5adf530d3663226ad6913de6cfc8493672334023/doc/index.md
if (!navigator.vibrate) navigator.vibrate = function(t){}

// camera, http://docs.phonegap.com/en/3.0.0/cordova_camera_camera.md.html#Camera
camera = {
	getPicture:function() {},
	cleanup:function() {}
}

// for desktop testing
window.onerror = function(error) { console.error(error); }
if (device.platform == 'Chrome') device.platform = 'Android'
else if (device.platform.indexOf('Win') > -1) device.platform = 'Win32NT'
else if (device.platform.indexOf('Safari') > -1) device.platform = 'iOS'

// Augmented Reality: http://phonegap.com/blog/2012/10/09/wikitude-provides-users-with-augmented-reality-plugin/

// For Android Development: http://phonegap-pain-points.appspot.com/#/
