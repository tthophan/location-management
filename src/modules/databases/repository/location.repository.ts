import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOperator,
  FindOptionsWhere,
  Repository,
  TreeRepository,
} from 'typeorm';
import { Location } from '../entities';

@Injectable()
export class LocationRepository extends Repository<Location> {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Location)
    public locationTreeRepository: TreeRepository<Location>,
  ) {
    super(
      locationRepository.target,
      locationRepository.manager,
      locationRepository.queryRunner,
    );
  }

  async getLastItemOfParent(parentId?: number) {
    let condition: FindOptionsWhere<Location> = {
      parent: new FindOperator('isNull', null),
    };

    if (parentId) {
      condition = {
        ...condition,
        parent: {
          id: new FindOperator('equal', parentId),
        },
      };
    } else {
      condition = {
        ...condition,
        parent: new FindOperator('isNull', null),
      };
    }
    return await this.findOne({
      where: condition,
      order: {
        locationNumber: 'DESC',
      },
    });
  }

  async getDescendants(
    location: Location,
    entityManager?: EntityManager,
  ): Promise<Location[]> {
    const manager = entityManager || this.manager;
    return await manager
      .createQueryBuilder(Location, 'location')
      .where('CAST(location.location_number AS bigint) > :number', {
        number: location.locationNumber,
      })
      .andWhere('location.location_number LIKE :pattern', {
        pattern: `${location.locationNumber}%`,
      })
      .getMany();
  }

  async getTree(location: Location, depth: number) {
    const childs = await this.locationRepository
      .createQueryBuilder('location')
      .where('CAST(location.location_number AS bigint) > :number', {
        number: location.locationNumber,
      })
      .andWhere('location.location_number LIKE :pattern', {
        pattern: `${location.locationNumber}%`,
      })
      .andWhere('location.level <= :level', {
        level: depth,
      })
      .getMany();

    const buildLocationTree = (parent: Location, allLocations: Location[]) => {
      const children = allLocations.filter(
        (loc) =>
          String(loc.locationNumber).startsWith(
            String(parent.locationNumber),
          ) && loc.level === parent.level + 1,
      );

      if (children.length === 0) {
        return parent;
      }

      parent.children = children.map((child) =>
        buildLocationTree(child, allLocations),
      );
      return parent;
    };

    location.children = childs
      .filter((child) => child.level === location.level + 1)
      .map((child) => buildLocationTree(child, childs));

    return location;
  }
}
