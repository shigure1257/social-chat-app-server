import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Public } from '../public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user, createPostDto);
  }

  @Post('getMyPosts')
  getPersonalPosts(@Request() req, @Body() params) {
    return this.postService.findByAuthor({
      userId: req.user['sub'],
      page: params.page,
      query: params.query,
    });
  }

  @Post('getPostList')
  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  findByQueriesPage(@Body() params: QueryPostDto) {
    console.log('post params', params);
    return this.postService.findByQueries(params);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
