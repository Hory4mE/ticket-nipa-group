import { IsNumber, IsOptional, ISortingConditionType } from "@nipacloud/framework/core/util/validator";
import _ from "lodash";

export interface IFilterableQueryParameter {
    limit?: number;
    offset?: number;
}

export interface ISortableQueryParameter<T> extends IFilterableQueryParameter {
    sortBy?: ISortingConditionType<T>[];
}

export abstract class PaginationQueryParameter<T> implements ISortableQueryParameter<T>, IFilterableQueryParameter {
    @IsNumber()
    @IsOptional()
    public readonly limit?: number = 10;

    @IsNumber()
    @IsOptional()
    public readonly offset?: number = 0;

    abstract sortBy?: ISortingConditionType<T>[];
}

export interface PaginationQuery<T> {
    limit: number;
    offset: number;
    sortBy?: ISortingConditionType<T>[];
}

export class PaginationQueryMaker {
    static make<T>(params: ISortableQueryParameter<T>): PaginationQuery<T> {
        const { limit, offset, sortBy } = params;
        if (_.isNil(limit) || _.isNil(offset)) {
            return null;
        }

        const paginationQuery: PaginationQuery<T> = {
            limit: limit,
            offset: offset,
            sortBy: sortBy,
        };

        return paginationQuery;
    }
}
