import { getErrorMessage } from '@/lib/errors';
// Reviews Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { createReview as createReviewQuery, getReviewStats } from '@/lib/db/queries/reviews';
import { verifyBusinessExists, updateBusinessRating } from '@/lib/db/queries/businesses';
import { sanitizeText } from '@/lib/sanitize';


const CreateReviewSchema = z.object({
  businessId: z.string().min(1),
  userId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().optional().default(''),
});

export const createReview = defineAction({
  input: CreateReviewSchema,
  handler: async (input) => {
    try {
      // Verify business via query layer
      const businessExists = await verifyBusinessExists(input.businessId);
      if (!businessExists) {
        return { success: false, error: { message: 'Business not found' } };
      }

      // Sanitize comment to prevent XSS
      const sanitizedComment = sanitizeText(input.content || '');

      // Create review via query layer
      const result = await createReviewQuery({
        businessId: input.businessId,
        userId: input.userId,
        rating: input.rating,
        comment: sanitizedComment,
      });

      // Update business rating via query layer
      await updateBusinessRating(input.businessId);

      return { success: true, data: { id: result.id } };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});