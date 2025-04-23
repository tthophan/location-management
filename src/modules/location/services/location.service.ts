import { HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_CODES } from 'src/constants';
import { BusinessException } from 'src/exceptions';
import { Location } from 'src/modules/databases';
import { LocationRepository } from 'src/modules/databases/repository';
import { Optional } from 'src/types';
import { FindOperator, FindOptionsWhere } from 'typeorm';
import {
  CreateLocationRequestModel,
  LocationResponseModel,
  PaginateLocationResponseModel,
  PaginateQueryParam,
  UpdateLocationRequestModel,
} from '../models';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}
  private async checkParent(id: number): Promise<Location> {
    if (!id) {
      throw new BusinessException({
        errorCode: ERROR_CODES.PARENT_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const parent = await this.locationRepository.findOneBy({
      id: id,
    });
    if (!parent) {
      throw new BusinessException({
        errorCode: ERROR_CODES.PARENT_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return parent;
  }

  async getLocations(
    query: PaginateQueryParam,
  ): Promise<PaginateLocationResponseModel<number>> {
    const { limit: take, cursor, search, level } = query;
    const skip = cursor ? 1 : 0;

    let condition:
      | FindOptionsWhere<Location>
      | Array<FindOptionsWhere<Location>> = {
      level: level || 0,
    };

    if (search) {
      condition = [
        {
          ...condition,
          name: new FindOperator('ilike', `%${search}%`),
        },
        {
          ...condition,
          description: new FindOperator('ilike', `%${search}%`),
        },
      ];
    }
    const total = await this.locationRepository.count({
      where: condition,
    });

    if (cursor) {
      condition = {
        ...condition,
        id: new FindOperator('moreThanOrEqual', Number(cursor)),
      };
    }

    const items = await this.locationRepository.find({
      where: condition,
      take,
      skip,
      relations: {
        parent: true,
        children: true,
      },
      order: {
        id: 'ASC',
      },
    });

    const nextCursor = items[items.length - 1]?.id;
    const prevCursor = items[0]?.id;

    return new PaginateLocationResponseModel<number>({
      items: plainToInstance(LocationResponseModel, items),
      total,
      limit: take,
      nextCursor: items[items.length - 1]?.id,
      prevCursor: nextCursor == prevCursor ? undefined : prevCursor,
    });
  }

  async getLocationById(id: number, depth?: number) {
    const location = await this.locationRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        children: true,
        parent: true,
      },
    });

    if (!location) {
      throw new BusinessException({
        errorCode: ERROR_CODES.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (depth && depth > 0) {
      return await this.locationRepository.getTree(location, depth);
    }

    return location;
  }

  async deleteLocationById(id: number) {
    const location = await this.getLocationById(id);
    const items = await this.locationRepository.getDescendants(location);
    const ids = items.map(({ id }) => {
      return id;
    });

    await this.locationRepository.delete([location.id, ...ids]);
  }

  async createLocation(location: CreateLocationRequestModel) {
    const { parentId } = location;
    if (!parentId || parentId === 0)
      throw new BusinessException({
        errorCode: ERROR_CODES.PARENT_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    let parent = await this.checkParent(parentId);
    const lastItem = await this.locationRepository.getLastItemOfParent(
      parent?.id,
    );

    let locationNumber: number = 0;
    if (lastItem?.locationNumber) {
      locationNumber = Number(lastItem.locationNumber) + 1;
    } else if (parent) {
      locationNumber = Number(parent.locationNumber + '01');
    }

    return await this.locationRepository.save(
      new Location({
        name: location.name,
        area: location.area,
        building: location.building,
        locationNumber: String(locationNumber),
        description: location.description,
        parent: parent,
        level: parent ? parent.level + 1 : 0,
      }),
    );
  }

  async updateLocation(id: number, location: UpdateLocationRequestModel) {
    const { parentId } = location;
    if (parentId === id)
      throw new BusinessException({
        errorCode: ERROR_CODES.CIRCULAR_REFERENCE,
        status: HttpStatus.BAD_REQUEST,
        errorMessage: 'A location cannot be its own parent',
      });

    const existingLocation = await this.locationRepository.findOne({
      where: { id },
      relations: { parent: true },
    });

    if (!existingLocation) {
      throw new BusinessException({
        errorCode: ERROR_CODES.LOCATION_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }

    let newParent: Optional<Location>;

    if (!parentId) {
      newParent = undefined;
    } else {
      newParent = await this.checkParent(parentId);

      if (
        newParent.level >= existingLocation.level &&
        newParent.locationNumber
          .toString()
          .startsWith(existingLocation.locationNumber.toString())
      ) {
        throw new BusinessException({
          errorCode: ERROR_CODES.CIRCULAR_REFERENCE,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    const lastItem = await this.locationRepository.getLastItemOfParent(
      newParent?.id,
    );

    await this.locationRepository.manager.transaction(
      'READ COMMITTED',
      async (transactionalEntityManager) => {
        let locationNumber: string = existingLocation.locationNumber;

        if (lastItem?.id !== existingLocation.id) {
          if (lastItem?.locationNumber) {
            locationNumber = lastItem.locationNumber + 1;
          } else if (newParent) {
            locationNumber = newParent.locationNumber + '01';
          }

          const childs = await this.locationRepository.getDescendants(
            existingLocation,
            transactionalEntityManager,
          );

          await Promise.all(
            childs.map(async (c) => {
              const lno = String(c.locationNumber).replace(
                String(existingLocation.locationNumber),
                String(locationNumber),
              );
              await transactionalEntityManager.update(Location, c.id, {
                locationNumber: lno,
                level: Math.ceil(lno.length / 2),
              });
            }),
          );
        }

        return await transactionalEntityManager.update(
          Location,
          id,
          new Location({
            ...existingLocation,
            parent: newParent,
            level: Math.ceil(String(locationNumber).length / 2),
            name: location.name,
            locationNumber: String(locationNumber),
            building: location.building,
            area: location.area,
          }),
        );
      },
    );
  }
}
