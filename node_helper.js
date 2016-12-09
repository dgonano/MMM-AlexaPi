/* Magic Mirror
 * Module: Display
 *
 * By Dion Gonano
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const path = require("path");
const url = require("url");
const fs = require("fs");
const exec = require('child_process').exec;
const os = require('os');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		var self = this;

		console.log("Starting node helper for: " + self.name);

		// load fall back translation
		self.loadTranslation("en");

		self.configData = {};

		//Allow GET actions
		this.expressApp.get('/alexapi', (req, res) => {
			var query = url.parse(req.url, true).query;

			if (query.action)
			{
				var result = self.executeQuery(query, res);
				if (result === true) {
					return;
				}
			}
			res.send({'status': 'error', 'reason': 'unknown_command', 'info': 'original input: ' + JSON.stringify(query)});
		});
	},
	
	executeQuery: function(query, res) {
		var self = this;

		if (query.action === 'AVSSTATUS')
		{
			res.send({'status': 'success'});
			self.sendSocketNotification(query.action, {status: query.status});
			return true;
		}
		if (query.action === 'AVSHB') {
			res.send({'status': 'success'});
			self.sendSocketNotification(query.action, {});
			return true;
		}
		return false;
	},
	
	checkForExecError: function(error, stdout, stderr, res) {
		if (error) {
			console.log(error);
			if (res) { res.send({'status': 'error', 'reason': 'unknown', 'info': error}); }
			return;
		}
		if (res) { res.send({'status': 'success'}); }
	},

	translate: function(data) {
		for (var key in this.translation) {
			var pattern = "%%TRANSLATE:" + key + "%%";
			while (data.indexOf(pattern) > -1) {
				data = data.replace(pattern, this.translation[key]);
			}
		}
		return data;
	},

	in: function(pattern, string) {
		return string.indexOf(pattern) !== -1;
	},

	format: function(string) {
		string = string.replace(/MMM-/ig, "");
		return string.charAt(0).toUpperCase() + string.slice(1);
	},


	loadTranslation: function(language) {
		var self = this;

		fs.readFile(path.resolve(__dirname + "/translations/" + language + ".json"), function(err, data) {
			if (err) {
				return;
			}
			else {
				self.translation = JSON.parse(data.toString());
			}
		});
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;

		if (notification === "INIT")
		{
			self.configData = payload;
			self.loadTranslation(self.configData.lang);

			// module started, do/send anything here required.
		}
		
		if (notification === "ALEXA_ACTION")
		{
			this.executeQuery(payload);
		}
		
	},
});
