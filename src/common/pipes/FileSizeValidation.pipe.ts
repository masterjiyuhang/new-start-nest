import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(
      '🚀 ~ file: FileSizeValidation.pipe.ts:5 ~ FileSizeValidationPipe ~ transform ~ metadata:',
      metadata,
    );
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
