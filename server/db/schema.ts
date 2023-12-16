import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const TransactionQueries = sqliteTable('transaction_querries',{
    id: integer('id').primaryKey({
        autoIncrement: true
    }),
    transaction_id : text('transaction_id'),
    json_data: text('json_data',{
        mode: "json"
    }),
})

export const SearchHistory = sqliteTable('search_history',{
    id: integer('id').primaryKey({
        autoIncrement: true
    }),
    search_term : text('search_term'),
    json_data: text('json_data',{
        mode: "json"
    }),
})

export const Address = sqliteTable('address',{
    id: integer('id').primaryKey({
        autoIncrement: true
    }),
    address: text('address'),
    json_data: text('json_data',{
       mode: "json"
    }) 
})

export type AddressType = typeof Address.$inferSelect // return type when queried
export type InsertAddress = typeof Address.$inferInsert // insert type

export type TransactionType = typeof TransactionQueries.$inferSelect // return type when queried
export type InsertTransaction = typeof TransactionQueries.$inferInsert // insert type




