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

export async function fetchPosts(pageNumer = 1, pageSize = 20) {
  connectToDatabase();

  const skipAmount = (pageNumer - 1) * pageSize;
  try {
    // Fetch the posts without parents
    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: 'author', model: User })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: User,
          select: '_id name parentId image',
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await postsQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;
    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Faild to fetch posts: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  connectToDatabase();

  try {
    const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id name id image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id name parentId image',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Faild to fetch thread: ${error.message}`);
  }
}

interface IProps {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: IProps) {
  connectToDatabase();
  try {
    //Find the original thread
    const origralThread = await Thread.findById(threadId);
    if (!origralThread) {
      throw new Error('Thread not found');
    }

    //Create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    //Save the new Thread
    const savedCommentthread = await commentThread.save();
    // Update theoriginal thread to include to the new comment
    origralThread.children.push(savedCommentthread._id);
    //Save the originalthread
    await origralThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Faild to add comment to thread: ${error.message}`);
  }
}
