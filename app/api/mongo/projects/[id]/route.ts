import { NextRequest, NextResponse } from 'next/server'
import ProjectModel from '@/app/Model/Projects'
import connection from '@/lib/mongoDb'

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  await connection
  const project = await ProjectModel.findOne({ id: id }).lean().exec()
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  console.log(id,req.url)
  await connection

  const data = await req.json()
  const updated = await ProjectModel.findOneAndUpdate({ id: id }, data, { new: true }).lean().exec()
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  await connection
  console.log(id)
  const result = await ProjectModel.deleteOne({ id: id }).exec()
  return NextResponse.json(result)
}