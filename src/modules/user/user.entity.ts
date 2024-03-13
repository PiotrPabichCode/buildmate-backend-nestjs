import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';
import { AccessTokenEntity } from '../auth/entities/access-token.entity';

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ length: 32 })
  psalt: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
    cascade: true,
  })
  accessTokens: Relation<AccessTokenEntity[]>;
}
