import { Test, TestingModule } from '@nestjs/testing';
import { FileStoreController } from './file-store.controller';
import { FileStoreService } from './file-store.service';

describe('FileStoreController', () => {
  let controller: FileStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileStoreController],
      providers: [FileStoreService],
    }).compile();

    controller = module.get<FileStoreController>(FileStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
