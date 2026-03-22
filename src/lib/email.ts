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

// SMTP Email Provider
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
    // In production, implement actual SMTP sending
    // For now, log the email
    console.log('📧 Email sent:', {
      from: this.from,
      to: options.to,
      subject: options.subject,
    });
    
    // TODO: Implement actual SMTP sending using nodemailer
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: this.host,
    //   port: this.port,
    //   secure: this.port === 465,
    //   auth: { user: this.user, pass: this.pass },
    // });
    // await transporter.sendMail({ from: this.from, ...options });
  }
}

// SendGrid Email Provider
export class SendGridProvider implements EmailProvider {
  private apiKey: string;
  private from: string;

  constructor(config: { apiKey: string; from: string }) {
    this.apiKey = config.apiKey;
    this.from = config.from;
  }

  async send(options: EmailOptions): Promise<void> {
    console.log('📧 SendGrid Email:', {
      to: options.to,
      subject: options.subject,
    });
    
    // TODO: Implement actual SendGrid API call
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(this.apiKey);
    // await sgMail.send({ to: options.to, from: this.from, subject: options.subject, html: options.html });
  }
}

// Null provider for development
export class NullEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    console.log('📧 [DEV] Email would be sent:', {
      to: options.to,
      subject: options.subject,
      preview: options.text?.substring(0, 100) || options.html.substring(0, 100),
    });
  }
}

// Factory function to get email provider based on config
export function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || 'null';
  
  switch (provider) {
    case 'smtp':
      return new SMTPProvider({
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@timorbiz.com',
      });
    
    case 'sendgrid':
      return new SendGridProvider({
        apiKey: process.env.SENDGRID_API_KEY || '',
        from: process.env.EMAIL_FROM || 'noreply@timorbiz.com',
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
        <h1>Welcome to TMBIZ!</h1>
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
        <a href="https://timorbiz.com/subscribe" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Renew Now</a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">Thank you for using TMBIZ!</p>
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
        <a href="https://timorbiz.com/business/${businessName.toLowerCase().replace(/\s+/g, '-')}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">View Your Business Page</a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">Thank you for using TMBIZ!</p>
      </div>
    `,
  }),
};

// Send email helper
export async function sendEmail(options: EmailOptions): Promise<void> {
  const provider = getEmailProvider();
  await provider.send(options);
}
