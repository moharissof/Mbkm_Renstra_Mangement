"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File, Trash2, Edit, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface FileType {
  id: string;
  file: string;
  created_at: string;
  updated_at: string;
  link_drive: string;
}

interface FileListProps {
  files: FileType[];
  onDelete?: (file: FileType) => void;
  onEdit?: (file: FileType) => void;
  showActions?: boolean;
}

export function FileList({ files, onDelete, onEdit, showActions = false }: FileListProps) {
  const getFileIcon = (fileName: string) => {
    const extension = (fileName.split(".").pop() || "").toLowerCase();
    switch (extension) {
      case "pdf": return <File className="h-4 w-4 text-red-500" />;
      case "doc": case "docx": return <File className="h-4 w-4 text-blue-500" />;
      case "xls": case "xlsx": return <File className="h-4 w-4 text-green-500" />;
      case "ppt": case "pptx": return <File className="h-4 w-4 text-orange-500" />;
      case "jpg": case "jpeg": case "png": case "gif": return <File className="h-4 w-4 text-purple-500" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "N/A";
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Type</TableHead>
            {(showActions && (onEdit || onDelete)) && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.file)}
                  <span>{file.file}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(file.created_at)}</TableCell>
              <TableCell>
                <Badge variant="outline">{(file.file.split(".").pop() || "UNKNOWN").toUpperCase()}</Badge>
              </TableCell>
              {(showActions && (onEdit || onDelete)) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => window.open(file.link_drive, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(file)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => onDelete(file)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}