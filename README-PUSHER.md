# Pusher Configuration (Optional)

The chat system works in two modes:

## 1. Basic Mode (Current - No Configuration Needed)
- Chat works without real-time updates
- Messages appear after sending/refreshing
- No live notifications for admins
- Uses polling every 30 seconds for updates

## 2. Real-time Mode (Optional - Requires Pusher Setup)

To enable real-time chat with instant message delivery and admin notifications:

### Step 1: Create Pusher Account
1. Go to https://pusher.com/
2. Sign up for a free account
3. Create a new app
4. Get your app credentials

### Step 2: Add Environment Variables
Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key_here
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster_here
```

### Step 3: Restart Development Server
```bash
npm run dev
```

## Current Status
✅ Chat works in basic mode without Pusher
✅ File uploads work
✅ Admin interface works
✅ No errors when Pusher is not configured

The system gracefully falls back to polling mode when Pusher is not available.
