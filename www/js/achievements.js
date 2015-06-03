/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
	var obj = {}
	if (!game.achievements) game.achievements = []
	// Google Play Game Services
	if (window.googleplaygame) {
		googleplaygame.auth()
		// Unlock Achievement
		obj.unlock = function(id) {
			googleplaygame.isSignedIn(function(r) {
				if (r.isSignedIn && Z.inArray(id, game.achievements) == -1) {
					googleplaygame.unlockAchievement({achievementId:id})
					game.achievements.push(id)
				}
			})
		}
		// Increment Achievement Progress
		obj.increment = function(id, steps) {
			googleplaygame.isSignedIn(function(r) {
				if (r.isSignedIn && Z.inArray(id, game.achievements) == -1) {
					googleplaygame.incrementAchievement({achievementId:id,numSteps:steps})
				}
			})
		}
		googleplaygame.isSignedIn(function(r) {
			if (!r.isSignedIn) return
			var lnk = Z('<a>').attr('href', '#achievements').text("Achievements")
			Z('body > nav > a[href="#about"]').before(lnk)
			Z('a#achievements').on('click', function() {
				googleplaygame.showAchievements()
				return false
			})
		})
	}
	if (!obj.unlock) return
	Z(document).on('itembuilt', function(e) {
		var item = game.findItem(e)
		// Natural Breeder Achievement
		if (Z.inArray('CgkI8vC6qdsCEAIQAg', game.achievements) == -1 && item.bonus && item.bonus.rabbits > 0) {
			// Increment Natural Breeder Achievement
			if (obj.increment) obj.increment('CgkI8vC6qdsCEAIQAg', item.bonus.rabbits * 10)
			// Unlock
			setTimeout(function() {
				if (game.autoRate.rabbits >= 100) obj.unlock('CgkI8vC6qdsCEAIQAg')
			}, 1000)
		}
	})
})
