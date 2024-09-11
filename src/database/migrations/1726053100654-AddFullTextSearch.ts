import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFullTextSearch1726053100654 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE service SET document = setweight(to_tsvector(name), 'A') ||
        setweight(to_tsvector(description), 'B');

      CREATE INDEX idx_search ON service
      USING GIN (document);

      CREATE FUNCTION service_search_trigger() RETURNS trigger AS $$
        begin
          new.document := setweight(to_tsvector(new.name), 'A') ||
            setweight(to_tsvector(new.description), 'B');
          return new;
        end
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER service_document_update BEFORE INSERT OR UPDATE 
      ON service FOR EACH ROW EXECUTE PROCEDURE service_search_trigger();
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER service_document_update ON service;

      DROP FUNCTION service_search_trigger();

      DROP INDEX idx_search;      
    `);
  }

}
