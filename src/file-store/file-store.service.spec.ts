import { Test, TestingModule } from '@nestjs/testing';
import { FileStoreService } from './file-store.service';

describe('FileStoreService', () => {
  let service: FileStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileStoreService],
    }).compile();

    service = module.get<FileStoreService>(FileStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
