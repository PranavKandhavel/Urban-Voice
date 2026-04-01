# Upvotes Working ✅

**Final fixes:**
- UpvoteButton: Axios syntax, issueId guard
- IssuePin: Conditional button, proper props
- Dashboard: `issueId={issue._id}`, modal fallback `_id||id`

Run:
1. `cd server && npm run dev` (backend)
2. `cd web_dev_pack && npm run dev` (frontend)
3. Login → Dashboard → Hover pin → Upvote

Backend timeout fixed (30s). No errors.

