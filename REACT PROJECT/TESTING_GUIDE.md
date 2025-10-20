# 🧪 Testing Guide - Backend API Connection

## 📋 Prerequisites

Make sure you have:
- ✅ MongoDB running (or connection to MongoDB Atlas)
- ✅ Express backend code ready
- ✅ Next.js frontend ready

---

## 🚀 Step-by-Step Testing

### **Step 1: Start Express Backend**

Open a terminal and run:

```bash
cd "C:\Users\Natanel Richey\Desktop\Work\Projects\MealCreator"
node index.js
```

You should see:
```
CONNECTION OPEN
APP IS LISTENING ON 0.0.0.0:3000!
```

✅ **Backend is running on http://localhost:3000**

---

### **Step 2: Start Next.js Frontend**

Open a **NEW terminal** (keep the backend running) and run:

```bash
cd "C:\Users\Natanel Richey\Desktop\Work\Projects\MealCreator\REACT PROJECT"
npm run dev
```

You should see:
```
✓ Ready in X seconds
Local: http://localhost:3001
```

✅ **Frontend is running on http://localhost:3001**

---

### **Step 3: Test the Pages**

Open your browser and visit:

#### **1. Home Page - Navigation**
```
http://localhost:3001
```
✅ Should show 4 navigation cards:
- 🔐 Login / Demo
- 🍝 My Meals  
- 🥫 Pantry
- 🛒 Shopping List

---

#### **2. Login Page**
```
http://localhost:3001/login
```

**What to test:**
1. Click **"🎓 Demo Account"** button
2. Should redirect to home page after successful login
3. Check browser console - should see API requests

**What you should see in backend terminal:**
```
GET /demo-login
POST /demo-login
```

**If it fails:**
- Check if Express backend is running
- Check browser console for errors
- Make sure Express is on port 3000

---

#### **3. Meals Page**
```
http://localhost:3001/meals
```

**What to test:**
1. Should show loading spinner first
2. Then display all your meals from database
3. Try the search bar to find a meal
4. Click "Add Meal" (will navigate to `/meals/new` - not created yet)

**What you should see in backend terminal:**
```
GET /meals
```

**Expected behavior:**
- ✅ Shows meal cards with images
- ✅ Shows meal names and tags
- ✅ Search functionality works
- ❌ If no meals, shows "No meals yet" message

---

#### **4. Pantry Page**
```
http://localhost:3001/pantry
```

**What to test:**
1. Should show loading spinner
2. Display pantry items organized by category
3. Try adding a new item:
   - Type item name in "Add Item" field
   - Click green + button
4. Try editing an item (click on name)
5. Try moving item to saved (click check icon)
6. Try deleting an item (click trash icon)

**What you should see in backend terminal:**
```
GET /pantry
POST /pantry/add-item/Vegetables
PUT /pantry/move-to-saved/Carrots
DELETE /pantry/delete/[id]
```

**Expected behavior:**
- ✅ Items appear instantly after adding
- ✅ Editing works inline
- ✅ Moving to saved works
- ✅ Deleting shows confirmation

---

#### **5. Shopping List Page**
```
http://localhost:3001/shopping-list
```

**What to test:**
1. Should show loading spinner
2. Display shopping list items by category
3. Try adding items
4. Try moving item to pantry (click pantry icon)
5. Try deleting items

**What you should see in backend terminal:**
```
GET /shopping-list
POST /shopping-list/add-item/Vegetables
PUT /shopping-list/move-to-pantry/Tomatoes
DELETE /shopping-list/delete/[id]
```

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Failed to load meals/pantry/shopping list"**

**Cause:** Backend not running or wrong port

**Fix:**
```bash
# Check if backend is running
netstat -ano | findstr :3000

# If nothing shows, start backend:
cd "C:\Users\Natanel Richey\Desktop\Work\Projects\MealCreator"
node index.js
```

---

### **Issue 2: CORS Error in Browser Console**

**Cause:** Frontend and backend on different domains

**Fix:** Add CORS to your Express `index.js`:
```javascript
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

Then install cors:
```bash
npm install cors
```

---

### **Issue 3: Session/Login Not Working**

**Cause:** Cookies not being sent

**Fix:** Already handled by `credentials: 'include'` in `lib/api.ts`

Check:
1. Browser console → Network tab
2. Click on an API request
3. Check "Headers" → Should see "Cookie" header

---

### **Issue 4: 401 Unauthorized**

**Cause:** Not logged in

**Fix:**
1. Visit http://localhost:3001/login
2. Click "Demo Account"
3. Then visit other pages

---

### **Issue 5: "Cannot read property 'mealName' of undefined"**

**Cause:** Backend returning data in wrong format

**Fix:** Check your Express controllers return data like:
```javascript
res.json({ meals: [...] })  // For meals
res.json({ categories: {...}, savedItems: [...] })  // For pantry
```

---

## 🎯 Testing Checklist

Use this checklist to verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Home page loads and shows navigation
- [ ] Login page loads
- [ ] Demo login works and redirects
- [ ] Meals page loads and displays meals
- [ ] Meal search works
- [ ] Pantry page loads
- [ ] Can add pantry items
- [ ] Can edit pantry items
- [ ] Can delete pantry items
- [ ] Shopping list page loads
- [ ] Can add shopping list items
- [ ] Can move items to pantry
- [ ] Browser console shows no errors
- [ ] Backend terminal shows API requests

---

## 📊 What to Look For

### **In Browser (Chrome DevTools - F12):**

**Console Tab:**
- No red errors
- May see blue logs from our `console.log` statements

**Network Tab:**
- Click on API requests (e.g., `/meals`, `/pantry`)
- Status should be `200 OK` (green)
- Preview tab should show data
- Headers tab should show cookies

---

### **In Backend Terminal:**

You should see GET/POST/PUT/DELETE requests like:
```
GET /meals
POST /pantry/add-item/Vegetables
PUT /shopping-list/move-to-pantry/Carrots
DELETE /meals/delete/507f1f77bcf86cd799439011
```

---

## 🎉 Success Criteria

You know it's working when:

1. ✅ All pages load without errors
2. ✅ Data from MongoDB displays correctly
3. ✅ Adding/editing/deleting items updates immediately
4. ✅ Backend terminal shows API requests
5. ✅ No CORS or 401 errors in console

---

## 🆘 Need Help?

If something doesn't work:

1. **Check backend terminal** - Any errors?
2. **Check browser console** - Any red errors?
3. **Check Network tab** - What status codes?
4. **Verify MongoDB** - Is it running and connected?

---

**Happy Testing! 🚀**

