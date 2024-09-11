import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVersionTable1726053125282 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "version" (
        "id" serial4 NOT NULL,
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "serviceId" int NOT NULL,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
        CONSTRAINT "version_pk" PRIMARY KEY (id),
        CONSTRAINT version_service_fk FOREIGN KEY ("serviceId") 
          REFERENCES service(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      
      CREATE INDEX "idx_version_service" ON "version" ("serviceId");
      `,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "idx_version_service";
      
      DROP TABLE "version";
      `);
  }

}
