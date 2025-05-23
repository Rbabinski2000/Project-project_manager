import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import TaskModel from '@/app/Model/Tasks'

/**
 * GET    /api/tasks/:id
 * PUT    /api/tasks/:id
 * DELETE /api/tasks/:id
 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const task = await TaskModel.findOne({ id: params.id })
      .populate('historia')
      .populate('przypisany_uzytkownik')
      .lean()
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json()
    const updated = await TaskModel.findOneAndUpdate({ id: params.id }, updates, { new: true })
      .populate('historia')
      .populate('przypisany_uzytkownik')
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated.toObject())
  } catch {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await TaskModel.deleteOne({ id: params.id })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}