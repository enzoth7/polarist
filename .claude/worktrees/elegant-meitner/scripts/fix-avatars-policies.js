import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const sql = `
    drop policy if exists "Avatar images are publicly accessible" on storage.objects;
    drop policy if exists "Users can upload their own avatar" on storage.objects;
    drop policy if exists "Users can update their own avatar" on storage.objects;
    drop policy if exists "Users can delete their own avatar" on storage.objects;

    create policy "Avatar images are publicly accessible" on storage.objects for select using ( bucket_id = 'avatars' );
    
    create policy "Users can upload their own avatar" on storage.objects for insert to authenticated with check ( 
      bucket_id = 'avatars' 
    );
    
    create policy "Users can update their own avatar" on storage.objects for update to authenticated using ( 
      bucket_id = 'avatars' and owner = auth.uid() 
    );
    
    create policy "Users can delete their own avatar" on storage.objects for delete to authenticated using ( 
      bucket_id = 'avatars' and owner = auth.uid() 
    );
  `;
  await client.query(sql);
  console.log('Fixed avatars policies successfully.');
  await client.end();
}
run().catch(console.error);
