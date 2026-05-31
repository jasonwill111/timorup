// Email service for sending transactional emails
// Supports SMTP, SendGrid, and other providers

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<void>;
}

// SMTP Email Provider (requires nodemailer package)
export class SMTPProvider implements EmailProvider {
  private host: string;
  private port: number;
  private user: string;
  private pass: string;
  private from: string;

  constructor(config: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  }) {
    this.host = config.host;
    this.port = config.port;
    this.user = config.user;
    this.pass = config.pass;
    this.from = config.from;
  }

  async send(options: EmailOptions): Promise<void> {
    // TODO: Install nodemailer and implement SMTP sending
    // const nodemailer = await import('nodemailer');
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from: this.from, ...options });
    console.log('📧 SMTP Email (not implemented):', {
      to: options.to,
      subject: options.subject,
    });
  }
}

// SendGrid Email Provider (requires @sendgrid/mail package)
export class SendGridProvider implements EmailProvider {
  private apiKey: string;
  private from: string;

  constructor(config: { apiKey: string; from: string }) {
    this.apiKey = config.apiKey;
    this.from = config.from;
  }

  async send(options: EmailOptions): Promise<void> {
    // TODO: Install @sendgrid/mail and implement
    // const sgMail = await import('@sendgrid/mail');
    // await sgMail.default.send({ ... });
    console.log('📧 SendGrid Email (not implemented):', {
      to: options.to,
      subject: options.subject,
    });
  }
}

// Null provider for development (logs to console)
export class NullEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    if (import.meta.env.DEV) {
      console.log('📧 [DEV] Email:', {
        to: options.to,
        subject: options.subject,
      });
    }
  }
}

// Factory function to get email provider based on config
export function getEmailProvider(): EmailProvider {
  const provider = import.meta.env.EMAIL_PROVIDER || 'null';

  switch (provider) {
    case 'smtp':
      return new SMTPProvider({
        host: import.meta.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(import.meta.env.SMTP_PORT || '587'),
        user: import.meta.env.SMTP_USER || '',
        pass: import.meta.env.SMTP_PASS || '',
        from: import.meta.env.EMAIL_FROM || 'noreply@TimorUp.com',
      });

    case 'sendgrid':
      return new SendGridProvider({
        apiKey: import.meta.env.SENDGRID_API_KEY || '',
        from: import.meta.env.EMAIL_FROM || 'noreply@TimorUp.com',
      });
    
    default:
      return new NullEmailProvider();
  }
}

// Email templates
export const emailTemplates = {
  verification: (name: string, verifyUrl: string) => ({
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to TimorUp!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  }),
  
  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Reset Password</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  }),
  
  subscriptionExpiring: (name: string, businessName: string, expiryDate: string) => ({
    subject: `Your subscription for ${businessName} is expiring soon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Subscription Reminder</h1>
        <p>Hi ${name},</p>
        <p>Your subscription for <strong>${businessName}</strong> is expiring on <strong>${expiryDate}</strong>.</p>
        <p>To continue enjoying all features, please renew your subscription.</p>
        <a href="https://TimorUp.com/subscribe" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Renew Now</a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">Thank you for using TimorUp!</p>
      </div>
    `,
  }),
  
  subscriptionConfirmed: (name: string, businessName: string, planType: string) => ({
    subject: `Your subscription for ${businessName} is confirmed!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Subscription Confirmed! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Your subscription for <strong>${businessName}</strong> has been confirmed!</p>
        <ul>
          <li>Plan: ${planType}</li>
          <li>Status: Active</li>
        </ul>
        <a href="https://TimorUp.com/business/${businessName.toLowerCase().replace(/\s+/g, '-')}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">View Your Business Page</a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">Thank you for using TimorUp!</p>
      </div>
    `,
  }),
};

// Send email helper
export async function sendEmail(options: EmailOptions): Promise<void> {
  const provider = getEmailProvider();
  await provider.send(options);
}

