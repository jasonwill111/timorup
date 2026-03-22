import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  SMTPProvider,
  SendGridProvider,
  NullEmailProvider,
  getEmailProvider,
  emailTemplates,
  sendEmail,
} from '../lib/email';

describe('Email Providers', () => {
  describe('SMTPProvider', () => {
    it('should create SMTP provider with config', () => {
      const provider = new SMTPProvider({
        host: 'smtp.example.com',
        port: 587,
        user: 'user',
        pass: 'pass',
        from: 'test@example.com',
      });
      expect(provider).toBeDefined();
    });

    it('should send email (mock)', async () => {
      const provider = new SMTPProvider({
        host: 'smtp.example.com',
        port: 587,
        user: 'user',
        pass: 'pass',
        from: 'test@example.com',
      });
      // Just verify it doesn't throw
      await provider.send({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });
    });
  });

  describe('SendGridProvider', () => {
    it('should create SendGrid provider with config', () => {
      const provider = new SendGridProvider({
        apiKey: 'test-key',
        from: 'test@example.com',
      });
      expect(provider).toBeDefined();
    });

    it('should send email (mock)', async () => {
      const provider = new SendGridProvider({
        apiKey: 'test-key',
        from: 'test@example.com',
      });
      await provider.send({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });
    });
  });

  describe('NullEmailProvider', () => {
    it('should create null provider', () => {
      const provider = new NullEmailProvider();
      expect(provider).toBeDefined();
    });

    it('should send email in dev mode', async () => {
      const provider = new NullEmailProvider();
      await provider.send({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test content</p>',
      });
    });
  });

  describe('getEmailProvider', () => {
    afterEach(() => {
      // Clean up env vars
      delete process.env.EMAIL_PROVIDER;
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_PORT;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      delete process.env.SENDGRID_API_KEY;
      delete process.env.EMAIL_FROM;
    });

    it('should return null provider by default', () => {
      delete process.env.EMAIL_PROVIDER;
      const provider = getEmailProvider();
      expect(provider).toBeInstanceOf(NullEmailProvider);
    });

    it('should return SMTP provider when configured', () => {
      process.env.EMAIL_PROVIDER = 'smtp';
      process.env.SMTP_HOST = 'smtp.test.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user';
      process.env.SMTP_PASS = 'pass';
      const provider = getEmailProvider();
      expect(provider).toBeInstanceOf(SMTPProvider);
    });

    it('should use all default SMTP values when none are set', () => {
      process.env.EMAIL_PROVIDER = 'smtp';
      // Not setting any SMTP env vars - should use all defaults
      const provider = getEmailProvider();
      expect(provider).toBeInstanceOf(SMTPProvider);
    });

    it('should use default SendGrid API key when not set', () => {
      process.env.EMAIL_PROVIDER = 'sendgrid';
      // Not setting SENDGRID_API_KEY - should use default
      const provider = getEmailProvider();
      expect(provider).toBeInstanceOf(SendGridProvider);
    });

    it('should return SendGrid provider when configured', () => {
      process.env.EMAIL_PROVIDER = 'sendgrid';
      process.env.SENDGRID_API_KEY = 'test-key';
      const provider = getEmailProvider();
      expect(provider).toBeInstanceOf(SendGridProvider);
    });

    it('should use default EMAIL_FROM when not set', () => {
      process.env.EMAIL_PROVIDER = 'sendgrid';
      process.env.SENDGRID_API_KEY = 'test-key';
      delete process.env.EMAIL_FROM;
      const provider = getEmailProvider();
      expect(provider).toBeInstanceOf(SendGridProvider);
    });
  });
});

describe('Email Templates', () => {
  describe('verification', () => {
    it('should generate verification email', () => {
      const template = emailTemplates.verification('John', 'https://example.com/verify');
      expect(template.subject).toBe('Verify your email address');
      expect(template.html).toContain('John');
      expect(template.html).toContain('https://example.com/verify');
    });
  });

  describe('passwordReset', () => {
    it('should generate password reset email', () => {
      const template = emailTemplates.passwordReset('John', 'https://example.com/reset');
      expect(template.subject).toBe('Reset your password');
      expect(template.html).toContain('John');
      expect(template.html).toContain('https://example.com/reset');
    });
  });

  describe('subscriptionExpiring', () => {
    it('should generate subscription expiring email', () => {
      const template = emailTemplates.subscriptionExpiring('John', 'Test Business', '2024-12-31');
      expect(template.subject).toContain('Test Business');
      expect(template.subject).toContain('expiring');
      expect(template.html).toContain('John');
      expect(template.html).toContain('Test Business');
    });
  });

  describe('subscriptionConfirmed', () => {
    it('should generate subscription confirmed email', () => {
      const template = emailTemplates.subscriptionConfirmed('John', 'Test Business', 'pro');
      expect(template.subject).toContain('Test Business');
      expect(template.subject).toContain('confirmed');
      expect(template.html).toContain('John');
      expect(template.html).toContain('Test Business');
      expect(template.html).toContain('pro');
    });
  });
});

describe('sendEmail', () => {
  it('should send email using default provider', async () => {
    // Mock console.log to avoid cluttering test output
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    });
    consoleSpy.mockRestore();
  });
});
