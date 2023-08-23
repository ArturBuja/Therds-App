'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import Thread from '../models/thread.model';

interface IParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: IParams): Promise<void> {
  connectToDatabase();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLocaleLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === 'profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Faild to update or create user: ${error.message}`);
  }
}

export async function fetchUser(userid: string) {
  try {
    connectToDatabase();
    return await User.findOne({ id: userid });
    // .populate({
    //   path: 'communities',
    //   model: 'Community',
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fechtUserPosts(userId: string) {
  try {
    connectToDatabase();

    // find all threads for user with the gicen userId
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
