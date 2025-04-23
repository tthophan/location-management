import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    name: 'location_number',
  })
  locationNumber: string;

  @Column()
  building: string;

  @Column('float')
  area: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne((_) => Location, (location) => location.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Location;

  @OneToMany((_) => Location, (location) => location.parent)
  children: Location[];

  @Column()
  level: number;

  constructor(entity: Partial<Location>) {
    Object.assign(this, entity);
  }
}
