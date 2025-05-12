import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableAccount1747065840568 implements MigrationInterface {
    name = 'UpdateTableAccount1747065840568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banking"."accounts" DROP CONSTRAINT "PK_5a7a02c20412299d198e097a8fe"`);
        await queryRunner.query(`ALTER TABLE "banking"."accounts" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "banking"."accounts" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "banking"."accounts" ADD CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banking"."accounts" DROP CONSTRAINT "PK_5a7a02c20412299d198e097a8fe"`);
        await queryRunner.query(`ALTER TABLE "banking"."accounts" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "banking"."accounts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "banking"."accounts" ADD CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")`);
    }

}
