import { Member } from 'src/modules/member/entities/member.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class MemberSeeder implements Seeder {
  track = false;
  public async run(dataSource: DataSource): Promise<any> {
    const memberRepository = dataSource.getRepository(Member);

    const memberList = [
      {
        name: '大会员',
        code: 'vip-001',
        desc: '最高权限的会员',
      },
    ];

    for (const member of memberList) {
      const existingMember = await memberRepository.findOne({
        where: { member_code: member.code + '' },
      });
      if (existingMember) continue;

      // 创建新角色并关联权限
      const newMember = memberRepository.create({
        member_name: member.name, // 会员名称
        member_code: member.code + '', // 会员代码
        member_desc: `${member.desc}`,
        member_status: '1',
      });

      await memberRepository.save(newMember);
      console.log(`Member ${member.name} created successfully.`);
    }

    // ---------------------------------------------------

    this.track = true;
  }
}
