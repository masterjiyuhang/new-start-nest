import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import type { Request } from 'express';

import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import {
  AddUserMemberDto,
  UpdateMemberDto,
  UpdateUserMemberDto,
} from './dto/update-member.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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

  @Post('del/:name')
  remove(@Param('name') name: string) {
    return this.memberService.remove(name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addMembership')
  @ApiOperation({
    summary: '开通会员',
  })
  addUserMember(@Req() req: Request, @Body() payload: AddUserMemberDto) {
    console.log(req);
    return this.memberService.addUserMember(payload, req);
  }

  @Public()
  @Post('joinMembership')
  @ApiOperation({
    summary: '根据用户名开通会员',
  })
  joinMembership(@Body() payload: UpdateUserMemberDto) {
    return this.memberService.joinMembership(payload);
  }
}
