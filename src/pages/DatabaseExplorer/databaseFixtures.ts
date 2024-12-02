// src/fixtures/databaseFixtures.ts
import { SchemaInfo } from './database';

export const getDatabaseFixtures = (): SchemaInfo[] => [
    {
        name: "public",
        tables: [
            {
                name: "users",
                fields: [
                    { name: "id", type: "uuid", nullable: false },
                    { name: "email", type: "varchar(255)", nullable: false },
                    { name: "created_at", type: "timestamp", nullable: false }
                ],
                primaryKey: "id",
                foreignKeys: []
            },
            {
                name: "posts",
                fields: [
                    { name: "id", type: "uuid", nullable: false },
                    { name: "title", type: "varchar(255)", nullable: false },
                    { name: "content", type: "text", nullable: true },
                    { name: "user_id", type: "uuid", nullable: false },
                    { name: "created_at", type: "timestamp", nullable: false }
                ],
                primaryKey: "id",
                foreignKeys: [
                    {
                        columnName: "user_id",
                        referencedTable: "users",
                        referencedColumn: "id"
                    }
                ]
            }
        ]
    },
    {
        name: "auth",
        tables: [
            {
                name: "sessions",
                fields: [
                    { name: "id", type: "uuid", nullable: false },
                    { name: "user_id", type: "uuid", nullable: false },
                    { name: "expires_at", type: "timestamp", nullable: false }
                ],
                primaryKey: "id",
                foreignKeys: [
                    {
                        columnName: "user_id",
                        referencedTable: "users",
                        referencedColumn: "id"
                    }
                ]
            }
        ]
    }
];
