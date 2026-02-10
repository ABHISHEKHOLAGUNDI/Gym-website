
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://ewwuvtdmcssizsosjrrb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3d3V2dGRtY3NzaXpzb3NqcnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzU4NTcsImV4cCI6MjA4NjMxMTg1N30.BoiSr_Dk-Vgqi2EEyaeQGiUk5UJl5IwrmGSPVfqUhyI';

export const supabase = createClient(supabaseUrl, supabaseKey);
