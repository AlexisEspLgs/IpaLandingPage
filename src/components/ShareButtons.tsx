import { Facebook, Twitter, PhoneIcon as WhatsApp } from 'lucide-react'
import { BlogPost } from '@/types/blog'

export function ShareButtons({ post }: { post: BlogPost }) {
  const shareUrl = `https://ipa-las-encinas.netlify.app/blog/${post.id}`
  const shareText = `Mira este artículo de IPA Las Encinas: ${post.title}`

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: <WhatsApp size={20} />,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
  ]

  return (
    <div className="flex space-x-2 mt-4">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors duration-300"
          aria-label={`Compartir en ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}

