import { Field, InputType, Int } from 'type-graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class PageInput {
  @Field(() => Int, { description: 'Número de elementos ignorados', nullable: true })
  @Min(0, { message: 'O número mínimo de elementos ignorados é 0' })
  offset?: number;

  @Field(() => Int, { description: 'Número máximo de elementos a serem retornados', defaultValue: 10 })
  @Min(1, { message: 'O número limite mínimo é 1' })
  @Max(100, { message: 'O número limite máximo é 100' })
  limit!: number;
}
