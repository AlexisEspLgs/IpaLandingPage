import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const post = await BlogPost.findById(id)
      return post 
        ? NextResponse.json({...post.toObject(), id: post._id.toString()})
        : NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    const posts = await BlogPost.find({}).sort({ date: -1 })
    return NextResponse.json(posts.map(post => ({
      ...post.toObject(),
      id: post._id.toString(), 
    })))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  try {
    const body = await request.json()
    const post = await BlogPost.create(body)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  await dbConnect()
  try {
    const body = await request.json()
    const post = await BlogPost.findByIdAndUpdate(body.id, body, { new: true, runValidators: true })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  await dbConnect()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(id)
    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}

