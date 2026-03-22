// Reviews List Component
import { useState, useEffect } from 'react';

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  isEdited: boolean;
  createdAt: string;
  user?: {
    name: string;
    image: string | null;
  };
}

interface ReviewsListProps {
  businessPageId: string;
}

export function ReviewsList({ businessPageId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadReviews();
  }, [businessPageId]);
  
  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?businessPageId=${businessPageId}`);
      const data = await res.json();
      
      if (data.success) {
        setReviews(data.data);
      } else {
        setError(data.error?.message || 'Failed to load reviews');
      }
    } catch (err) {
      setError('An error occurred while loading reviews');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading reviews...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <p className="text-sm text-red-500">{error}</p>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No reviews yet. Be the first to review!
      </p>
    );
  }
  
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4 last:border-0">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {review.user?.image ? (
                <img 
                  src={review.user.image} 
                  alt={review.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {review.user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                {review.isEdited && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
              </div>
              
              {/* Comment */}
              {review.comment && (
                <p className="mt-1 text-sm">{review.comment}</p>
              )}
              
              {/* Date */}
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Star Rating Display (simplified for React)
function StarRating({ rating, size = 'md' }: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <div className="flex items-center gap-0.5">
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
    </div>
  );
}

export default ReviewsList;
