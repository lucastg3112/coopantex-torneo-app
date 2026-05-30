import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okufmbjbzcflzqapvqge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdWZtYmpiemNmbHpxYXB2cWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDU4OTMsImV4cCI6MjA5NTY4MTg5M30.Z5YDPEyoA-ACn_dr4jpW6zvnw0WNx5cOS2tnMv7A0FI';

export const supabase = createClient(supabaseUrl, supabaseKey);
