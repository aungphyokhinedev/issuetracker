"use strict";

const DbMixin = require("../mixins/db.mixin");
const AuthenticationMixin = require("../mixins/authentication.mixin");
const AuthHelper = require("../common/auth.helper")
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "references",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("references"), AuthenticationMixin],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"title",
            "type",
            "url",
            "createdAt",
            "issueID"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
            issueID: "objectID",
			title: "string|min:3",
            type: "string|min:3",
            createdAt: "date",
            url:"string|min:3",
		}
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			 create: [
				"authenticate",
				function (ctx) {
					ctx.params.createdAt = new Date();
					ctx.params.creator = ctx.meta.account._id;

				}],
			update: [
				"authenticate",
				async function (ctx) {
					await AuthHelper.canEdit(ctx, true)			
				}
			],
			insert: [
				"authenticate",
				async function (ctx) {
					await AuthHelper.canEdit(ctx, true)			
				}
			],
			remove: [
				"authenticate",
				async function (ctx) {
					await AuthHelper.canEdit(ctx)	
				}
			]

		}
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		
	},

	/**
	 * Methods
	 */
	methods: {
		
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
      
	}
};
