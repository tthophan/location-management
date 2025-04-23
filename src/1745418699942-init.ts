import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1745418699942 implements MigrationInterface {
  name = 'Init1745418699942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    await queryRunner.query(
      `CREATE TABLE "locations" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "location_number" character varying NOT NULL, "building" character varying NOT NULL, "area" double precision NOT NULL, "level" integer NOT NULL, "parentId" integer, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ADD CONSTRAINT "FK_9f238930bae84c7eafad3785d7b" FOREIGN KEY ("parentId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.commitTransaction();

    // Temporarily disable the auto-increment
    await queryRunner.query(`ALTER SEQUENCE locations_id_seq RESTART WITH 1`);
    await queryRunner.query(
      `ALTER TABLE "locations" ALTER COLUMN "id" DROP DEFAULT`,
    );

    await queryRunner.query(`
        INSERT INTO "locations" 
          ("id", "name", "description", "location_number", "building", "area", "level", "parentId") 
        VALUES 
          (1, 'Building A', 'Building A', '1', 'A', 0, 0, null),
          (2, 'A CarPark', 'A-CarPark', '101', 'A', 80620, 1, 1),
          (3, 'Level 1', 'A-01', '102', 'A', 100920, 1, 1),
          (5, 'Lobby Level1', 'A-01-Lobby', '10201', 'A', 80620, 2, 3),
          (7, 'Master Room', 'A-01-01', '10203', 'A', 50110, 2, 3),
          (8, 'Meeting Room 1', 'A-01-01-M01', '1020301', 'A', 20110, 3, 7),
          (9, 'Corridor Level 1', 'A-01-Corridor', '10202', 'A', 30200, 2, 3),
          (10, 'Toilet Level 1', 'A-01-02', '1020301', 'A', 30200, 3, 7),

          (11, 'Building B', 'Building B', '2', 'B', 0, 0, null),
          (12, 'Level 5', 'B-05', '201', 'B', 1500000, 1, 11),
          (13, 'Utility Room', 'B-05-11', '20101', 'B', 10200, 2, 12),
          (14, 'Sanitary Room', 'B-05-12', '20102', 'B', 12200, 2, 12),
          (15, 'Male Toilet', 'B-05-12', '20103', 'B', 30200, 2, 12),
          (16, 'Genset Room', 'B-05-12', '20104', 'B', 35200, 2, 12),
          (17, 'Pantry Level 5', 'B-05-12', '20105', 'B', 50200, 2, 12),
          (18, 'Corridor Level 5', 'Corridor Level 5', '20105', 'B', 30000, 2, 12),

          (19, 'Level 2', 'A-02', '103', 'A', 123456, 1, 1)
    `);
    // Re-enable the auto-increment
    await queryRunner.query(
      `ALTER TABLE "locations" ALTER COLUMN "id" SET DEFAULT nextval('locations_id_seq')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "locations" DROP CONSTRAINT "FK_9f238930bae84c7eafad3785d7b"`,
    );
    await queryRunner.query(`DROP TABLE "locations"`);
  }
}
