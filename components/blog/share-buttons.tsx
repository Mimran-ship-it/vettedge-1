// Create a new file: /components/blog/share-buttons.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonsProps {
  title: string
  excerpt: string
  url: string
}

export function ShareButtons({ title, excerpt, url }: ShareButtonsProps) {
  const { toast } = useToast()

  const handleGenericShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: excerpt,
        url,
      })
      .catch(console.error);
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
    }
  }

  const handleTwitterShare = () => {
    const text = `Check out this article: ${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  }

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The article link has been copied to your clipboard.",
    });
  }

  return (
    <div className="flex gap-2">
      {/* Generic Share Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleGenericShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      {/* Twitter Share Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleTwitterShare}
      >
        Twitter
      </Button>
      
      {/* LinkedIn Share Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleLinkedInShare}
      >
        LinkedIn
      </Button>
      
      {/* Facebook Share Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleFacebookShare}
      >
        Facebook
      </Button>
      
      {/* Copy Link Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleCopyLink}
      >
        Copy Link
      </Button>
    </div>
  )
}