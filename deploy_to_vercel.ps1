Write-Host "🚀 Starting Deployment for SHAMS CAFE..." -ForegroundColor Yellow

# 1. Initial Vercel setup
npx vercel

# 2. Set Env Variables
Write-Host "📦 Setting up Database Keys..." -ForegroundColor Cyan
npx vercel env add VITE_SUPABASE_URL https://pgugzqpykfaxbmybxlru.supabase.co
npx vercel env add VITE_SUPABASE_ANON_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBndWd6cXB5a2ZheGJteWJ4bHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTI4NDgsImV4cCI6MjA4NTA4ODg0OH0.Ut_k__RmpEAtP7bg113DPPlz6zlyd_3mP8At4shmZiw

# 3. Final Production Deploy
Write-Host "🌐 Going Live..." -ForegroundColor Green
npx vercel --prod

Write-Host "🎉 Done! Your app is now live on the internet." -ForegroundColor Yellow
pause
