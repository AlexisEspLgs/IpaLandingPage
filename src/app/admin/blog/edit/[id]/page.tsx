import { BlogPostForm } from "../../blog-post-form"

interface EditBlogPostProps {
  params: {
    id: string
  }
}

export default function EditBlogPost({ params }: EditBlogPostProps) {
  // Accede directamente al ID desde params
  const postId = params.id

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar Post</h1>
      <BlogPostForm postId={postId} />
    </div>
  )
}

