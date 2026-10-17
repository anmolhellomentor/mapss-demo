import { NextResponse } from 'next/server';

export const ok = <T>(data: T, message = 'OK', status = 200) =>
  NextResponse.json({ success: true, code: 'OK', status, message, data, errors: [] }, { status });

export const fail = (message: string, status: number, errors: string[] = []) =>
  NextResponse.json({ success: false, code: 'ERROR', status, message, data: null, errors }, { status });
