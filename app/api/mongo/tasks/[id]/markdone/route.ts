import { NextResponse } from 'next/server';
import connection from '@/lib/mongoDb';
import TaskModel from '@/app/Model/Tasks';
import { State } from '@/app/Model/Types/StoriesTypes';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connection; // Ensure MongoDB is connected
    const { id } = params;

    const updatedTask = await TaskModel.findOneAndUpdate(
      { id },
      {
        status: State.done,
        data_zakonczenia: new Date().toISOString(),
      },
      { new: true }
    )
    .populate('historia')
    .populate('przypisany_uzytkownik');

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(updatedTask.toObject());
  } catch (err) {
    console.error("markDone error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
