import { Field, InputType, Int } from 'type-graphql';
import { Min } from 'class-validator';

@InputType()
export class PageInput {
  @Field(() => Int, { description: 'Número de elementos ignorados', nullable: true })
  @Min(0, { message: 'O número de elementos ignorados precisa ser igual ou maior que zero' })
  offset?: number;

  @Field(() => Int, { description: 'Número máximo de elementos a serem retornados', defaultValue: 10 })
  @Min(0, { message: 'O número limite precisa ser igual ou maior que zero' })
  limit!: number;
}
