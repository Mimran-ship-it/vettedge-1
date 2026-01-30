"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface BlogFormData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  featured: boolean;
  image: string;
}

export default function AddBlogPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const [image, setImage] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<BlogFormData>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    authorName: "",
    authorAvatar: "",
    publishedAt: "",
    readingTime: "",
    category: "",
    featured: false,
    image: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
    const blogData = {
      id: formData.slug, // Add id field using slug
      slug: formData.slug,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: {
        name: formData.authorName,
        avatar: formData.authorAvatar,
      },
      publishedAt: new Date(formData.publishedAt),
      readingTime: parseInt(formData.readingTime, 10),
      readTime: `${formData.readingTime} min read`, // Add readTime field
      category: formData.category,
      tags,
      featured: formData.featured,
      image: image || formData.image,
    };

    console.log("Submitting blog data:", JSON.stringify(blogData, null, 2));

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      const responseData = await res.json();
      console.log("API Response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.error || responseData.message || "Failed to create blog");
      }
      
      toast({ title: "Success", description: "Blog created successfully" });
      router.push("/admin/blogs");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast({ 
        title: "Error", 
        description: err.message || "Failed to create blog", 
        variant: "destructive" 
      });
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImageUploading(true);
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "domain");
    data.append("folder", "blogs");
    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dcday5wio/upload", data);
      setImage(res.data.secure_url);
      setFormData((prev) => ({ ...prev, image: res.data.secure_url }));
    } catch (err) {
      toast({ title: "Upload failed", description: "Could not upload image to Cloudinary", variant: "destructive" });
    } finally {
      setImageUploading(false);
    }
  };

  const parseBlogContent = (content: string) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const elements: React.JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        elements.push(<div key={`spacer-${index}`} className="h-2" />);
        return;
      }
      
      if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-xl font-bold text-gray-900">
            {trimmedLine.substring(2)}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg font-semibold text-gray-800">
            {trimmedLine.substring(3)}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-semibold text-gray-700">
            {trimmedLine.substring(4)}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        elements.push(
          <li key={index} className="text-sm text-gray-600 ml-4">
            {trimmedLine.substring(2)}
          </li>
        );
      } else if (trimmedLine.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-2">
            {trimmedLine.substring(2)}
          </blockquote>
        );
      } else if (trimmedLine.includes('**') || trimmedLine.includes('*')) {
        const formattedText = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        elements.push(
          <p key={index} className="text-sm text-gray-600" 
             dangerouslySetInnerHTML={{ __html: formattedText }} />
        );
      } else {
        elements.push(
          <p key={index} className="text-sm text-gray-600">
            {trimmedLine}
          </p>
        );
      }
    });
    
    return <div className="space-y-2">{elements}</div>;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex items-center space-x-2">
                <SidebarTrigger />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/blogs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blogs
                  </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Add New Blog</h2>
              </div>
            </div>

      <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g., ultimate-guide-aged-domains" required />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Blog title" required />
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Short summary of the blog..." required />
        </div>
        <div>
          <Label htmlFor="content">Content (Markdown Supported)</Label>
                    <div className="text-sm text-muted-foreground mb-2">
                      Use markdown syntax: # for headings, **bold**, *italic*, - for lists, &gt; for quotes
                    </div>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
                      placeholder="Write your blog content here using markdown syntax..." 
                      rows={15} 
                      className="font-mono text-sm" 
            required
          />
                    {formData.content && (
                      <div className="mt-4 p-4 bg-gray-50 ">
                        <h4 className="font-semibold mb-2">Content Preview:</h4>
                        <div className="prose prose-sm max-w-none">
                          {parseBlogContent(formData.content)}
                        </div>
                      </div>
                    )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="authorName">Author Name</Label>
                      <Input id="authorName" name="authorName" value={formData.authorName} onChange={handleChange} placeholder="Author name" required />
          </div>
          <div>
            <Label htmlFor="authorAvatar">Author Avatar URL</Label>
                      <Input id="authorAvatar" name="authorAvatar" value={formData.authorAvatar} onChange={handleChange} placeholder="/image.png?height=40&width=40" required />
          </div>
        </div>
                  <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="publishedAt">Published Date</Label>
                      <Input type="date" id="publishedAt" name="publishedAt" value={formData.publishedAt} onChange={handleChange} required />
        </div>
        <div>
                      <Label htmlFor="readingTime">Reading Time (min)</Label>
                      <Input type="number" id="readingTime" name="readingTime" value={formData.readingTime} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
                      <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Domain Investing" required />
                    </div>
        </div>
        <div>
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
                      <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" />
                      <Button type="button" onClick={addTag}>Add</Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 px-3 py-1 full text-sm flex items-center gap-2">
                {tag}
                          <button type="button" className="text-red-500" onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label>Featured</Label>
                    <Switch checked={formData.featured} onCheckedChange={(checked: boolean) => setFormData((prev) => ({ ...prev, featured: checked }))} />
        </div>
        <div>
                    <Label>Cover Image</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Input type="file" accept="image/*" onChange={handleImageUpload} />
                      {imageUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                    </div>
                    {image && (
                      <div className="mt-2">
                        <img src={image} alt="Cover" className="w-40 h-24 object-cover rounded" />
                      </div>
                    )}
        </div>
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Create Blog
        </Button>
                  </div>
                </CardContent>
              </Card>
      </form>
    </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
