import { Injectable } from '@nestjs/common';
import { StorageService } from './interfaces/storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
 async getDownloadUrl(audioKey: string): Promise<string> {
     return `https://example.com/${audioKey}`
 }
}
