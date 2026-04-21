import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fullToolsRanking, discoveryToolsRanking } from '../src/data/aiToolsCatalog';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding official tools...');
  for (const tool of fullToolsRanking) {
    const { error } = await supabase.from('tools').upsert({
      name: tool.name,
      domain: tool.domain,
      url: `https://${tool.domain}`,
      category: tool.category,
      kind: tool.kind,
      niches: tool.niches,
      niche_tags: tool.nicheTags,
      is_beta: false
    }, { onConflict: 'name' });
    if (error) console.error(`Error with ${tool.name}:`, error.message);
  }

  console.log('Seeding discovery tools...');
  for (const tool of discoveryToolsRanking) {
    const { error } = await supabase.from('tools').upsert({
      name: tool.name,
      domain: tool.domain,
      url: (tool as any).url || `https://${tool.domain}`,
      category: tool.category,
      kind: tool.kind,
      niches: tool.niches,
      niche_tags: tool.nicheTags,
      description: (tool as any).description,
      who_is_it_for: (tool as any).whoIsItFor,
      is_beta: true
    }, { onConflict: 'name' });
    if (error) console.error(`Error with ${tool.name}:`, error.message);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
