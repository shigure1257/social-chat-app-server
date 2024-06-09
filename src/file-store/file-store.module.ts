import { Module } from '@nestjs/common';
import { FileStoreService } from './file-store.service';
import { FileStoreController } from './file-store.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      // storage: diskStorage({
      //   destination: './public',
      //   filename(req, file, callback) {
      //     return callback(null, `${Date.now()}-${file.originalname}`);
      //   },
      // }),
      // fileFilter(req, file, callback) {
      // },
    }),
  ],
  controllers: [FileStoreController],
  providers: [FileStoreService],
  exports: [MulterModule],
})
export class FileStoreModule {
  constructor(private fileStoreService: FileStoreService) {}
}
