const pg = require('pg');
const { Client } = pg;

// Connection string from previous successful run
const connectionString = 'postgresql://postgres.ewwuvtdmcssizsosjrrb:abhishek123456789abhishek@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
});

async function updateSchema() {
    try {
        await client.connect();
        console.log('Connected to Supabase!');

        // 1. Add 'dob' column
        await client.query(`
            ALTER TABLE members 
            ADD COLUMN IF NOT EXISTS dob DATE;
        `);
        console.log("Added 'dob' column.");

        // 2. Add 'is_mom' (Member of the Month) column
        await client.query(`
            ALTER TABLE members 
            ADD COLUMN IF NOT EXISTS is_mom BOOLEAN DEFAULT FALSE;
        `);
        console.log("Added 'is_mom' column.");

        // 3. Add 'trainer_name' column (Prep for Phase 2)
        await client.query(`
            ALTER TABLE members 
            ADD COLUMN IF NOT EXISTS trainer_name TEXT;
        `);
        console.log("Added 'trainer_name' column.");

        console.log('Schema update complete!');

    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        await client.end();
    }
}

updateSchema();
