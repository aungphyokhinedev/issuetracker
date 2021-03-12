"use strict";

const Values = require("../common/values");
const DbMixin = require("../mixins/db.mixin");
const ApiGateway = require("moleculer-web");
const AuthenticationMixin =  require("../mixins/authentication.mixin");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "accounts",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("accounts"),AuthenticationMixin],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"email",
            "role",
            "photo",
            "description",
			"password",
			"status",
            "createdAt",
			"lastLoggedInDate"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			email: "email",
            role: "string|min:3",
            createdAt: "date",
            status:"string|min:3",
			password: "string|min:8"
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
			async create(ctx) {
                ctx.params.createdAt = new Date();
				
				//hashing password
				const hashed = await ctx.call("crypto.hash", { data: ctx.params.password, saltRounds: 5 });
				ctx.params.password = hashed;

				//status is to control the account - locked, block, etc
				ctx.params.status = Values.account.status.active;
			}
		},
		after:{
			"*": function(ctx, res) {
                // Remove password
                delete res.password;
				
                // Please note, must return result (either the original or a new)
                return res;
            },
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
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		
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
       
        if(this.adapter.collection){
            await this.adapter.collection.createIndex({ email: 1 });
        }
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
