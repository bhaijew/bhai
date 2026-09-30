import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory fallback overrides for user status (active | inactive | banned)
export const USER_STATUS_STORE: Map<string, { status: string; isBanned: boolean }> = new Map();

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    let usersList: any[] = [];
    let attemptsList: any[] = [];

    if (supabase) {
      // 1. Fetch Users from Supabase - Exclude password hashes!
      const { data: usersData, error: usersErr } = await supabase
        .from('users')
        .select('id, full_name, email, phone, role, status, is_banned, failed_attempts, lock_until, created_at')
        .order('created_at', { ascending: false });

      if (!usersErr && usersData) {
        usersList = usersData.map((u) => {
          const override = USER_STATUS_STORE.get(u.id) || USER_STATUS_STORE.get(u.email?.toLowerCase());
          const effectiveStatus = override ? override.status : (u.status || (u.is_banned ? 'banned' : 'active'));

          return {
            id: u.id,
            name: u.full_name || 'Valued Client',
            email: u.email,
            phone: u.phone || 'N/A',
            role: u.role || 'client',
            status: effectiveStatus,
            isBanned: effectiveStatus === 'banned',
            failedAttempts: u.failed_attempts || 0,
            isLocked: u.lock_until ? new Date(u.lock_until).getTime() > Date.now() : false,
            registeredDate: u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : 'Recently',
          };
        });
      }

      // 2. Fetch Security Login Logs from Supabase
      const { data: attemptsData, error: attemptsErr } = await supabase
        .from('login_attempts')
        .select('*')
        .order('attempted_at', { ascending: false })
        .limit(100);

      if (!attemptsErr && attemptsData) {
        attemptsList = attemptsData.map((att) => ({
          id: att.id,
          ip: att.ip_address,
          email: att.email_attempted,
          status: att.status,
          reason: att.failure_reason || 'Normal Login',
          time: att.attempted_at ? new Date(att.attempted_at).toLocaleString('en-GB') : 'Just now',
        }));
      }
    }

    return NextResponse.json({
      success: true,
      users: usersList,
      loginAttempts: attemptsList,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load user accounts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const body = await request.json();
    const { userId, email, status, action } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    const newStatus = status || (action === 'ban' ? 'banned' : action === 'deactivate' ? 'inactive' : 'active');
    const isBanned = newStatus === 'banned';

    // Update memory store
    if (userId) USER_STATUS_STORE.set(userId, { status: newStatus, isBanned });
    if (email) USER_STATUS_STORE.set(email.toLowerCase(), { status: newStatus, isBanned });

    if (supabase) {
      const updatePayload: any = {
        status: newStatus,
        is_banned: isBanned,
      };

      if (action === 'unlock' || action === 'activate') {
        updatePayload.failed_attempts = 0;
        updatePayload.lock_until = null;
      }

      let query = supabase.from('users').update(updatePayload);
      if (userId) {
        query = query.eq('id', userId);
      } else if (email) {
        query = query.eq('email', email.toLowerCase());
      }

      const { error } = await query;
      if (error) {
        console.error('Supabase user status update error:', error);
      }

      // Log action to security log
      try {
        await supabase.from('login_attempts').insert({
          id: `adm-act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ip_address: 'ADMIN_PANEL',
          email_attempted: email || userId,
          status: isBanned ? 'BANNED' : newStatus.toUpperCase(),
          failure_reason: `Admin changed user status to ${newStatus.toUpperCase()}`,
        });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `User status successfully updated to ${newStatus}.`,
      status: newStatus,
    });
  } catch (error: any) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user status' },
      { status: 500 }
    );
  }
}
