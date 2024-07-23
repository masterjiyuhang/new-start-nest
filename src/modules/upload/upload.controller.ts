import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { readFileSync } from 'fs';
// import { ApiException } from 'src/common/filters/exception-list';
// import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

@ApiTags('UPLOAD')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: readFileSync(file.path, 'utf-8'),
    };
  }

  @Post('pass-validation')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload json file.' })
  uploadFileAndPassValidation(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    const fileContent = readFileSync(file.path, 'utf-8');
    return {
      body,
      file: fileContent,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createUploadDto: CreateUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      '🚀 ~ file: upload.controller.ts:76 ~ UploadController ~ create ~ createUploadDto:',
      createUploadDto,
      file,
    );
    // return this.uploadService.create(createUploadDto);
    return {
      name: 'Upload',
    };
  }

  @Get('test')
  findAll() {
    return 'asdasdasdasdasdasd';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
