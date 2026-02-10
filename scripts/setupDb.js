import pg from 'pg';

const { Client } = pg;

// Connection string from user input + screenshot analysis
const connectionString = 'postgresql://postgres.ewwuvtdmcssizsosjrrb:abhishek123456789abhishek@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase in Node
});

async function setup() {
    try {
        await client.connect();
        console.log('Connected to Supabase Postgres!');

        // Create Table Query
        const createTableQuery = `
      create table if not exists members (
        id uuid primary key default gen_random_uuid(),
        created_at timestamptz default now(),
        name text not null,
        phone text not null,
        plan_type text not null,
        start_date date not null,
        duration_months int not null,
        amount_paid numeric,
        status text default 'Active'
      );
    `;

        await client.query(createTableQuery);
        console.log('Table "members" created successfully!');

        // Optional: Add sample data to verify
        // await client.query(`insert into members (name, phone, plan_type, start_date, duration_months, amount_paid) values ('Test User', '919019465897', 'Muscle Build', '2024-02-10', 1, 1500)`);
        // console.log('Sample member added.');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setup();
