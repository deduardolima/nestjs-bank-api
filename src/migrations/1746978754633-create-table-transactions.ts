import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTransactions1746978754633 implements MigrationInterface {
    name = 'CreateTableTransactions1746978754633'
    private schemaName = 'banking';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${this.schemaName}`);
        await queryRunner.query(`CREATE TYPE "banking"."transactions_type_enum" AS ENUM('deposit', 'withdraw', 'transfer')`);
        await queryRunner.query(`CREATE TABLE "banking"."transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" character varying NOT NULL, "type" "banking"."transactions_type_enum" NOT NULL, "amount" numeric(15,2) NOT NULL, "destinationAccountId" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "banking"."transactions"`);
        await queryRunner.query(`DROP TYPE "banking"."transactions_type_enum"`);
    }

}
