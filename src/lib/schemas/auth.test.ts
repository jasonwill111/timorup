/**
 * Tests for auth schemas
 */
import { describe, it, expect } from 'vitest';
import { passwordSchema, simplePasswordSchema } from './auth';

describe('passwordSchema', () => {
  describe('valid passwords', () => {
    it('accepts password with all requirements', () => {
      const result = passwordSchema.safeParse('Password123!');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Password123!');
      }
    });

    it('accepts password with various special characters', () => {
      const specials = ['!', '@', '#', '$', '%', '^', '&', '*'];
      for (const special of specials) {
        const result = passwordSchema.safeParse(`Pass1234${special}`);
        expect(result.success).toBe(true);
      }
    });

    it('accepts valid password at boundary length', () => {
      // 100 chars - max allowed
      const maxPass = 'A'.repeat(95) + '1a!'; // 100 chars
      const result = passwordSchema.safeParse(maxPass);
      expect(result.success).toBe(true);
    });
  });

  describe('uppercase requirement', () => {
    it('rejects password without uppercase', () => {
      const result = passwordSchema.safeParse('password123!');
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues) {
        const hasUppercaseError = result.error.issues.some(i => i.message.toLowerCase().includes('uppercase'));
        expect(hasUppercaseError).toBe(true);
      }
    });
  });

  describe('lowercase requirement', () => {
    it('rejects password without lowercase', () => {
      const result = passwordSchema.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues) {
        const hasLowercaseError = result.error.issues.some(i => i.message.toLowerCase().includes('lowercase'));
        expect(hasLowercaseError).toBe(true);
      }
    });
  });

  describe('number requirement', () => {
    it('rejects password without number', () => {
      const result = passwordSchema.safeParse('Passwordabc!');
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues) {
        const hasNumberError = result.error.issues.some(i => i.message.toLowerCase().includes('number'));
        expect(hasNumberError).toBe(true);
      }
    });
  });

  describe('special character requirement', () => {
    it('rejects password without special character', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues) {
        const hasSpecialError = result.error.issues.some(i => i.message.toLowerCase().includes('special'));
        expect(hasSpecialError).toBe(true);
      }
    });
  });

  describe('length requirements', () => {
    it('rejects password shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Pass1!');
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues) {
        const hasLengthError = result.error.issues.some(i => i.message.includes('8 characters'));
        expect(hasLengthError).toBe(true);
      }
    });

    it('rejects password longer than 100 characters', () => {
      const longPass = 'A'.repeat(95) + '1a!aaaa'; // 103 chars
      const result = passwordSchema.safeParse(longPass);
      expect(result.success).toBe(false);
      if (!result.success && result.error.issues) {
        const hasMaxLengthError = result.error.issues.some(i => i.message.includes('100 characters'));
        expect(hasMaxLengthError).toBe(true);
      }
    });
  });

  describe('combined failures', () => {
    it('reports multiple failures when checked in chain', () => {
      // Too short - should fail on length before complexity
      const result = passwordSchema.safeParse('Pass1!');
      expect(result.success).toBe(false);
      // Should have at least one issue
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});

describe('simplePasswordSchema', () => {
  it('accepts password with minimum 8 characters', () => {
    const result = simplePasswordSchema.safeParse('password');
    expect(result.success).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = simplePasswordSchema.safeParse('pass');
    expect(result.success).toBe(false);
  });

  it('rejects password longer than 100 characters', () => {
    const longPass = 'a'.repeat(101);
    const result = simplePasswordSchema.safeParse(longPass);
    expect(result.success).toBe(false);
  });

  it('accepts any character combination (no complexity)', () => {
    expect(simplePasswordSchema.safeParse('abc12345').success).toBe(true);  // 9 chars
    expect(simplePasswordSchema.safeParse('PASSWORD1').success).toBe(true); // 9 chars
    expect(simplePasswordSchema.safeParse('12345678').success).toBe(true);
  });
});