const pg = require('pg');
const { Client } = pg;

// Connection string from user input + screenshot analysis
// TRY POOLER CONNECTION: aws-1, port 6543
const connectionString = 'postgresql://postgres.ewwuvtdmcssizsosjrrb:abhishek123456789abhishek@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase in Node
});

async function setup() {
    try {
        await client.connect();
        console.log('Connected to Supabase Postgres!');

        // Create Table Query (members)
        // Also creating a trigger to update 'updated_at' if we start using it
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        plan_type TEXT NOT NULL,
        start_date DATE NOT NULL,
        duration_months INT NOT NULL,
        amount_paid NUMERIC,
        status TEXT DEFAULT 'Active'
      );
    `;

        await client.query(createTableQuery);
        console.log('Table "members" created successfully!');

        // Enable Row Level Security (RLS) - Optional for now but good practice
        // await client.query('ALTER TABLE members ENABLE ROW LEVEL SECURITY;');
        // Policy: Allow anon to select (for now, or public)
        // console.log('RLS Enabled.');

    } catch (err) {
        console.error('Error setting up database:', err);
        console.error('Check if the password or connection string is correct (aws-0 vs aws-1).');
    } finally {
        await client.end();
    }
}

setup();
