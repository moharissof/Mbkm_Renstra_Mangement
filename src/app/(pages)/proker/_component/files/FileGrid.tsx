"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { File, FileText, FileImage, FileSpreadsheet, PresentationIcon, ExternalLink, MoreVertical, Trash2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FileType {
  id: string;
  file: string;
  link_drive: string;
  created_at: string;
  updated_at: string;
}

interface FileGridProps {
  files: FileType[];
  onDelete?: (file: FileType) => void;
  onEdit?: (file: FileType) => void;
  showActions?: boolean;
}

export function FileGrid({ files, onDelete, onEdit, showActions = false }: FileGridProps) {
  const getFileIcon = (fileName: string) => {
    const extension = (fileName.split(".").pop() || "").toLowerCase();
    switch (extension) {
      case "pdf": return <FileText className="h-12 w-12 text-red-500" />;
      case "doc": case "docx": return <FileText className="h-12 w-12 text-blue-500" />;
      case "xls": case "xlsx": return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
      case "ppt": case "pptx": return <PresentationIcon className="h-12 w-12 text-orange-500" />;
      case "jpg": case "jpeg": case "png": case "gif": return <FileImage className="h-12 w-12 text-purple-500" />;
      default: return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "N/A";
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline">{(file.file?.split(".").pop() ?? "").toUpperCase()}</Badge>
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mt-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.open(file.link_drive, "_blank")}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open
                    </DropdownMenuItem>
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(file)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(file)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex flex-col items-center">
            <div className="my-4 flex justify-center">{getFileIcon(file.file)}</div>
            <div className="w-full truncate text-center font-medium">{file.file}</div>
          </CardContent>
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
            Uploaded {formatDate(file.created_at)}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}