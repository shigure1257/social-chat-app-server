import { Injectable } from '@nestjs/common';
import { Md5Hash } from '../utils/lib';
import { PrismaService } from 'src/db/prisma.service';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileStoreService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
  async create(file: Express.Multer.File) {
    const md5 = Md5Hash(file);
    console.log(md5, 'md5值');
    const exist = await this.prismaService.picture.findUnique({
      where: {
        md5: md5,
      },
    });
    if (exist) {
      return {
        code: 200,
        fileName: file.originalname,
        path: exist.path,
      };
    }
    const picDir = path.join(__dirname, '..', '..', 'public');
    const staticHost =
      this.configService.get('HOST') +
      ':' +
      this.configService.get('PORT') +
      '/file-store/';
    try {
      fs.readdirSync(path.join(picDir));
    } catch (error) {
      fs.mkdirSync(path.join(picDir));
    }
    const fileStoreName = `${new Date().getTime()}-${file.originalname}`;
    fs.writeFileSync(path.join(picDir, fileStoreName), file.buffer);
    await this.prismaService.picture.create({
      data: {
        path: staticHost + fileStoreName,
        md5: md5,
      },
    });
    return {
      code: 200,
      filename: file.originalname,
      path:
        this.configService.get('HOST') +
        ':' +
        this.configService.get('PORT') +
        '/file-store/' +
        fileStoreName,
    };
  }

  findAll() {
    return `This action returns all fileStore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileStore`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileStore`;
  }
}
