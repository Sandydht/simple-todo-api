import { IsNotEmpty } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  start_date: string;

  @IsNotEmpty()
  end_date: string;

  @IsNotEmpty()
  is_done: boolean;

  @IsNotEmpty()
  label_color: string;
}