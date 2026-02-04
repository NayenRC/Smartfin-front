import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgresql://postgres.bluazcviihdrhqgkmohg:Abcdefg98765433@aws-1-us-east-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        const res = await client.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'user_id'");
        console.log("TYPE:", res.rows[0].data_type);
    } catch (err) {
        console.error("Fatal:", err);
    } finally {
        await client.end();
    }
}
run();
