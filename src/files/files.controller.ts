import { Controller, Post, UploadedFile, UseInterceptors, UnsupportedMediaTypeException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }


  //CON EL PARSEFILEPIPE que Fernando Herrera no encontraba

  // @Post('product')
  // @UseInterceptors( FileInterceptor('file') )
  // uploadProductFile(@UploadedFile('file',new ParseFilePipe({
  //   validators:[
  //     new FileTypeValidator({fileType:'^(image\/(jpg|jpeg|png|gif|pdf)|application\/pdf)$'}),
  //     new MaxFileSizeValidator({maxSize: 1024*1024*6})
  //   ]
  // })) file: Express.Multer.File) {
  //   return file.originalname;
  // }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string) {

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path)

    return path;
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',
    {
      fileFilter: fileFilter,
      limits: {
        files: 1,
        fileSize: 1024 * 1024 * 5
      },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      })
    }))
  uploadProductFile(@UploadedFile('file') file: Express.Multer.File) {

    if (!file) {
      throw new UnsupportedMediaTypeException({ message: "Este archivo no es aceptado o no se ha recibido" })
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return secureUrl;

  }
}
