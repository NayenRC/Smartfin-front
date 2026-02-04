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

        const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'usuarios'");
        const colNames = cols.rows.map(r => r.column_name);
        console.log("COLUMNS:", colNames);

        const missingCols = [];
        if (!colNames.includes('password')) missingCols.push("ADD COLUMN password TEXT");
        if (!colNames.includes('nombre')) missingCols.push("ADD COLUMN nombre TEXT");
        if (!colNames.includes('email')) missingCols.push("ADD COLUMN email TEXT UNIQUE");

        if (missingCols.length > 0) {
            console.log("Adding missing columns:", missingCols);
            for (const cmd of missingCols) {
                await client.query(`ALTER TABLE usuarios ${cmd}`);
                console.log(`Executed: ${cmd}`);
            }
        } else {
            console.log("All columns (password, nombre, email) present.");
        }

        // Fix Defaults just in case
        console.log("Applying defaults...");
        await client.query("ALTER TABLE usuarios ALTER COLUMN created_at SET DEFAULT NOW()");
        await client.query("ALTER TABLE usuarios ALTER COLUMN updated_at SET DEFAULT NOW()");
        await client.query("ALTER TABLE usuarios ALTER COLUMN activo SET DEFAULT true");

        // Fix user_id Auto Increment
        console.log("Fixing user_id sequence...");
        try {
            await client.query("CREATE SEQUENCE IF NOT EXISTS usuarios_user_id_seq OWNED BY usuarios.user_id");
            await client.query("ALTER TABLE usuarios ALTER COLUMN user_id SET DEFAULT nextval('usuarios_user_id_seq')");
            console.log("user_id sequence applied.");
        } catch (e) {
            console.log("Sequence setup error (maybe already exists?):", e.message);
        }

        console.log("Defaults applied.");
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await client.end();
    }
}

run();
