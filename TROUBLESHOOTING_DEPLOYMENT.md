# 🔧 Troubleshooting Deployment Issues

## Issue: Page Not Loading

If your page is not loading or showing errors, follow these steps:

---

## ✅ Step 1: Check Environment Variables

The page loads but may not function without proper environment variables.

### Required Environment Variables

Go to **Vercel Dashboard** → **Settings** → **Environment Variables**:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://cortexbuild-five.vercel.app
```

### Set These Variables

1. Visit: <https://vercel.com/adrian-b7e84541/cortexbuild/settings/environment-variables>
2. Click **"Add New"**
3. Add each variable above
4. **Rebuild** deployment (automatically triggers on push, or manually)

---

## ✅ Step 2: Verify Deployment Status

Check that your deployment is ready:

```bash
vercel ls cortexbuild
```

Look for deployment marked with **● Ready**

---

## ✅ Step 3: Clear Browser Cache

The page might be cached. Clear your browser cache:

- **Chrome/Edge:** Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
- **Firefox:** Ctrl+Shift+Delete
- **Safari:** Cmd+Option+E

Or try incognito/private mode.

---

## ✅ Step 4: Check Browser Console

Open browser developer tools (F12) and check the Console tab for errors:

1. Visit: <https://cortexbuild-five.vercel.app>
2. Press F12 to open DevTools
3. Look for red error messages
4. Share the errors if you need help

---

## ✅ Step 5: Check Network Tab

In browser DevTools → Network tab:

1. Refresh the page
2. Look for failed requests (red status)
3. Check if API calls are failing

---

## ✅ Step 6: Test Different URLs

Try these URLs to determine which works:

- Main production: <https://cortexbuild-five.vercel.app>
- Latest deployment: <https://cortexbuild-bf43mxqo7-adrian-b7e84541.vercel.app>

---

## ✅ Step 7: Redeploy if Needed

If the deployment is corrupted:

```bash
vercel --prod --yes
```

Or use Vercel Dashboard to trigger a new deployment.

---

## 🔍 Common Issues & Solutions

### Issue: Blank White Screen

**Cause:** Missing environment variables or JavaScript error

**Solution:**

1. Add environment variables to Vercel
2. Clear browser cache
3. Check browser console for errors

### Issue: 401 Unauthorized

**Cause:** Authentication protection enabled

**Solution:**

1. Go to Vercel Dashboard → Project Settings
2. Disable **Deployment Protection** if not needed
3. Or add bypass tokens

### Issue: JavaScript Not Loading

**Cause:** CORS or caching issue

**Solution:**

1. Clear browser cache
2. Try incognito mode
3. Check Network tab in DevTools

### Issue: Supabase Connection Error

**Cause:** Missing or incorrect Supabase credentials

**Solution:**

1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
2. Redeploy after adding variables

---

## 📞 Need Help?

1. Check browser console (F12)
2. Check deployment logs: `vercel inspect <url> --logs`
3. Visit: <https://vercel.com/adrian-b7e84541/cortexbuild>
4. Read: DEPLOYMENT_COMPLETE_GUIDE.md

---

**Quick Fix:** Clear cache and reload in incognito mode!
