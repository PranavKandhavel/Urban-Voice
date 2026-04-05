# Upvote Real-time Fix

**Problem:** Upvote backend 200, UI no visual update.

**Plan:**
1. Dashboard.jsx: Reduce poll 30s → 5s
2. UpvoteButton: Optimistic UI update
3. Global issue cache sync
4. Test production end-to-end

**Deploy:** `npm run build && vercel --prod`

