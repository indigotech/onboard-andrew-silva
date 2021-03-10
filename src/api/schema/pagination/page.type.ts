import { Field, Int, ObjectType } from 'type-graphql';

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
}
