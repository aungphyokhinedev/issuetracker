"use strict";
const bcrypt = require("bcryptjs");
const ApiGateway = require("moleculer-web");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "crypto",

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
        hash: {
            rest: {
				method: "GET",
				path: "/hashed"
			},
			params: {
				data: "string",
				saltRounds: "number"
			},
			async handler(ctx) {
				const _salt = bcrypt.genSaltSync(ctx.params.saltRounds);
				return await bcrypt.hashSync(ctx.params.data,_salt );
			}
		},
		validate: {
            rest: {
				method: "GET",
				path: "/validate"
			},
			params: {
				data: "string",
				cipher: "string"
			},
			async handler(ctx) {
				return await bcrypt.compareSync(ctx.params.data, ctx.params.cipher);
				
			}
		},
		
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
