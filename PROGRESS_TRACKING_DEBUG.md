# Progress Tracking Debug Guide

## How to Test Progress Updates

### Step 1: Open Browser DevTools
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Clear the console (click the 🚫 icon)

### Step 2: Navigate to a Video
1. Go to Student Dashboard
2. Click on any enrolled course
3. Click "Start Lesson" or "Resume" on any video
4. The video player page will load

### Step 3: Watch for Console Logs
When the page loads, you should see:
```
Enrollment ID: [number]
Course ID: [number]
```

### Step 4: Complete the Video
1. Watch the video to the end (or skip to the end)
2. When the video ends, watch the console for this sequence:

**Expected Console Output:**
```
🎬 Video ended event triggered!
Enrollment ID: 123
Course ID: 456
Current progress: 0
New progress: 10
📊 API: Updating progress... {enrollmentId: 123, progress: 10}
🔄 Redux: Starting progress update thunk... {enrollmentId: 123, progress: 10}
✅ API: Progress update successful
🔄 Redux: API call successful, refetching courses...
✅ Redux: Progress update complete!
```

### Step 5: Verify Progress Bar
1. You should see a success toast: "Lesson Completed! Progress updated: 0% → 10%"
2. Navigate back to the Student Dashboard
3. Check if the progress bar shows 10%

## Common Issues & Solutions

### Issue 1: "No enrollment ID found"
**Problem:** The system can't find your enrollment
**Solution:** 
- Make sure you're enrolled in the course
- Check if your enrollment is approved (not pending)
- Refresh the page and try again

### Issue 2: API Error (404 or 500)
**Problem:** Backend endpoint not found or error
**Solution:**
- Check if Laravel backend is running
- Verify the route exists: `PUT /api/v1/enrollments/{id}`
- Check Laravel logs for errors

### Issue 3: Progress doesn't increase
**Problem:** Video end event not firing
**Solution:**
- Make sure you're using a native video (not YouTube/Vimeo)
- YouTube/Vimeo iframes don't trigger `onEnded` events easily
- Try with an MP4 video file

### Issue 4: Progress resets to 0
**Problem:** Backend not saving progress
**Solution:**
- Check database: `enrollments` table should have `progress_percentage` column
- Verify the API response in Network tab (F12 → Network)
- Check if the backend controller is updating the field

## Backend Requirements

Your Laravel backend needs:

1. **Route** (in `routes/api.php`):
```php
Route::put('/enrollments/{id}', [EnrollmentController::class, 'update']);
```

2. **Controller Method**:
```php
public function update(Request $request, $id) {
    $enrollment = Enrollment::findOrFail($id);
    $enrollment->update([
        'progress_percentage' => $request->progress_percentage
    ]);
    return response()->json($enrollment);
}
```

3. **Database Column**:
```sql
ALTER TABLE enrollments ADD COLUMN progress_percentage INT DEFAULT 0;
```

## Quick Test Command
Run this in your browser console to manually trigger progress update:
```javascript
// Get enrollment ID from current course
const enrollmentId = 1; // Replace with actual ID
const newProgress = 25;

fetch('http://127.0.0.1:8000/api/v1/enrollments/' + enrollmentId, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    progress_percentage: newProgress,
    _method: 'PUT'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Manual update successful:', data))
.catch(err => console.error('❌ Manual update failed:', err));
```
