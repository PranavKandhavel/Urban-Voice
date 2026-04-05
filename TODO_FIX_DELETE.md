# Fix Delete Complaint Persist Issue

## Plan Steps:
- [x] Step 1: Update MyComplaints.jsx - Replace fake handleDelete with real API DELETE /api/issues/:id call + optimistic UI ✅
- [x] Step 2: Update Dashboard.jsx - Add auto-poll every 30s and manual refresh button for /api/issues ✅
- [x] Step 3: Verify deleteIssue controller returns success data ✅ (already returns {message: 'Issue deleted'})
- [x] Step 4: Test full flow, update TODO ✅

**Delete fix complete.** MyComplaints now calls real DELETE API. Dashboard auto-refreshes every 30s + manual refresh button. Deletes persist across pages/map.
- [ ] Step 5: Complete - deletes persist and map refreshes
