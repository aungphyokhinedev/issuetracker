"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const ApiGateway = require("moleculer-web");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "auth",

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
        sign: {
            rest: {
				method: "GET",
				path: "/sign"
			},
			params: {
				data: "object",
			},
			async handler(ctx) {
				const privateKey = fs.readFileSync("./config/private.pem");
				return await jwt.sign(ctx.params.data, privateKey, { algorithm: 'RS256' });
			}
		},
		verify: {
            rest: {
				method: "GET",
				path: "/verify"
			},
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
