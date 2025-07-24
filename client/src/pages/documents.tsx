import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { FileText, Search, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  handbook: "bg-blue-100 text-blue-800",
  sop: "bg-orange-100 text-orange-800", 
  policy: "bg-purple-100 text-purple-800",
  marketing: "bg-pink-100 text-pink-800",
  general: "bg-gray-100 text-gray-800"
};

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  review: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800"
};

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"]
  });

  const categories = [
    { key: "all", label: "All Documents", count: documents.length },
    { key: "sop", label: "SOPs", count: documents.filter(d => d.category === "sop").length },
    { key: "policy", label: "Policies", count: documents.filter(d => d.category === "policy").length },
    { key: "handbook", label: "Handbooks", count: documents.filter(d => d.category === "handbook").length },
    { key: "marketing", label: "Marketing", count: documents.filter(d => d.category === "marketing").length },
    { key: "general", label: "General", count: documents.filter(d => d.category === "general").length }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (document: Document) => {
    // Mock download functionality
    console.log("Downloading document:", document.title);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">Organize, manage, and update your business documents</p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex gap-1">
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", categoryColors[document.category] || categoryColors.general)}
                  >
                    {document.category}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={cn("text-xs", statusColors[document.status] || statusColors.draft)}
                  >
                    {document.status}
                  </Badge>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {document.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {document.description}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>
                  Updated {new Date(document.updatedAt || document.createdAt || new Date()).toLocaleDateString()}
                </span>
                <span className="mx-2">•</span>
                <span>{document.tags?.length || 0} tags</span>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleDownload(document)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by uploading your first document."
            }
          </p>
        </div>
      )}
    </div>
  );
}
