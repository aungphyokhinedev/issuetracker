"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Values =  require("../common/values")
const ApiGateway = require("moleculer-web");
const AuthenticationMixin = require("../mixins/authentication.mixin");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "auth",
	mixins: [AuthenticationMixin],

	/**
	 * Settings
	 */
	settings: {

	},
	hooks: {

		before: {
			passwordChange:[
				"authenticate"
			]
		}
	},
	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
        sign: {
			params: {
				data: "object",
			},
			async handler(ctx) {
				const privateKey = fs.readFileSync("./config/private.pem");
				return await jwt.sign(ctx.params.data, privateKey, { algorithm: 'RS256' });
			}
		},
		verify: {
			params: {
				token: "string",
			},
			async handler(ctx) {
				try{
				const publicKey = fs.readFileSync("./config/public.pem");
				return await jwt.verify(ctx.params.token, publicKey);
				}
				catch(e){
					throw new ApiGateway.Errors.UnAuthorizedError("INVALID_TOKEN");
				}
			}
		},
		login: {
			rest: {
				method: "POST",
				path: "/login"
			},
			params: {
				email: "string",
				password: "string",
			},
			async handler(ctx) {
				const accounts =  await ctx.call("accounts.find", { query : {email: ctx.params.email } });
				if(accounts.length > 0) {
					const account = accounts[0];
				
					const validate = await ctx.call("crypto.validate",{data:ctx.params.password, cipher: account.password});
					if(validate){
						if(account.status === Values.account.status.blocked) throw new ApiGateway.Errors.UnAuthorizedError("ACCOUNT_BLOCKED");
						if(account.status === Values.account.status.locked) throw new ApiGateway.Errors.UnAuthorizedError("ACCOUNT_LOCKED");


						const token =  await ctx.call("auth.sign", { data: {id: account._id,time: new Date()} });
						this.setLogin(ctx, account);
						return {
							...account,
							token: token
						};
					}
					else{
						throw new ApiGateway.Errors.UnAuthorizedError("INVALID_PASSWORD");
					}
					
				}
				else{
					throw new ApiGateway.Errors.UnAuthorizedError("INVALID_USER");
				}
				
			}
		},
		passwordChange: {
			params: {
				password: "string",
				new: "string",
				confirm: "string",
			},
			async handler(ctx) {
				if(ctx.params.new !== ctx.params.confirm) throw new ApiGateway.Errors.UnAuthorizedError("PASSWORD_NOT_MATCH");

				//hashing password
				const hashed = await ctx.call("crypto.hash", { data: ctx.params.new, saltRounds: 5 });
				const update = await ctx.call("accounts.update",{
					id: ctx.meta.account._id, password: hashed
				})
				
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
		async setLogin(ctx, account) {	
			await ctx.call("accounts.update",
			{ 
				id: account._id, 
				lastLoggedInDate: Date.now(), 
			});
			
		},
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
