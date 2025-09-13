"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Search } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types/blog";

export default function AdminBlogsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFiltered(
      blogs.filter((b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q))
    );
  }, [searchQuery, blogs]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error();
      const data: BlogPost[] = await res.json();
      setBlogs(data);
      setFiltered(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch blogs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string, title?: string) => {
    if (!id) return;
    if (!confirm(`Delete blog: ${title}?`)) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setFiltered((prev) => prev.filter((b) => b._id !== id));
      toast({ title: "Deleted", description: `${title} removed` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SidebarTrigger />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Blog Management</h2>
              </div>
              <Button asChild>
                <Link href="/admin/blogs/new">
                  <Plus className="h-4 w-4 mr-2" /> Add Blog
                </Link>
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search blogs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blogs ({filtered.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  <div className="hidden md:block min-w-[800px] w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[35%]">Title</TableHead>
                          <TableHead className="w-[20%]">Category</TableHead>
                          <TableHead className="w-[15%]">Featured</TableHead>
                          <TableHead className="w-[20%]">Published</TableHead>
                          <TableHead className="w-[10%] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((b) => (
                          <TableRow key={b._id}>
                            <TableCell>
                              <div className="font-medium">{b.title.split(/\s+/).slice(0, 7).join(" ") + "..."}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{b.excerpt}</div>
                            </TableCell>
                            <TableCell>{b.category}</TableCell>
                            <TableCell>{b.featured ? "Yes" : "No"}</TableCell>
                            <TableCell>{new Date(b.publishedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/blog/${b.slug}`}>
                                      <Eye className="h-4 w-4 mr-2" /> View
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/blogs/edit/${b._id}`}>
                                      <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(b._id, b.title)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Mobile Cards */}
                  <div className="block md:hidden p-4 space-y-4">
                    {filtered.map((b) => (
                      <Card key={b._id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{b.title}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm flex gap-2 flex-wrap">
                            <span className="font-medium">Category:</span> {b.category}
                            <span className="ml-2">{b.featured ? "Featured" : ""}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Published: {new Date(b.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Link href={`/blog/${b.slug}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </Link>
                            <Link href={`/admin/blogs/edit/${b._id}`}>
                              <Button size="sm" variant="secondary">
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            </Link>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(b._id, b.title)}>
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}