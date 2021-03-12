const ApiGateway = require("moleculer-web");
const Values = require("../common/values")
module.exports = {
	methods: {
		async authenticate(ctx) {
			
			if (ctx.meta.token ){
			
				//decode token
				const data = await ctx.call("auth.verify", { token: ctx.meta.token });
				if(data){
					//if account is already there
					if(ctx.meta.account && ctx.meta.account._id === data.id) {
						return
					}
					else{
						const account = await ctx.call("accounts.get", {id: data.id});
						if(account){
							console.log("acc status", account.status)
							if(account.status === Values.account.status.blocked) throw new ApiGateway.Errors.UnAuthorizedError("ACCOUNT_BLOCKED");
							if(account.status === Values.account.status.locked) throw new ApiGateway.Errors.UnAuthorizedError("ACCOUNT_LOCKED");

							ctx.meta.account = account;
							
						}
						else{
							throw new ApiGateway.Errors.UnAuthorizedError("INVALID_ACCOUNT");
						}
					}
					
					
				}
				else{
					throw new ApiGateway.Errors.UnAuthorizedError("INVALID_TOKEN");
				}
			
               return;
			}
			else{
				throw new ApiGateway.Errors.UnAuthorizedError("INVALID_TOKEN");
			}
		
			
		},
		
	}
};