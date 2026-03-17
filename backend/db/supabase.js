const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || 'https://toumwfkbobwphiukrpbd.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdW13Zmtib2J3cGhpdWtycGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODY0NTAsImV4cCI6MjA4OTI2MjQ1MH0.DmJ6NyStZzs44MMDf1OF9BovYnnCikXc6CM63FvQfRI'

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase
