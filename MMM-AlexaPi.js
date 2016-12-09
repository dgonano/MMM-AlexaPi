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
			alexaTimeout: 30000,
			alexaHBTimeout: 10000
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.settingsVersion = 1;

		this.timeoutID = "";
		this.HBtimeoutID = "";

		this.avsStatus = "no_connection";
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
			//reset heartbeat
			this.resetHBTimer();

			//record message
			this.avsStatus = payload.status;

			//Clear and Set new timeout.
			var self = this;
			clearTimeout(this.timeoutID);
			this.timeoutID = setTimeout(function() {
				self.timeoutID = "";
				self.avsStatus = 'idle';
				self.updateDom();
			}, this.config.alexaTimeout);
			//Request update now timeoutID is set
			this.updateDom();
		}
		if (notification === "AVSHB") {
			this.resetHBTimer();
			if (this.avsStatus === "no_connection") {
				this.avsStatus = 'idle';
				this.updateDom();
			}
		}
	},

	resetHBTimer: function() {
		var self = this;
		clearTimeout(this.HBtimeoutID);
		this.HBtimeoutID = setTimeout(function() {
			//cancel other timers
			clearTimeout(self.timeoutID);
			//do action of HB timout
			self.HBtimeoutID = "";
			self.avsStatus = 'no_connection';
			self.updateDom();
		}, this.config.alexaHBTimeout);
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "normal large light";

		var symbolWrapper =  document.createElement("span");
		symbolWrapper.className = "fa fa-stack";
		//Check status
		if (this.avsStatus == "idle") {
			var symbol = document.createElement("i");
			symbol.className = "fa fa-microphone fa-stack-1x";
			symbolWrapper.appendChild(symbol);
		} else if (this.avsStatus === "recording") {
			// var symbol1 = document.createElement("i");
			var symbol2 = document.createElement("i");
			// symbol1.className = "fa fa-microphone fa-stack-1x";
			symbol2.className = "fa fa-circle-o-notch fa-stack-1x";
			// symbolWrapper.appendChild(symbol1);
			symbolWrapper.appendChild(symbol2);
		} else if (this.avsStatus === "processing") {
			var symbol = document.createElement("i");
			symbol.className = "fa fa-circle-o-notch fa-spin fa-stack-1x";
			symbolWrapper.appendChild(symbol);
		} else if (this.avsStatus === "playback") {
			var symbol = document.createElement("i");
			symbol.className = "fa fa-volume-up fa-stack-1x";
			symbolWrapper.appendChild(symbol);
		} else if (this.avsStatus === "error") {
			var symbol = document.createElement("i");
			symbol.className = "fa fa-warning fa-stack-1x";
			symbolWrapper.appendChild(symbol)
		} else if (this.avsStatus === "no_connection") {
			var symbol = document.createElement("i");
			symbol.className = "fa fa-microphone-slash fa-stack-1x";
			symbolWrapper.appendChild(symbol);
		}
		wrapper.appendChild(symbolWrapper);

		return wrapper;
	},
});
