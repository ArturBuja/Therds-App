'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';

interface IParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: IParams) {
  connectToDatabase();
  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update usermodel:
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Faild to create thread: ${error.message}`);
  }
}
