import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Issue } from '../../types/issue.types';

interface Props {
  issue: Issue;
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export function IssueCommentModal({ issue, onClose, onAddComment }: Props) {
  const [text, setText] = useState('');

  function handleSubmit() {
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText('');
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-xl w-[520px] max-w-[90vw] max-h-[80vh] flex flex-col shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <div className="text-sm font-semibold">{issue.id}</div>
            <div className="text-xs text-secondary mt-0.5">{issue.title}</div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-secondary hover:text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {issue.comments.length === 0 ? (
            <p className="text-muted text-sm text-center py-5">
              No comments yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {issue.comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-panel border border-border rounded-lg px-4 py-2"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-accent">{c.author}</span>
                    <span className="text-[11px] text-muted">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-primary leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New comment */}
        <div className="px-6 py-4 border-t border-border flex gap-2 shrink-0">
          <textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="flex-1 resize-none bg-panel border border-border rounded text-primary text-sm px-2.5 py-2 outline-none focus:border-accent transition-colors"
          />
          <Button variant="primary" onClick={handleSubmit} disabled={!text.trim()}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
