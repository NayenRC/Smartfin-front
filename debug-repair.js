import pg from 'pg';
import fs from 'fs';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgresql://postgres.bluazcviihdrhqgkmohg:Abcdefg98765433@aws-1-us-east-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log("Creating Sequence...");
        try {
            await client.query("CREATE SEQUENCE IF NOT EXISTS usuarios_user_id_seq OWNED BY usuarios.user_id");
        } catch (e) {
            fs.writeFileSync('create_seq_err.txt', e.message);
        }

        console.log("Setting Default...");
        try {
            await client.query("ALTER TABLE usuarios ALTER COLUMN user_id SET DEFAULT gen_random_uuid()");
            fs.writeFileSync('alter_res.txt', "SUCCESS");
        } catch (e) {
            fs.writeFileSync('alter_res.txt', JSON.stringify(e, null, 2));
        }

    } catch (err) {
        console.error("Fatal:", err);
    } finally {
        await client.end();
    }
}
run();
