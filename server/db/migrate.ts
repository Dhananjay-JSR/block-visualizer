import { db, connection } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { ReportsQuerries } from './schema';
import ReportQuerriesJSON from "../data.json"
// This will run migrations on the database, skipping the ones already applied

// Don't forget to close the connection, otherwise the script will hang



async function runMigrate() {
  
    console.log("Running migrations...");
  
    const start = Date.now();
    migrate(db, { migrationsFolder: "./drizzle/migrations" });
    const end = Date.now();
  
    console.log(`✅ Migrations completed in ${end - start}ms`);
    // db.insert(ReportsQuerries).values({
  ReportQuerriesJSON.map(async(report)=>{
    await db.insert(ReportsQuerries).values({
      WAddress: report.WAddress,
      DateAdded: report.dateAdded,
      ScamType: report.typeOfScam,
      Country : report.country,
      Description: report.description,
      Source: report.source,
      SiteUrl: report.site_url,
    
    }).execute()
  }
    
    )

    console.log("✅ Data Prefilled From Scrapper");
    // })
    connection.close();
    process.exit(0);
  }

  runMigrate().catch((err) => {
    console.error("❌ Migration failed");
    console.error(err);
    process.exit(1);
  });