// Auth API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, accounts, verifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, emailTemplates } from '@/lib/email';
import { randomBytes } from 'node:crypto';

const authApp = new Hono();

// Better Auth API type - fix for incomplete TypeScript types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authApi = (auth as any).api;

// Get allowed origins from env
const getAllowedOrigins = () => {
  const appUrl = process.env.APP_URL || 'http://localhost:4321';
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [appUrl];
  return allowedOrigins;
};

// Simple in-memory rate limiter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max requests per window

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

// CORS
authApp.use('/*', cors({
  origin: (origin) => {
    const allowed = getAllowedOrigins();
    // Allow requests with no origin (like mobile apps or server-to-server)
    if (!origin) return origin;
    // Allow if origin is in allowed list
    if (allowed.includes(origin)) return origin;
    // For local development, allow localhost origins
    if (origin?.startsWith('http://localhost:')) return origin;
    // Deny by default
    return allowed[0] || 'http://localhost:4321';
  },
  credentials: true,
}));

// Sign up
authApp.post('/sign-up', async (c) => {
  const body = await c.req.json();
  const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  
  // Rate limit check
  if (!checkRateLimit(`signup:${clientIP}`)) {
    return c.json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }
    }, 429);
  }
  
  try {
    // Create user using Better Auth
    const { user, session } = await authApi.signUp({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    
    // Set session cookie
    setCookie(c, 'better-auth.session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return c.json({ success: true, user, session });
  } catch (error: any) {
    // Handle duplicate email error
    const errorMessage = error.message || '';
    if (errorMessage.toLowerCase().includes('email') && 
        (errorMessage.toLowerCase().includes('exists') || 
         errorMessage.toLowerCase().includes('already'))) {
      return c.json({ 
        success: false, 
        error: { 
          code: 'EMAIL_EXISTS', 
          message: 'Email already registered' 
        } 
      }, 400);
    }
    
    return c.json({ 
      success: false, 
      error: { 
        code: 'SIGN_UP_ERROR', 
        message: errorMessage || 'Failed to sign up' 
      } 
    }, 400);
  }
});

// Sign in
authApp.post('/sign-in', async (c) => {
  const body = await c.req.json();
  const rememberMe = body.rememberMe === true;
  const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  
  // Rate limit check - stricter for sign-in
  if (!checkRateLimit(`signin:${clientIP}`)) {
    return c.json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please try again later.' }
    }, 429);
  }
  
  try {
    const { user, session } = await authApi.signIn({
      body: {
        email: body.email,
        password: body.password,
      },
    });
    
    // Set session cookie - 30 days if remember me, otherwise 7 days
    const maxAge = rememberMe 
      ? 60 * 60 * 24 * 30  // 30 days
      : 60 * 60 * 24 * 7;   // 7 days
    
    setCookie(c, 'better-auth.session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge,
      path: '/',
    });
    
    return c.json({ success: true, user, session });
  } catch (error: any) {
    return c.json({ 
      success: false, 
      error: { 
        code: 'SIGN_IN_ERROR', 
        message: error.message || 'Invalid credentials' 
      } 
    }, 401);
  }
});

// Sign out
authApp.post('/sign-out', async (c) => {
  const token = getCookie(c, 'better-auth.session_token');
  
  if (token) {
    try {
      await authApi.signOut({
        headers: {
          cookie: `better-auth.session_token=${token}`,
        },
      });
    } catch (error) {
      // Ignore sign out errors
    }
  }
  
  deleteCookie(c, 'better-auth.session_token');
  
  return c.json({ success: true });
});

// Get session
authApp.get('/session', async (c) => {
  const token = getCookie(c, 'better-auth.session_token');
  
  if (!token) {
    return c.json({ success: true, user: null, session: null });
  }
  
  try {
    const { user, session } = await authApi.getSession({
      headers: {
        cookie: `better-auth.session_token=${token}`,
      },
    });
    
    return c.json({ success: true, user, session });
  } catch (error) {
    deleteCookie(c, 'better-auth.session_token');
    return c.json({ success: true, user: null, session: null });
  }
});

