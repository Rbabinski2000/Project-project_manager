import { NextResponse } from 'next/server'
import TaskModel from '@/app/Model/Tasks'
import { State } from '@/app/Model/Types/StoriesTypes'
import connection from '@/lib/mongoDb'

export async function POST(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; 
  try {
    await connection

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }
        //console.log("id taska-",id)
    const updated = await TaskModel.findOneAndUpdate(
      { id: id,  },
      {
        status: State.doing,
        data_startu: new Date().toISOString(),
        przypisany_uzytkownik: userId,
      },
      { new: true }
    )
      .populate('historia')
      .populate('przypisany_uzytkownik')
       // console.log("update.",updated)
    if (!updated) {
      return NextResponse.json({ error: 'Task not found or cannot be updated' }, { status: 404 })
    }

    return NextResponse.json(updated.toObject())
  } catch (err) {
    console.error('Error assigning task:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; 
  try {
    await connection


    
        //console.log("id taska-",id)
    const updated = await TaskModel.findOneAndUpdate(
      { id: id,  },
      {
        status: State.todo,
        data_startu: new Date().toISOString(),
        przypisany_uzytkownik: "0",
      },
      { new: true }
    )
      .populate('historia')
      .populate('przypisany_uzytkownik')
        console.log("update.",updated)
    if (!updated) {
      return NextResponse.json({ error: 'Task not found or cannot be updated' }, { status: 404 })
    }

    return NextResponse.json(updated.toObject())
  } catch (err) {
    console.error('Error assigning task:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

