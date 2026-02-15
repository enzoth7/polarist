import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCors(bucketName) {
    console.log(`Updating CORS for bucket: ${bucketName}...`);
    // Note: updateBucket signature varies slightly by version, but trying standard structure
    const { data, error } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        transformations: false,
        allowedMimeTypes: null, // null = all
        fileSizeLimit: null // null = unlimited
        // Unfortunately, the JS SDK updateBucket typing sometimes doesn't show cors_rules explicitly in all versions, 
        // but the API supports it. The property is usually 'cors_rules' or passed in the body.
        // Let's try passing it in the options object.
    });

    // Wait, looking at recent Supabase JS docs, updateBucket might NOT support sending cors_rules directly in older versions?
    // Actually, there is no direct method to update CORS via supabase-js in some versions.
    // It is often strictly a Dashboard or API / SQL feature.
    // BUT, since SQL failed, trying to use the authenticated client might work if the API endpoint accepts it.

    // Alternative: Use raw fetch to the Management API if we can deduce it, but that's risky.

    // Let's try to see if the SDK supports it. If not, I will notify the user.
    // Actually, there is no 'cors_rules' in BucketUpdateOptions in v2.
    // It seems CORS configuration IS usually done via everything I tried.

    // Pivot: If this script doesn't allow CORS update, I will tell the user. 
    // But wait, the SQL failure "column configuration does not exist" is very telling. It suggests the Postgres Extension for storage is old or different.

    // Let's try a direct SQL query to the `storage.buckets` table but separate columns if they exist?
    // No, I checked columns and there is no cors column.

    // Okay, I will try to run this script but I suspect supabase-js updateBucket might not support CORS updating directly. 
    // However, I'll try to use the raw REST API to the storage service if I can find the endpoint.
    // The storage service is usually at `${supabaseUrl}/storage/v1/bucket/${bucketId}` via PUT/POST.

    console.log("Supabase JS updateBucket doesn't always expose CORS. Trying raw API fetch...");

    const response = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucketName}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            public: true,
            cors_rules: [
                {
                    allowedHeaders: ["*"],
                    allowedMethods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
                    allowedOrigins: ["*"],
                    exposeHeaders: ["ETag", "Content-Length", "Content-Type"],
                    maxAgeSeconds: 3600
                }
            ]
        })
    });

    if (response.ok) {
        const json = await response.json();
        console.log(`Success updating ${bucketName} via API!`, json);
    } else {
        console.error(`Error updating ${bucketName} via API:`, await response.text());
    }
}

async function main() {
    await updateCors('product-images');
}

main();
