import { NextResponse } from 'next/server';
import { createAdminClient } from '@/src/lib/supabase/admin';
import { executeBrevoJob } from '@/src/lib/brevo';

const MAX_ATTEMPTS = 5;
const BATCH = 25;

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get('x-cron-secret');
  const bearer = request.headers.get('authorization');
  return header === secret || bearer === `Bearer ${secret}`;
}

// Procesa el outbox brevo_jobs: reintenta llamadas a Brevo que fallaron.
// En prod lo dispara Vercel Cron (GET); a mano: POST con header x-cron-secret.
async function processJobs() {
  const admin = createAdminClient();
  const { data: jobs, error } = await admin
    .from('brevo_jobs')
    .select('*')
    .eq('status', 'pending')
    .lt('attempts', MAX_ATTEMPTS)
    .order('created_at', { ascending: true })
    .limit(BATCH);

  if (error) throw new Error(`No se pudo leer brevo_jobs: ${error.message}`);

  let sent = 0;
  let failed = 0;
  for (const job of jobs || []) {
    try {
      await executeBrevoJob(job.payload);
      await admin.from('brevo_jobs').update({ status: 'sent' }).eq('id', job.id);
      sent += 1;
    } catch (err) {
      const attempts = job.attempts + 1;
      await admin
        .from('brevo_jobs')
        .update({
          attempts,
          last_error: String(err?.message || err),
          status: attempts >= MAX_ATTEMPTS ? 'failed' : 'pending',
        })
        .eq('id', job.id);
      failed += 1;
    }
  }
  return { pending: (jobs || []).length, sent, failed };
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }
  try {
    return NextResponse.json(await processJobs());
  } catch (err) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function GET(request) {
  return POST(request);
}
