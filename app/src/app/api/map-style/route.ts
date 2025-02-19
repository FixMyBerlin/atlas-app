import { NextResponse } from 'next/server'
import data from './style.json'

export async function GET() {
  data.sprite = `${process.env.NEXT_PUBLIC_APP_ORIGIN}/map-style/sprite`
  return NextResponse.json(data)
}
