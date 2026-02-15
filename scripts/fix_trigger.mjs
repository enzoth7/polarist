import pg from 'pg';

const client = new pg.Client({
    host: 'db.epoolgyzovefaofyvocz.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Kaiserland1998*',
    ssl: { rejectUnauthorized: false },
});

async function run() {
    await client.connect();
    console.log('Connected!\n');

    // Drop and recreate with clean search_path
    console.log('=== Replacing trigger function ===');
    await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      INSERT INTO public.profiles (id, business_name, onboarding_completed, created_at, updated_at)
      VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data ->> 'business_name', ''),
        false,
        now(),
        now()
      );
      RETURN new;
    END;
    $$;
  `);
    console.log('✅ Trigger function replaced (without SET search_path)');

    // Make sure the trigger itself is attached correctly
    console.log('\n=== Verifying trigger attachment ===');
    const trigRes = await client.query(`
    SELECT tgname, tgenabled 
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth' AND c.relname = 'users' AND t.tgname = 'on_auth_user_created'
  `);
    console.log('Trigger:', trigRes.rows[0]);

    // Verify function
    const funcRes = await client.query("SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user'");
    console.log('\n=== New function source ===');
    console.log(funcRes.rows[0]?.prosrc);

    await client.end();
}

run().catch(e => { console.error('❌', e.message); client.end(); });
