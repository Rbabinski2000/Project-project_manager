import { NextResponse } from 'next/server'
import StoryModel from '@/app/Model/Stories'
import mongoose from 'mongoose'
import { Priority, State } from '@/app/Model/Types/StoriesTypes'

// GET /api/stories?projectId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
  }
  //console.log(projectId,typeof(projectId))
  try {
    const stories = await StoryModel.find({ 
      projektId: projectId })
      .populate('projekt')
      .lean();

      //console.log(stories)
    return NextResponse.json(stories)
  } catch (err) {

    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}

export async function POST(req: Request) {
 // try {
    const body = await req.json()
     console.log("Server received priorytet:", body.priorytet, typeof body.priorytet);
console.log("Server received stan:", body.stan, typeof body.stan);
    //console.log(body)
    const story = await StoryModel.create(body)
     console.log("model",story)
    const populated = await story.populate('projekt')

    return NextResponse.json(populated.toObject())
  // } catch (err) {
  //   //console.log(err)
  //   return NextResponse.json({ error: 'Failed to create story' }, { status: 500 })
  // }
}