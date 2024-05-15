import { Token } from "@nipacloud/framework/core/ioc";
import { IAppUnitOfWork } from "./IAppUnitOfWork";
export interface IAppUnitOfWorkFactory {
    create(): IAppUnitOfWork;
}
export const AppUnitOfWorkFactoryIdentifier = new Token<IAppUnitOfWorkFactory>("IAppUnitOfWorkFactory");
