/**
 * Rabbit Farm
 * Copyright © 2015 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
	var obj = {}
	window.constants = window.constants || {}
	game.achievements = game.achievements || []
	// Google Play Game Services
	if (window.googleplaygame) {
		// Login
		try {
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
			// Show Achievements
			googleplaygame.isSignedIn(function(r) {
				if (!r.isSignedIn) return
				var lnk = Z('<a>').attr('href', '#achievements').text("Achievements")
				Z('body > nav > a[href="#about"]').before(lnk)
				Z('a[href="#achievements"]').on('click', function() {
					googleplaygame.showAchievements()
					return false
				})
			})
			// Achievement IDs
			constants.ACH_NATURAL_BREEDER = 'CgkI8vC6qdsCEAIQAg'
		} catch (e) {
			if (window.error_log) error_log("Problem with Google Play Game Services: " + e.message)
		}
	}
	if (!obj.unlock) return
	Z(document).on('itembuilt', function(e) {
		game.achievements = game.achievements || []
		var item = game.findItem(e)
		// Natural Breeder Achievement
		if (Z.inArray(constants.ACH_NATURAL_BREEDER, game.achievements) == -1 && item.bonus && item.bonus.rabbits > 0) {
			// Increment Natural Breeder Achievement
			if (obj.increment) obj.increment(constants.ACH_NATURAL_BREEDER, item.bonus.rabbits * 10)
			// Unlock
			Z(document).one('updatestate', function() {
				if (game.autoRate.rabbits >= 20) obj.unlock(constants.ACH_NATURAL_BREEDER)
			})
		}
	})
})
