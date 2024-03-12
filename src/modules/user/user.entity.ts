import { Exclude } from 'class-transformer';
import { Column, Entity, Relation } from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phone: string;
}
