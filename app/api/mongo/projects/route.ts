import { NextRequest, NextResponse } from 'next/server'
import ProjectModel from '@/app/Model/Projects'
import connection from "@/lib/mongoDb";

// GET /api/projects - fetch all projects
export async function GET() {
  await connection
  const projects = await ProjectModel.find().lean().exec()
  return NextResponse.json(projects)
}

// POST /api/projects - create new project
export async function POST(req: NextRequest) {
  await connection
  const data = await req.json()
  const created = await ProjectModel.create(data)
  return NextResponse.json(created.toObject(), { status: 201 })
}