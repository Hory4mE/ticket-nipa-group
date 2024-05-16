/* eslint-disable prettier/prettier */
import { IListUserQueryParameter } from "./ListUserQueryParameter";

export interface UserQueryOption {
  username?: string;
}

export class UserQueryOptionMaker {
  static fromUserListQueryParams(params: IListUserQueryParameter) {
    const option: UserQueryOption = {};
    if (params.username) {
      option.username = params.username;
    } else {
      option.username = "";
    }
    return option;
  }
}
