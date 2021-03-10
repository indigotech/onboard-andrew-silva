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

  static GetPageFromInput = (page: PageInput | undefined, count: number): PageType => {
    if (!page) {
      page = new PageInput();
    }

    page.offset = page.offset != undefined ? page.offset : 0;
    page.limit = page.limit != undefined ? page.limit : 10;

    return {
      count: count,
      limit: page.limit,
      offset: page.offset,
      hasNextPage: page.limit == 0 ? false : page.offset + page.limit < count,
      hasPreviousPage: page.offset > 0 && count > 0,
    };
  };
}
