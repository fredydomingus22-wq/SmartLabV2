// app/api/nc/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/src/core/db';
import { BadRequestError } from '@/src/core/errors';

export async function GET(request: Request) {
  const { data, error } = await supabase
    .from('nc')
    .select(`
      *,
      samples ( sample_code )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nc_code, sample_id, type, status } = body;

    if (!nc_code || !type) {
      throw new BadRequestError('nc_code and type are required');
    }

    const { data, error } = await supabase
      .from('nc')
      .insert([{ nc_code, sample_id, type, status: status || 'open' }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof BadRequestError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
