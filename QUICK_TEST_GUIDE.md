# 🎯 Quick Progress Testing Guide

## ✅ EASY TEST - Use the Test Button

I've added a **green test button** below the video title that says:
**"🧪 Test Progress Update (+10%)"**

### How to Use:
1. Navigate to any video lesson page
2. Look below the video title
3. Click the green **"🧪 Test Progress Update (+10%)"** button
4. Watch the browser console (F12 → Console tab)
5. You should see a success toast notification
6. Go back to Student Dashboard and check if progress increased

## 📊 What to Check:

### In Browser Console (F12):
```
🎬 Video ended event triggered!
Enrollment ID: [number]
Course ID: [number]
Current progress: 0
New progress: 10
📊 API: Updating progress... {enrollmentId: X, progress: 10}
✅ API: Progress update successful
✅ Redux: Progress update complete!
```

### On Screen:
- Toast notification: "Lesson Completed! Progress updated: 0% → 10%"
- Progress bar on dashboard should show 10%

## 🐛 If Nothing Happens:

### Check Console for Errors:
1. **"No enrollment ID found"** 
   - You're not enrolled in this course
   - Go enroll first, then try again

2. **API Error (404)**
   - Backend route missing
   - Check Laravel: `PUT /api/v1/enrollments/{id}`

3. **API Error (500)**
   - Backend error
   - Check Laravel logs: `storage/logs/laravel.log`

4. **No console logs at all**
   - JavaScript error
   - Check Console tab for red errors

## 🎬 Test with Real Video:

1. Upload an MP4 video to a lesson
2. Watch it to completion
3. The `onEnded` event should trigger automatically
4. Same console logs and toast should appear

**Note:** YouTube/Vimeo videos won't trigger `onEnded` automatically (iframe limitation)

## 🔍 Verify Backend:

Run this in browser console to test API directly:
```javascript
const token = localStorage.getItem('token');
const enrollmentId = 1; // Replace with your enrollment ID

fetch('http://127.0.0.1:8000/api/v1/enrollments/' + enrollmentId, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    progress_percentage: 25,
    _method: 'PUT'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

## 📸 Expected Result:

After clicking the test button or completing a video:
1. ✅ Console shows all the emoji logs
2. ✅ Toast notification appears
3. ✅ Dashboard progress bar updates
4. ✅ Database `enrollments.progress_percentage` increases

## 🚀 Next Steps:

Once the test button works:
1. The real video `onEnded` event will work the same way
2. You can remove the test button (it's just for debugging)
3. Progress will track automatically as students watch videos!
