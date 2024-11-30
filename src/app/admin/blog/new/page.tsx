import { BlogPostForm } from '../blog-post-form'

export default function NewBlogPost() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-900">Crear Nuevo Post</h1>
      <BlogPostForm />
    </div>
  )
}
