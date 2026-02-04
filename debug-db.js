import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgresql://postgres.bluazcviihdrhqgkmohg:Abcdefg98765433@aws-1-us-east-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to DB");

        const cols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'usuarios'");
        console.log("COLUMNS:", cols.rows.map(r => r.column_name).join(', '));

        const email = 'nayenignacia@hotmail.com';
        const res = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (res.rows.length > 0) {
            console.log("User FOUND. Deleting it to fix 500 error...");
            await client.query('DELETE FROM usuarios WHERE email = $1', [email]);
            console.log("User Deleted successfully.");
        } else {
            console.log("User NOT found.");
        }

        // Try dummy insert to check sequence
        const testEmail = 'debug_auto_test_' + Date.now() + '@test.com';
        console.log("Testing Insert with:", testEmail);
        try {
            await client.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', ['Debug', testEmail, 'hash']);
            console.log("Insert WORKED.");
            await client.query('DELETE FROM usuarios WHERE email = $1', [testEmail]);
        } catch (err) {
            console.error("Insert FAILED FULL:", err.message);
            console.log("Error Detail:", err.detail); // Postgres gives detail often
            if (err.message.includes("violates not-null constraint")) {
                console.log("CONFIRMED: Missing column caused 500.");
            }
        }

    } catch (err) {
        console.error("Fatal DB Error:", err);
    } finally {
        await client.end();
    }
}

run();
