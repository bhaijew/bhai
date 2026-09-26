import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET() {
  try {
    let usersList: any[] = [];
    let attemptsList: any[] = [];

    if (supabase) {
      // 1. Fetch Users from Supabase
      const { data: usersData, error: usersErr } = await supabase
        .from('users')
        .select('id, full_name, email, phone, role, failed_attempts, lock_until, created_at')
        .order('created_at', { ascending: false });

      if (!usersErr && usersData) {
        usersList = usersData.map((u) => ({
          id: u.id,
          name: u.full_name || 'Anonymous Client',
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role || 'client',
          failedAttempts: u.failed_attempts || 0,
          isLocked: u.lock_until ? new Date(u.lock_until).getTime() > Date.now() : false,
          registeredDate: u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : 'Recently',
        }));
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

    // Fallback data if DB is not populated yet
    if (usersList.length === 0) {
      usersList = [
        {
          id: 'USR-1001',
          name: 'Master Admin',
          email: 'admin@bhaijeweller.com',
          phone: '+44 7911 123456',
          role: 'admin',
          failedAttempts: 0,
          isLocked: false,
          registeredDate: '26/09/2026',
        },
        {
          id: 'USR-1002',
          name: 'Lady Aurelia Spencer',
          email: 'aurelia@luxurygroup.co.uk',
          phone: '+44 7700 900123',
          role: 'client',
          failedAttempts: 0,
          isLocked: false,
          registeredDate: '25/09/2026',
        },
        {
          id: 'USR-1003',
          name: 'Zainab Bibi',
          email: 'zainab.b@gmail.com',
          phone: '+92 300 5551234',
          role: 'client',
          failedAttempts: 2,
          isLocked: false,
          registeredDate: '24/09/2026',
        },
      ];
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
