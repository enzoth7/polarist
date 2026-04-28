const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const content = fs.readFileSync('c:\\\\Orchestrator\\\\Agente Polarist\\\\polarist\\\\tools.md', 'utf-8');

function parseTSV(text) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i+1];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === '\t' && !inQuotes) {
            currentRow.push(currentCell);
            currentCell = '';
        } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
            if (char === '\r') i++; // Skip \n
            currentRow.push(currentCell);
            if (currentRow.some(c => c.trim() !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        if (currentRow.some(c => c.trim() !== '')) {
            rows.push(currentRow);
        }
    }
    
    return rows;
}

const records = parseTSV(content);

const tools = records.map((r, idx) => {
  if (idx === 0) return null;
  if (r.length < 8) return null;
  const name = r[0].trim();
  const url = r[1].trim();
  const domain = url.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
  const description = r[2].trim();
  const what_is_it_really_for = r[3].trim();
  const who_is_it_for = r[4].trim();
  const otros_usos = r[5].trim();
  const category = r[6].trim();
  const kind = r[7].trim();
  
  // Format the name to be url-friendly for the logo filename
  // e.g. "Chat GPT" -> "chatgpt.png", "Midjourney" -> "midjourney.png"
  const logo_filename = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.png';
  
  return { name, url, domain, description, what_is_it_really_for, who_is_it_for, otros_usos, category, kind, logo_filename };
}).filter(Boolean);

async function run() {
    console.log(`Upserting ${tools.length} tools...`);
    const { data, error } = await supabase
        .from('tools')
        .upsert(tools, { onConflict: 'name' });
        
    if (error) {
        console.error('Error:', error);
        process.exit(1);
    } else {
        console.log('Successfully upserted tools with logo_filename.');
    }
}

run();
