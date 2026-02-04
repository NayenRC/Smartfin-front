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
        const testEmail = 'debug_' + Date.now() + '@test.com';
        await client.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', ['Debug', testEmail, 'hash']);
        console.log("SUCCESS");
        fs.writeFileSync('result.txt', 'SUCCESS');
    } catch (err) {
        console.error("FAIL");
        fs.writeFileSync('result.txt', JSON.stringify(err, null, 2));
    } finally {
        await client.end();
    }
}
run();
