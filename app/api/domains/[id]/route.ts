import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  // Authorization: verify session and ownership
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // ensure ownership — RLS also enforces this
    .single()

  if (error || !data) return NextResponse.json({ error: 'Domain not found.' }, { status: 404 })
  return NextResponse.json({ domain: data })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  // Authorization: verify session and ownership before deletion
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('domains')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // double-check ownership — never delete another user's domain

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
