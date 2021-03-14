"use strict";
//const { ObjectId } = require('mongodb');
const DbMixin = require("../mixins/db.mixin");
const AuthenticationMixin = require("../mixins/authentication.mixin");
const AuthHelper = require("../common/auth.helper")
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "issues",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("issues"), AuthenticationMixin],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"name",
			"tags",
			"type",
			"who",
			"what",
			"when",
			"where",
			"why",
			"how",
			"location",
			"province",
			"city",
			"township",
			"address",
			"status",
			"serverity",
			"creator",
			"approver",
			"createdAt"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			tags: "string|min:3",
			type: "string|min:3",
			// creator: "objectID",
			createdAt: "date",
			/*who: "string|min:3",
			what: "string|min:3",
			when: "date",
			where: "string|min:3",
			why: "string|min:3",
			how: "string|min:3",
			location:"any",
			state:"string|min:3",
			province:"string|min:3",
			city:"string|min:3",
			township:"string|min:3",
			address:"string|min:3",*/
			status: "string|min:3",
			serverity: "number|integer|positive"
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

		},
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

		if (this.adapter.collection) {
			await this.adapter.collection.createIndex({ name: 1 });
		}
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
