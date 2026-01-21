# FIX: Images Not Showing (404 Not Found)

If your images are uploading correctly but not appearing on the dashboard (showing a broken icon or fallback), it is because Laravel's storage link is missing.

The frontend is trying to access:
`http://127.0.0.1:8000/storage/instructors/filename.png`

But the backend does not have the `/storage` folder linked to the actual files.

## THE FIX
You **MUST** run this command in your Laravel Backend terminal:

```bash
php artisan storage:link
```

### Why?
1. Laravel stores uploaded files in `storage/app/public`.
2. The web browser can only access the `public/` folder.
3. The `storage:link` command creates a "shortcut" (symbolic link) from `public/storage` to `storage/app/public`.

Without this link, `http://localhost:8000/storage/...` will always return **404 Not Found**.

### Verification
After running the command, verify that the link exists:
- Windows: You should see a `storage` shortcut in your backend's `public` folder.
- Linux/Mac: Run `ls -l public` and look for `storage -> ../storage/app/public`.

### Still not working?
If you ran the command and it says "The [public/storage] link has been connected...", but images still fail:

1. **Delete the existing link and recreate it:**
   ```bash
   # Windows (Powershell)
   rm public/storage
   php artisan storage:link
   ```

2. **Clear config cache:**
   ```bash
   php artisan config:clear
   ```
