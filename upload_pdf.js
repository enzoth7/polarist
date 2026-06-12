import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epoolgyzovefaofyvocz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb29sZ3l6b3ZlZmFvZnl2b2N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg1MDk1NywiZXhwIjoyMDg2NDI2OTU3fQ.4ZyVlXkUg0Kx_hTqDKDbaRV7zG0rYmUjLeUpAvomd44';

const supabase = createClient(supabaseUrl, supabaseKey);

async function upload() {
  const fileData = fs.readFileSync('c:\\\\Orchestrator\\\\Agente Crafter\\\\projects\\\\PDF_Asesorias.pdf');
  const { data, error } = await supabase.storage
    .from('assets')
    .upload('PDF_Asesorias.pdf', fileData, {
      contentType: 'application/pdf',
      upsert: true
    });
    
  if (error) {
    console.error('Error uploading:', error);
    process.exit(1);
  } else {
    console.log('Upload successful:', data);
  }
}

upload();
