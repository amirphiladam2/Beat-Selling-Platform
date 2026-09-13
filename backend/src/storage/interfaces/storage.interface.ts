export interface StorageService{
    getDownloadUrl(audioKey:string):Promise<string>
}