/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Grid,
  List,
  Search,
  Upload,
  SortAsc,
  SortDesc,
  Folder,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadDialog } from "../../_component/files/UploadModal";
import { FileDeleteDialog } from "../../_component/files/DeleteModal";
import { FileEditDialog } from "../../_component/files/EditModal";
import { FileList } from "../../_component/files/FileList";
import { FileGrid } from "../../_component/files/FileGrid";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/Dashboard/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { PageLoader } from "@/components/ui/loader"; // Import the PageLoader component

interface FileType {
  id: string;
  file: string;
  created_at: string;
  updated_at: string;
  link_drive: string;
  [key: string]: any;
}

interface ProgramType {
  id: string;
  nama: string;
  user_id: string;
  [key: string]: any;
}

export default function ProgramFilesPage() {
  const params = useParams();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileType[]>([]);
  const [program, setProgram] = useState<ProgramType | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // New state for initial page load
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const isCreator = program?.user_id === user?.id;
  
  const programId = params.id as string;
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { user: userData } = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProgramAndFiles = async () => {
      try {
        // Fetch program details
        const programRes = await fetch(`/api/proker/${programId}`);
        if (!programRes.ok) throw new Error("Failed to fetch program");
        const programData = await programRes.json();
        setProgram(programData);

        // Fetch files
        const filesRes = await fetch(`/api/file/${programId}`);
        if (!filesRes.ok) throw new Error("Failed to fetch files");
        const filesData = await filesRes.json();
        setFiles(Array.isArray(filesData) ? filesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load files",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setInitialLoad(false); // Set initial load to false after data is fetched
      }
    };

    if (programId) {
      fetchProgramAndFiles();
    }
  }, []);

  const handleFileUpload = (newFile: FileType) => {
    setFiles((prevFiles) => [newFile, ...prevFiles]);
    setUploadDialogOpen(false);
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/file/${fileId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete file");
      
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      setDeleteDialogOpen(false);
      setSelectedFile(null);
      
      toast({ title: "Success", description: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({ title: "Error", description: "Failed to delete file", variant: "destructive" });
    }
  };

  const handleFileEdit = async (updatedData: Partial<FileType>) => {
    if (!selectedFile) return;

    try {
      const response = await fetch(`/api/file/${selectedFile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error("Failed to update file");
      const updatedFile = await response.json();

      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === selectedFile.id ? { ...file, ...updatedFile } : file
        )
      );

      setEditDialogOpen(false);
      setSelectedFile(null);
      toast({ title: "Success", description: "File updated successfully" });
    } catch (error) {
      console.error("Error updating file:", error);
      toast({ title: "Error", description: "Failed to update file", variant: "destructive" });
    }
  };

  const filteredFiles = files.filter((file) =>
    file.file?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Show PageLoader during initial load
  if (initialLoad) {
    return <PageLoader />;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-sm hover:text-primary"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={program ? `/proker/${program.id}` : "#"}
                  className="text-sm hover:text-primary"
                >
                  Program Kerja
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm font-medium text-primary">
                  File
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Link href={program ? `/proker/${program.id}` : "#"}>
            <Button variant="outline" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {program?.nama ? `${program.nama} - Files` : "Program Files"}
          </h1>
          {isCreator && (
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={toggleSortOrder}>
            {sortOrder === "desc" ? (
              <SortDesc className="h-4 w-4" />
            ) : (
              <SortAsc className="h-4 w-4" />
            )}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="grid">
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="mr-2 h-4 w-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" />
                List View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
              <FileGrid
                files={sortedFiles}
                showActions={isCreator}
                onEdit={isCreator ? (file) => {
                  setSelectedFile(file);
                  setEditDialogOpen(true);
                } : undefined}
                onDelete={isCreator ? (file) => {
                  setSelectedFile(file);
                  setDeleteDialogOpen(true);
                } : undefined}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <FileList
                files={sortedFiles}
                showActions={isCreator}
                onEdit={isCreator ? (file) => {
                  setSelectedFile(file);
                  setEditDialogOpen(true);
                } : undefined}
                onDelete={isCreator ? (file) => {
                  setSelectedFile(file);
                  setDeleteDialogOpen(true);
                } : undefined}
              />
            </TabsContent>
          </Tabs>
        )}

        {!loading && sortedFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Folder className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No files found</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              {searchQuery
                ? "Try a different search term"
                : isCreator
                  ? "Upload your first file to get started"
                  : "No files available for this program"}
            </p>
            {isCreator && (
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            )}
          </div>
        )}

        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUpload={handleFileUpload}
          programId={programId}
          programName={program?.nama || ""}
          userId={user?.id || ""}
        />

        {selectedFile && (
          <>
            <FileDeleteDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              file={selectedFile}
              onDelete={() => handleFileDelete(selectedFile.id)}
            />

            <FileEditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              file={selectedFile}
              onEdit={handleFileEdit}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}