"use client"

import { BlogPostForm } from "../../blog-post-form"
import { use } from "react"

export default function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Usar el hook 'use' de React para manejar la promesa
  const { id } = use(params)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar Post</h1>
      <BlogPostForm postId={id} />
    </div>
  )
}