// OAuth sign in (Google)
authApp.get('/sign-in/google', async (c) => {
  // Generate state for CSRF protection
  const state = randomBytes(32).toString('hex');
  
  // Store state in a cookie for validation
  setCookie(c, 'oauth_google_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });
  
  const url = await authApi.signInWithOAuth({
    provider: 'google',
    redirectTo: `${process.env.APP_URL}/api/auth/callback/google`,
    state: state,
  });
  
  return c.redirect(url.url);
});

// OAuth sign in (Facebook)
authApp.get('/sign-in/facebook', async (c) => {
  // Generate state for CSRF protection
  const state = randomBytes(32).toString('hex');
  
  // Store state in a cookie for validation
  setCookie(c, 'oauth_facebook_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });
  
  const url = await authApi.signInWithOAuth({
    provider: 'facebook',
    redirectTo: `${process.env.APP_URL}/api/auth/callback/facebook`,
    state: state,
  });
  
  return c.redirect(url.url);
});

// OAuth callback
authApp.get('/callback/google', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const storedState = getCookie(c, 'oauth_google_state');
  
  if (!code) {
    return c.redirect('/login?error=no_code');
  }
  
  // Validate state parameter
  if (!state || !storedState || state !== storedState) {
    return c.redirect('/login?error=invalid_state');
  }
  
  // Delete the state cookie
  deleteCookie(c, 'oauth_google_state');
  
  try {
    const { session } = await authApi.exchangeCodeForSession({
      provider: 'google',
      code,
    });
    
    setCookie(c, 'better-auth.session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return c.redirect('/account');
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return c.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});

// OAuth callback (Facebook)
authApp.get('/callback/facebook', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const storedState = getCookie(c, 'oauth_facebook_state');
  
  if (!code) {
    return c.redirect('/login?error=no_code');
  }
  
  // Validate state parameter
  if (!state || !storedState || state !== storedState) {
    return c.redirect('/login?error=invalid_state');
  }
  
  // Delete the state cookie
  deleteCookie(c, 'oauth_facebook_state');
  
  try {
    const { session } = await authApi.exchangeCodeForSession({
      provider: 'facebook',
      code,
    });
    
    setCookie(c, 'better-auth.session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return c.redirect('/account');
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return c.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});

// Forgot password - send reset email
authApp.post('/forgot-password', async (c) => {
  const body = await c.req.json();
  const { email } = body;
  const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  
  // Rate limit check
  if (!checkRateLimit(`forgot:${clientIP}`)) {
    return c.json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }
    }, 429);
  }
  
  if (!email) {
    return c.json({ 
      success: false, 
      error: { code: 'EMAIL_REQUIRED', message: 'Email is required' } 
    }, 400);
  }
  
  try {
    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    
    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Store verification token (using identifier to store the user identifier)
      await db.insert(verifications).values({
        id: token,
        identifier: `password-reset:${email.toLowerCase()}`,
        value: user.id, // Store user ID as value
        expiresAt,
      });
      
      // Send reset email
      const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
      const emailContent = emailTemplates.passwordReset(user.name || 'User', resetUrl);
      
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return c.json({ 
      success: false, 
      error: { code: 'FORGOT_PASSWORD_ERROR', message: 'Failed to process request' } 
    }, 500);
  }
});

// Reset password - update password with token
authApp.post('/reset-password', async (c) => {
  const body = await c.req.json();
  const { token, password } = body;
  const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  
  // Rate limit check
  if (!checkRateLimit(`reset:${clientIP}`)) {
    return c.json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }
    }, 429);
  }
  
  if (!token || !password) {
    return c.json({ 
      success: false, 
      error: { code: 'INVALID_REQUEST', message: 'Token and password are required' } 
    }, 400);
  }
  
  if (password.length < 8) {
    return c.json({ 
      success: false, 
      error: { code: 'PASSWORD_TOO_SHORT', message: 'Password must be at least 8 characters' } 
    }, 400);
  }
  
  try {
    // Find the verification
    const [verification] = await db.select().from(verifications)
      .where(eq(verifications.id, token))
      .limit(1);
    
    if (!verification) {
      return c.json({ 
        success: false, 
        error: { code: 'INVALID_TOKEN', message: 'Invalid reset token' } 
      }, 400);
    }
    
    // Check if expired
    if (new Date() > verification.expiresAt) {
      // Delete expired token
      await db.delete(verifications).where(eq(verifications.id, token));
      return c.json({ 
        success: false, 
        error: { code: 'TOKEN_EXPIRED', message: 'Reset link has expired' } 
      }, 400);
    }
    
    // Get user ID from verification value
    const userId = verification.value;
    
    // Update user password using Better Auth - use internal method
    // Note: Better Auth doesn't expose resetPassword API, we need to update directly
    // Use the admin API or modify the account directly
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the password in accounts table
    await db.update(accounts)
      .set({ password: hashedPassword })
      .where(eq(accounts.userId, userId));
    
    // Delete the verification token
    await db.delete(verifications).where(eq(verifications.id, token));
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return c.json({ 
      success: false, 
      error: { code: 'RESET_PASSWORD_ERROR', message: 'Failed to reset password' } 
    }, 500);
  }
});

export default authApp;
