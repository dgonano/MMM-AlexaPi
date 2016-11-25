/* global Module, Log, MM, config */

/* Magic Mirror
 * Module: MMM-AlexaPi
 *
 * By Dion Gonano
 * MIT Licensed.
 */

Module.register("MMM-AlexaPi", {

	requiresVersion: "2.0.0",

	// Default module config.
	defaults: {
			alexaTimeout: 10000
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.settingsVersion = 1;

		this.timeoutID = "";

		this.avsStatus = "waiting";
	},

	notificationReceived: function(notification, payload, sender) {
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
			if (notification === "ALEXAPI_ACTION") {
				this.sendSocketNotification(notification, payload);	
			}
		} else { 
			if (notification === "DOM_OBJECTS_CREATED") {
				//Started, send language
				this.sendSocketNotification("INIT", {lang: config.language});
			}
		}
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "AVSSTATUS") {
			//record message
			this.avsStatus = payload.status;

			//Clear and Set new timeout.
			var self = this;
			clearTimeout(this.timeoutID);
			this.timeoutID = setTimeout(function() {
				self.timeoutID = "";
				self.avsStatus = 'waiting';
				self.updateDom();
			}, this.config.alexaTimeout);
			//Request update now timeoutID is set
			this.updateDom();
		}
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "normal large light";

		var symbol =  document.createElement("span");
		symbol.className = "fa fa-microphone";
		//Check status
		if (this.avsStatus === "listening") {
			symbol.className = "fa fa-microphone";
			symbol.style = "color:blue";
		} else if (this.avsStatus === "processing") {
			symbol.className = "fa fa-spinner fa-spin";
		} else if (this.avsStatus === "speaking") {
			symbol.className = "fa fa-volume-up";
		} else if (this.avsStatus === "error") {
			symbol.className = "fa fa-warning";
			symbol.style = "color:red";
		} else if (this.avsStatus === "no_connection") {
			symbol.className = "fa fa-microphone-slash";
		}
		wrapper.appendChild(symbol);

		return wrapper;
	},
});
