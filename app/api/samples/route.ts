// src/api/samples/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/src/core/db';
import { BadRequestError } from '@/src/core/errors';

export async function GET(request: Request) {
  const { data, error } = await supabase
    .from('samples')
    .select(`
      *,
      products ( name, product_code ),
      lines ( line_code )
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
        sample_code,
        sample_type,
        product_id,
        line_id,
        batch_no,
        collected_at,
    } = body;

    if (!sample_code || !sample_type || !product_id || !collected_at) {
      throw new BadRequestError('sample_code, sample_type, product_id and collected_at are required');
    }

    const { data, error } = await supabase
      .from('samples')
      .insert([{
        sample_code,
        sample_type,
        product_id,
        line_id,
        batch_no,
        collected_at
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
