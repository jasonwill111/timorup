// Review Form Component
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ReviewFormProps {
  businessPageId: string;
  userId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string;
  };
  onSuccess?: () => void;
}

export function ReviewForm({ businessPageId, userId, existingReview, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const url = existingReview 
        ? `/api/reviews/${existingReview.id}`
        : '/api/reviews';
      
      const method = existingReview ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessPageId,
          userId,
          rating,
          comment,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        onSuccess?.();
        if (!existingReview) {
          setRating(0);
          setComment('');
        }
      } else {
        setError(data.error?.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <svg
                className={`w-8 h-8 ${
                  star <= rating 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-gray-300'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      
      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-2">Comment (optional)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading 
          ? 'Submitting...' 
          : existingReview 
            ? 'Update Review' 
            : 'Submit Review'
        }
      </Button>
    </form>
  );
}

// Star Rating Display Component
interface StarRatingProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, count, showCount = true, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.round(rating) 
              ? 'text-yellow-500 fill-current' 
              : 'text-gray-300'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {showCount && count !== undefined && (
        <span className="text-sm text-muted-foreground ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}
