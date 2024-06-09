import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../db/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}
  async create(user, createPostDto: CreatePostDto) {
    const { tags } = createPostDto;
    const author = await this.usersService.findOne({
      id: user.sub,
    });
    let userId: number;
    let username: string;
    if (author) {
      userId = author.id;
      username = author.username;
    }
    const tagList = tags.map((tag) => {
      return {
        create: {
          name: tag,
        },
        where: {
          name: tag,
        },
      };
    });
    try {
      const post = await this.prismaService.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          category: createPostDto.category,
          type: createPostDto.type,
          coverUrl: createPostDto.coverUrl,
          authorId: userId,
          published: true,
          tags: {
            connectOrCreate: tagList,
          },
        },
      });
      if (post) {
        return {
          code: 200,
          msg: 'success',
        };
      }
    } catch (error) {
      console.log(error);
      return new BadRequestException();
    }
  }

  findAll() {
    return `This action returns all post`;
  }

  async findOne(id: string) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    if (post) {
      return post;
    } else {
      return null;
    }
  }

  async findByQueries(params: {
    page: number;
    types?: string;
    category?: string;
    tags?: string;
    query?: string;
  }) {
    const taglist = params.tags && params.tags?.split('+');
    const typelist = params.types && params.types?.split('+');
    const queryFilter: any = {};
    if (taglist?.length) {
      queryFilter.tags = {
        some: {
          name: {
            in: taglist,
          },
        },
      };
    }
    if (typelist?.length) {
      queryFilter.type = {
        in: typelist,
      };
    }
    if (params.category) {
      queryFilter.category = params.category;
    }
    if (params.query) {
      queryFilter.title = {
        contains: params.query,
      };
    }
    try {
      const total = await this.prismaService.post.count({
        where: queryFilter,
      });
      const postFilteredList = await this.prismaService.post.findMany({
        take: 10,
        skip: 10 * (params.page - 1),
        where: queryFilter,
        select: {
          author: {
            select: { username: true },
          },
          tags: {
            select: { name: true },
          },
          title: true,
          createTime: true,
          coverUrl: true,
          id: true,
        },
        orderBy: {
          createTime: 'asc',
        },
      });
      // let paginationRes: PaginationRes;
      // paginationRes.total = total;
      // paginationRes.totalPage = Math.ceil(total / 10);
      // paginationRes.current = params.page;
      // paginationRes.data = postFilteredList;
      return {
        code: 200,
        msg: '查询成功',
        data: {
          total,
          totalPage: Math.ceil(total / 10),
          current: params.page,
          list: postFilteredList,
        },
      };
    } catch (error) {
      console.log('error:', error);
      return new HttpException(
        'database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByAuthor(params: { userId: number; page: number; query?: string }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: params.userId,
      },
    });
    if (!user) {
      return new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const queryFiletr: any = {};
    if (params.query) {
      queryFiletr.title = {
        contains: params.query,
      };
    }
    try {
      const total = await this.prismaService.post.count({
        where: {
          authorId: params.userId,
          ...queryFiletr,
        },
      });
      const postFilteredList = await this.prismaService.post.findMany({
        take: 10,
        skip: 10 * (params.page - 1),
        where: { authorId: params.userId, ...queryFiletr },
        orderBy: {
          createTime: 'asc',
        },
      });
      return {
        code: 200,
        msg: '查询成功',
        data: {
          total,
          totalPage: Math.ceil(total / 10),
          current: params.page,
          list: postFilteredList,
        },
      };
    } catch (error) {
      console.log('error:', error);
      return new HttpException(
        'database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const exist = await this.prismaService.post.count({
      where: {
        id,
      },
    });
    if (!exist) {
      return {
        code: 500,
        msg: '该帖子不存在',
      };
    }
    const tagList = updatePostDto.tags.map((tag) => {
      return {
        create: {
          name: tag,
        },
        where: {
          name: tag,
        },
      };
    });
    try {
      const disconnectPrevTags = this.prismaService.post.update({
        where: {
          id,
        },
        data: {
          tags: {
            set: [],
          },
        },
      });
      const updatePost = this.prismaService.post.update({
        where: {
          id,
        },
        data: {
          title: updatePostDto.title,
          category: updatePostDto.category,
          content: updatePostDto.content,
          tags: {
            connectOrCreate: tagList,
          },
          type: updatePostDto.type,
          coverUrl: updatePostDto.coverUrl,
        },
      });
      const res = await this.prismaService.$transaction([
        disconnectPrevTags,
        updatePost,
      ]);
      if (res) {
        return {
          code: 200,
          msg: '修改成功',
        };
      }
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });
    if (!post) {
      return new HttpException('该帖子不存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prismaService.post.delete({
        where: {
          id: id,
        },
      });
      return {
        code: 200,
        msg: '删除成功',
      };
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
