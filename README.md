# SHAMS CAFE - Inventory Management System

A professional, mobile-friendly inventory management application built with React and Supabase.

## 🚀 How to Deploy to Vercel (Mobile Access)

To put this app on the internet so you can use it on your phone:

1.  **Install Vercel CLI** (if you don't have it):
    ```powershell
    npm install -g vercel
    ```

2.  **Run the Deploy Script**:
    I have created a file called `deploy_to_vercel.ps1`. Right-click it and choose "Run with PowerShell" OR run these commands in your terminal:

    ```powershell
    npx vercel
    npx vercel env add VITE_SUPABASE_URL https://pgugzqpykfaxbmybxlru.supabase.co
    npx vercel env add VITE_SUPABASE_ANON_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBndWd6cXB5a2ZheGJteWJ4bHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTI4NDgsImV4cCI6MjA4NTA4ODg0OH0.Ut_k__RmpEAtP7bg113DPPlz6zlyd_3mP8At4shmZiw
    npx vercel --prod
    ```

## ✨ Features
*   **Daily Stock Entry**: Morning (Opening) & Evening (Closing) tracking.
*   **Live Dashboard**: Instant Sales & Profit calculation.
*   **Box Tracking**: Know exactly where each item is stored.
*   **History**: Look back at any day and print reports.
*   **Cloud Sync**: Works on PC and Phone simultaneously.

## 🛠️ Security Note
Your Supabase keys are stored in Vercel's "Environment Variables". Never share your `.env` file with anyone.
