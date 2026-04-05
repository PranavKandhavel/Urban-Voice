import { useState } from 'react';
import API from '../api.js';

export default function UpvoteButton({ 
  issueId, 
  initialUpvoteCount = 0, 
  initialUpvoted = false, 
  onToggle 
}) {
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!issueId) {
      console.error('No issueId provided to UpvoteButton');
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const response = await API.post(`/api/upvote/${issueId}`);
      const data = response.data;

      // Update local state
      setUpvoteCount(data.upvoteCount);
      setUpvoted(data.upvoted);

      // Notify parent with issueId and new data
      if (onToggle) {
        onToggle(issueId, data);
      }
    } catch (error) {
      console.error('Upvote error:', error);
      alert('Failed to update upvote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !issueId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: upvoted ? 'rgba(46,204,113,0.2)' : 'rgba(255,255,255,0.1)',
        border: `1px solid ${upvoted ? '#2ECC71' : 'rgba(255,255,255,0.2)'}`,
        borderRadius: 20,
        color: upvoted ? '#2ECC71' : '#c8d0e0',
        fontSize: 12,
        fontWeight: 600,
        cursor: loading || !issueId ? 'not-allowed' : 'pointer',
        opacity: loading || !issueId ? 0.6 : 1,
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
      }}
    >
      <span>{upvoted ? '❤️' : '👍'}</span>
      <span>{upvoteCount}</span>
    </button>
  );
}