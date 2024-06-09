import { PartialType } from '@nestjs/mapped-types';
import { CreateFileStoreDto } from './create-file-store.dto';

export class UpdateFileStoreDto extends PartialType(CreateFileStoreDto) {}
