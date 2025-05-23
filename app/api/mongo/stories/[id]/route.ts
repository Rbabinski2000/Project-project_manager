import { NextResponse } from 'next/server'
import StoryModel from '@/app/Model/Stories'


export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try {
    const story = await StoryModel.findOne({ id: id}).populate('projekt').lean()
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }
    return NextResponse.json(story)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 })
  }
}


export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try {
    const updates = await req.json()
    const updated = await StoryModel.findOneAndUpdate({ id: id }, updates, {
      new: true
    }).populate('projekt')

    if (!updated) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    return NextResponse.json(updated.toObject())
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 })
  }
}


export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  try {
    const result = await StoryModel.deleteOne({ id: id})
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 })
  }
}
