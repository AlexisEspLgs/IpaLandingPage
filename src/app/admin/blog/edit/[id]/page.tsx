import { BlogPostForm } from "../../blog-post-form"

interface EditBlogPostProps {
  params: {
    id: string
  }
}

export default async function EditBlogPost({ params }: EditBlogPostProps) {
  // Ensure params.id is available before passing it to the form
  const postId = await Promise.resolve(params.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar Post</h1>
      <BlogPostForm postId={postId} />
    </div>
  )
}

