/**
 * Rabbit Farm
 * Copyright © 2015–2016 Sam Grundman
 *
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
window.onReady(function() {
	var obj = {}, achClasses = {}
	window.constants = window.constants || {}
	game.achievements = game.achievements || []
	// Google Play Game Services
	if (window.googleplaygame) {
		// Login
		try {
			googleplaygame.auth(function() {
				// Add Link to Show Achievements
				googleplaygame.isSignedIn(function(r) {
					if (!r.isSignedIn) return
					if (Z('body > nav > a[href="#achievements"]').length) return
					var lnk = Z('<a>').attr('href', '#achievements').text("Achievements")
					Z('body > nav > a[href="#about"]').before(lnk)
					Z('a[href="#achievements"]').on('click', function() {
						googleplaygame.showAchievements()
						game.closeAll()
						return false
					})
				})
			})
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
			// Achievement IDs
			constants.ACH_NATURAL_BREEDER = 'CgkI8vC6qdsCEAIQAg'
			constants.ACH_RABBIT_CAREGIVER = 'CgkI8vC6qdsCEAIQBQ'
			constants.ACH_PROTECTOR = 'CgkI8vC6qdsCEAIQBA'
			constants.ACH_DEFENDER = 'CgkI8vC6qdsCEAIQBg'
			achClasses.breeding = [
				{
					name:'ACH_NATURAL_BREEDER',
					animal:'rabbits',
					num:20
				},
				{
					name:'ACH_RABBIT_CAREGIVER',
					animal:'rabbits',
					num:100
				}
			]
			achClasses.foxAttack = [
				'ACH_DEFENDER',
				'ACH_PROTECTOR'
			]
		} catch (e) {
			obj = {}
			if (window.error_log) error_log("Problem with Google Play Game Services: " + e.message)
		}
	}
	if (!obj.unlock) return
	// Animal Breeder Achievements
	Z(document).on('itembuilt', function(e) {
		game.achievements = game.achievements || []
		var item = game.findItem(e)
		if (!item.bonus) return
		achClasses.breeding.forEach(function(a) {
			if (!item.bonus[a.animal]) return
			if (game.achievements.indexOf(constants[a.name]) != -1) return
			// Increment
			if (obj.increment) obj.increment(constants[a.name], item.bonus[a.animal] * 10)
			// Unlock
			Z(document).one('updatestate', function() {
				if (game.autoRate[a.animal] >= a.num) obj.unlock(constants[a.name])
			})
		})
	})
	if (!obj.increment) return
	// Fox Attack Achievements
	Z(document).on('foxattack', function(e){
		if (!e.success || !achClasses.foxAttack.length) return
		game.achievements = game.achievements || []
		achClasses.foxAttack.forEach(function(a){
			if (Z.inArray(constants[a], game.achievements) == -1) obj.increment(constants[a], 1)
		})
	})
})
