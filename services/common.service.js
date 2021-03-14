"use strict";
const Values = require("../common/values")
const Townships = require("../common/townships")
module.exports = {
	name: "common",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		values: {
			rest: "/values",
			async handler(ctx) {
				return Values;
			}
		},
        Townships: {
			rest: "/townships",
			async handler(ctx) {
				return Townships;
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
