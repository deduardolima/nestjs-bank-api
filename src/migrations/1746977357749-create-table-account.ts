import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAccount1746977357749 implements MigrationInterface {
    name = 'CreateTableAccount1746977357749'
    private schemaName = 'banking';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${this.schemaName}`);
        await queryRunner.query(`CREATE TABLE "banking"."accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" numeric(15,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "banking"."accounts"`);
    }

}
