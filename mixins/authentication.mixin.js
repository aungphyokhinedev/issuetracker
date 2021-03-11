const ApiGateway = require("moleculer-web");
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
				
                /*if(!_data)
					throw new Error("Unauthenticated");
				const _user = await ctx.call("v1.account.get", { id: _data._id });
				if(!_user)
					throw new Error("Unauthenticated");
		
				if(_data.token != _user.token)
				//throw new Error("Token is expired");
			
					if(_user.locked)
						throw new Error("User is locked");
				if(_user.blocked)
					throw new Error("User is blocked");
			
                
				// put user id in service meta
				// eslint-disable-next-line require-atomic-updates
				ctx.params.uid = _user._id;
				return _user;
                */
               return;
			}
			else{
				throw new ApiGateway.Errors.UnAuthorizedError("INVALID_TOKEN");
			}
		
			
		},
		
	}
};