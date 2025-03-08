import { BlogPostForm } from "../../blog-post-form"

// Usar la definición de tipos correcta para páginas de Next.js
export default function EditBlogPost({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar Post</h1>
      <BlogPostForm postId={params.id} />
    </div>
  )
}

