import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface IProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: { name: string; image: string; id: string };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: IProps) => {
  return (
    <article
      className={`flex w-full flex-col rounded-x1 ${
        isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link className='relative h-11 w-11' href={`/profile/${author.id}`}>
              <Image
                src={author.image}
                className='cursor-pointer rounded-full'
                fill
                alt='Profile image'
              />
            </Link>
            <div className='thread-card_bar' />
          </div>
          <div className='flex w-full flex-col'>
            <Link className='w-fit' href={`/profile/${author.id}`}>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>
            <p className='mt-2 text-small-regular text-light-2'>{content}</p>
            <div className='mt-5 flex flex-col gap-3'>
              <div className='flex gap-3.5'>
                <Image
                  src='/assets/heart-gray.svg'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                  alt='heart'
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                    alt='reply'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                  alt='repost'
                />
                <Image
                  src='/assets/share.svg'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                  alt='share'
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className='text-subtle-medium mt-1 text-gray-1'>
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
