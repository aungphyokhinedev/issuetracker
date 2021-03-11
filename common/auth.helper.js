const ApiGateway = require("moleculer-web");
module.exports = {

		async canEdit(ctx, ownerOnly) {
            if(!ctx.meta.account) throw new ApiGateway.Errors.UnAuthorizedError("INVALID_ACCOUNT");

            if(ctx.meta.account) {
                if(!ownerOnly) {
                    if(ctx.meta.account.role === "super-admin") return;
                    if(ctx.meta.account.role === "admin") return;
                }
                
                const issue = await ctx.call("issues.get", {id: ctx.params.id});
                if(ctx.meta.account._id === issue.creator){
                    return;
                }
                else{
                    throw new ApiGateway.Errors.UnAuthorizedError("INVALID_OWNER");
                }
                
            }

			
			
		},
		
	
};