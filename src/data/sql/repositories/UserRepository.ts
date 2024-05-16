import { IUser } from "@app/data/abstraction/entities/IUsers";
import { UserQueryOption } from "@app/modules/users/query/UserQueryOption";
import { DatabaseRepository } from "@nipacloud/framework/data/sql";

export interface IUserRepository {
  list(option: UserQueryOption): Promise<IUser[]>;
  findById(id: string): Promise<IUser>;
  create(room: IUser): Promise<void>;
  updateById(id: string, room: Partial<IUser>): Promise<void>;
  deleteById(id: string): Promise<void>;
}

export class UserRepository
  extends DatabaseRepository<IUser>
  implements IUserRepository
{
  protected tableName: string = "users";
  list(option: UserQueryOption): Promise<IUser[]> {
    return this.executeQuery((query) => {
      const { username } = option;
      if (username) {
        query.where("username", username);
      }
      return query;
    });
  }
  findById(id: string): Promise<IUser> {
    return this.first((query) => query.where("user_id", id));
  }
  create(room: IUser): Promise<void> {
    return this.add(room);
  }
  updateById(id: string, room: Partial<IUser>): Promise<void> {
    return this.update(room, (query) => query.where("user_id", id));
  }
  deleteById(id: string): Promise<void> {
    return this.update({ is_delete: true }, (query) =>
      query.where("user_id", id)
    );
  }
}
