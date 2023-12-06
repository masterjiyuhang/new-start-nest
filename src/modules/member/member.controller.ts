import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Member')
@Controller('member')
@Public()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('test')
  test() {
    return 'member test';
  }

  @Post('add')
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get('list')
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.memberService.findOne(name);
  }

  @Patch('update/:name')
  update(
    @Param('name') name: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.memberService.update(name, updateMemberDto);
  }

  @Post(':name')
  remove(@Param('name') name: string) {
    return this.memberService.remove(name);
  }
}
