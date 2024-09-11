import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceTable1726053067454 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service" (
        "id" serial4 NOT NULL,
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "document" tsvector NULL,
        "userId" varchar NOT NULL,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        CONSTRAINT "service_pk" PRIMARY KEY (id)
      );
      
      CREATE INDEX "idx_service_user" ON "service" ("userId");
      `,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "idx_service_user";

      DROP TABLE "service";      
      `);
  }

}
