# Supabase Database Setup Instructions

## Get Your Connection String

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **tpopsftaijhplfzxglri**
3. Navigate to: **Settings** → **Database**
4. Scroll down to **Connection string** section
5. Select **Connection pooling** mode (for better performance)
6. Copy the connection string that looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

## Update Your .env.local File

Replace the DATABASE_URL and DIRECT_URL in your `.env.local` file with:

```env
# Pooled connection (for serverless/API routes)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations and schema pushes)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password. If your password contains special characters, URL encode them:
- `#` becomes `%23`
- `@` becomes `%40`
- `$` becomes `%24`
- `&` becomes `%26`

## Alternative: Reset Database Password

If you don't remember your password:

1. Go to **Settings** → **Database**
2. Scroll to **Database Settings**
3. Click **Reset database password**
4. Copy the new password (it will only show once!)
5. Update your .env.local file with the new password

## After Updating Connection String

Run these commands:

```powershell
# Test the connection and push schema
npx prisma db push

# Seed the database with sample data
npx prisma db seed

# Start your development server
npm run dev
```

## Verify in Supabase

After seeding:
1. Go to **Table Editor** in Supabase Dashboard
2. You should see all your tables (User, Part, Order, etc.)
3. Click on the **Part** table to see the seeded products
4. Click on the **User** table to verify your vendor account exists

## Troubleshooting

If you still get authentication errors:
- Make sure you're using the PostgreSQL connection string, not the Supavisor pooler
- Verify the password is correctly URL encoded
- Check that your Supabase project is not paused (free tier projects pause after 7 days of inactivity)
- Try using the direct connection string instead of the pooled one for `db push`
