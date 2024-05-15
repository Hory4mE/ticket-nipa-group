import { Database } from "@nipacloud/framework/data/sql";
import { IAppUnitOfWork } from "../abstraction/IAppUnitOfWork";
import { IAppUnitOfWorkFactory } from "../abstraction/IAppUnitOfWorkFactory";
import { AppUnitOfWork } from "./AppUnitOfWork";

export class AppUnitOfWorkFactory implements IAppUnitOfWorkFactory {
    public create(): IAppUnitOfWork {
        return new AppUnitOfWork(Database.instance);
    }
}
