import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  isURL,
} from 'class-validator';
export class CreatePostDto {
  @IsNotEmpty({ message: '标题不得为空' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: '内容不得为空' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'tag不能为空' })
  @IsArray({ message: 'tags必须为数组' })
  tags: Array<string>;

  @IsNotEmpty({ message: '类型不能为空' })
  @IsString()
  type: string;

  @IsNotEmpty({ message: '分区不能为空' })
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  // @IsUrl()
  coverUrl: string;
}
