import { isNumber } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import { PageInput } from './page.input';

@ObjectType()
export class PageType {
  @Field(() => Int, { description: 'Total number of elements', nullable: true })
  count?: number;

  @Field(() => Int, { description: 'Number of skipped elements' })
  offset!: number;

  @Field(() => Int, { description: 'Maximum number of elements' })
  limit!: number;

  @Field({ description: 'Indicate if there is a posterior page' })
  hasNextPage!: boolean;

  @Field({ description: 'Indicate if there is a previous page' })
  hasPreviousPage!: boolean;

  static getPageFromInput = (page: PageInput, count: number): PageType => {
    page.offset = page.offset != undefined ? page.offset : 0;

    return {
      count: count,
      limit: page.limit,
      offset: page.offset,
      hasNextPage: page.limit == 0 ? false : page.offset + page.limit < count,
      hasPreviousPage: page.offset > 0 && count > 0,
    };
  };
}
