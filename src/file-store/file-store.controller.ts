import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileStoreService } from './file-store.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/public.decorator';
import { ConfigService } from '@nestjs/config';
@Controller('file-store')
export class FileStoreController {
  constructor(
    private readonly fileStoreService: FileStoreService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .addFileTypeValidator({ fileType: new RegExp(/['jepg','png']/) })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file, 'file control');
    const res = await this.fileStoreService.create(file);
    return res;
    // return {
    //   code: 200,
    //   filename,
    //   path:
    //     this.configService.get('HOST') +
    //     ':' +
    //     this.configService.get('PORT') +
    //     '/file-store/' +
    //     file.filename,
    // };
  }

  @Get()
  findAll() {
    return this.fileStoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileStoreService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileStoreService.remove(+id);
  }
}
