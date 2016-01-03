/**
 * Rabbit Farm
 * Copyright © 2015–2016 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
;(function() {
// Important DOM Objects
var tutorial = Z('<div id="tutorial">').text('Click the rabbit!'),
	rabbit = Z('img#rabbit'), c = 1, lnkShop = Z('#lnkShop a[href="#shop"]')
// Tell User to Visit Country Store
function visitStore(e) {
	if (++c > 4) {
		rabbit.off('tap click', visitStore)
		tutorial.addClass('down').offset({
			top:lnkShop.offset().top - 10,
			left:lnkShop.offset().left + lnkShop.width() / 2
		}).text('Visit the store to buy items!')
		lnkShop.one('tap click', function(e) {
			// Tell User to Buy Carrots
			Z('#shop').one('update', function(e) {
				setTimeout(function() {
					var item = Z(Z('#shop').find('li').get(0))
					tutorial.removeClass('down').appendTo('#shop').css({
						top:item.position().top+item.height()+'px',
						left:100+'px'
					}).text('Buy items to earn rabbits automatically!')
				}, 1000)
			})
		})
	}
}
// Position First Tutorial Bubble
;(function(el,cb){
	var c=0,b=function(){if(!c){if(el.readyState=='complete'){cb();c=true}}}
	if(el.readyState=='complete')b()
	else if(Element.prototype.addEventListener)el.addEventListener('readystatechange',b)
	else if(Element.prototype.attachEvent)el.attachEvent('onreadystatechange',b)
})(rabbit.get(0), function() {
	tutorial.offset({
		top:rabbit.offset().top + rabbit.height(),
		left:rabbit.offset().left + rabbit.width() / 2
	})
});
// Tell User to Keep Clicking Rabbit
rabbit.after(tutorial).one('tap click', function(e) {
	tutorial.text('Click for more rabbits!')
	rabbit.on('tap click', visitStore)
})
// Finish Tutorial
Z(document).one('itemconsumed',function(){tutorial.animate({opacity:0},100,function(){tutorial.remove()})})
})();
