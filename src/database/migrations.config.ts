import { DataSource } from "typeorm";

const datasource = new DataSource(
  {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "root",
    database: "catalog",
    synchronize: false,
    migrations: [__dirname + '/migrations/*.ts']
  }
);
datasource.initialize();
export default datasource;