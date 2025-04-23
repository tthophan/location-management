import {
  Entity,
  Tree,
  PrimaryGeneratedColumn,
  Column,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  locationNumber: string;

  @Column()
  building: string;

  @Column('float')
  area: number;

  @TreeChildren()
  children: Location[];

  @TreeParent()
  parent: Location;
}
