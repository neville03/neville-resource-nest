# Admin Setup Guide

## Creating Your First Admin Account

Since your admin dashboard now uses proper authentication with Supabase, you need to create an admin account to access it.

### Option 1: Using the Backend (Recommended)

1. **Open your backend:**
   - Click the "View Backend" button in Lovable
   - Or visit the Lovable Cloud dashboard

2. **Run this SQL in the SQL Editor:**

```sql
-- First, create a test admin user account (you'll need to know their auth user_id)
-- You can get the user_id after they sign up normally, or use the edge function below
```

### Option 2: Using the Create Admin Edge Function

We've created a helper function to create admin accounts. To use it:

**Call the edge function from your terminal:**

```bash
curl -X POST https://wvbmpgnhzpjzojnjlzym.supabase.co/functions/v1/create-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Ym1wZ25oenBqem9qbmpsenltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTkxODUsImV4cCI6MjA3NDczNTE4NX0.HJXDIRPQ7S-YQzvBptfA4grB4RiSavOFwOtgIqdeS0g" \
  -d '{"email":"admin@example.com","password":"YourSecurePassword123!"}'
```

**Or create a simple HTML page to call it:**

```html
<!DOCTYPE html>
<html>
<head><title>Create Admin</title></head>
<body>
  <h1>Create Admin User</h1>
  <input type="email" id="email" placeholder="Admin Email">
  <input type="password" id="password" placeholder="Admin Password">
  <button onclick="createAdmin()">Create Admin</button>
  <div id="result"></div>

  <script>
    async function createAdmin() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const response = await fetch('https://wvbmpgnhzpjzojnjlzym.supabase.co/functions/v1/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Ym1wZ25oenBqem9qbmpsenltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTkxODUsImV4cCI6MjA3NDczNTE4NX0.HJXDIRPQ7S-YQzvBptfA4grB4RiSavOFwOtgIqdeS0g'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      document.getElementById('result').textContent = JSON.stringify(data, null, 2);
    }
  </script>
</body>
</html>
```

### Option 3: Manual SQL Setup

If you already have a user signed up, you can manually assign them admin role:

```sql
-- Get the user_id from auth.users table
SELECT id, email FROM auth.users;

-- Then assign admin role (replace USER_ID with actual ID)
INSERT INTO user_roles (user_id, role)
VALUES ('USER_ID', 'admin');
```

## Logging In

Once your admin account is created, you can log in at:
- `/admin/login`
- Or the old URL: `/admin-neville-2024/login`

Both will redirect to the dashboard at `/admin/dashboard`

## Security Notes

- **IMPORTANT:** After creating your admin account, consider disabling or securing the `create-admin` edge function
- Change the default password immediately after first login
- Never share admin credentials
- The old hardcoded password authentication has been removed for security

## Troubleshooting

If you get a 401 error when uploading:
1. Make sure you're logged in
2. Check that your account has the 'admin' role in the `user_roles` table
3. Clear your browser cache and log in again

If you can't see suggestions or resources:
- This is normal - RLS policies now properly protect the data
- Only authenticated admin users can access this data
