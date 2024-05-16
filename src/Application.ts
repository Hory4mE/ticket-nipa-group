import { HttpApplication } from "@nipacloud/framework/core/http/HttpApplication";

// import { ReservationController } from "@app/modules/reservations/ReservationController";
import {
  ErrorResponderMiddleware,
  RequestContainerLifeCycleMiddleware,
  RequestIdGeneratorMiddleware,
  RequestLoggerMiddleware,
} from "@nipacloud/framework/core/http";
import { RequestScopeInjectionMiddleware } from "./middlewares/RequestScopeInjectionMiddleware";
import { TicketController } from "./modules/tickets/TicketController";
import { UserController } from "./modules/users/UserController";

export class Application extends HttpApplication {
  constructor() {
    super();

    this.useMiddleware(RequestIdGeneratorMiddleware);
    this.useMiddleware(RequestContainerLifeCycleMiddleware);
    this.useMiddleware(RequestLoggerMiddleware);
    this.useMiddleware(RequestScopeInjectionMiddleware);
    this.useMiddleware(ErrorResponderMiddleware);

    this.useController(TicketController);
    this.useController(UserController);
    // this.useController(ReservationController);
  }

  public async start(port: number): Promise<void> {
    super.start(port);
  }
}
