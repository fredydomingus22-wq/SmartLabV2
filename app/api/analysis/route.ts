// src/api/analysis/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/src/core/db';
import { BadRequestError } from '@/src/core/errors';

export async function GET(request: Request) {
  const { data, error } = await supabase
    .from('analysis')
    .select(`
      *,
      samples ( sample_code ),
      parameters ( name, code )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
        sample_id,
        parameter_id,
        method_id,
    } = body;

    if (!sample_id || !parameter_id || !method_id) {
      throw new BadRequestError('sample_id, parameter_id and method_id are required');
    }

    const { data, error } = await supabase
      .from('analysis')
      .insert([{
        sample_id,
        parameter_id,
        method_id,
      }])
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
