import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import TaskModel from '@/app/Model/Tasks'

/**
 * GET /api/tasks?storyId=...
 * POST /api/tasks
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const storyId = searchParams.get('storyId')
//console.log(storyId)
  try {
    
    const tasks = await TaskModel.find({ 
      historiaId: storyId })
      .populate('historia')
      .lean();
    return NextResponse.json(tasks)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const created = await TaskModel.create(data)
    //console.log("route-",created)
    
    await created.populate('historia')
    await created.populate('przypisany_uzytkownik')
    return NextResponse.json(created.toObject(), { status: 201 })
  } catch (err) {
    //console.log(err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}