// src/api/specs/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/src/core/db';
import { BadRequestError } from '@/src/core/errors';

export async function GET(request: Request) {
  const { data, error } = await supabase
    .from('specifications')
    .select(`
      *,
      products ( name, product_code )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, version, status } = body;

    if (!product_id || !version) {
      throw new BadRequestError('product_id and version are required');
    }

    const { data, error } = await supabase
      .from('specifications')
      .insert([{ product_id, version, status: status || 'draft' }])
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
