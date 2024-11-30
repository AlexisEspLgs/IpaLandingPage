import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BlogPostList } from './blog-post-list'

export default function AdminBlog() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión del Blog</h1>
        <Link href="/admin/blog/new">
          <Button>Nuevo Post</Button>
        </Link>
      </div>
      <BlogPostList />
    </div>
  )
}

