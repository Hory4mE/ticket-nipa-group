import { AppUnitOfWorkFactoryIdentifier } from "@app/data/abstraction/IAppUnitOfWorkFactory";
import { AppUnitOfWorkFactory } from "@app/data/sql/AppUnitOfWorkFactory";
import { Context, KoaMiddlewareInterface, Middleware, MiddlewareExecutor } from "@nipacloud/framework/core/http";
import { Container } from "@nipacloud/framework/core/ioc";

@Middleware({ type: "before" })
export class RequestScopeInjectionMiddleware implements KoaMiddlewareInterface {
    async use(context: Context, next: MiddlewareExecutor) {
        const container = Container.of(context.state.requestScopeContainerId);
        container.set(AppUnitOfWorkFactoryIdentifier, new AppUnitOfWorkFactory());
        await next();
    }
}
