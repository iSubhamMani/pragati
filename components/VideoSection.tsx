import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface VideoSectionProps {
  section: { title: string; videoUrl: string };
  onChange: (field: string, value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function VideoSection({
  section,
  onChange,
  onDelete,
  canDelete,
}: VideoSectionProps) {
  return (
    <div className="space-y-2 p-4 border rounded-md relative">
      {canDelete && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete video section</span>
        </Button>
      )}
      <div>
        <Label htmlFor="sectionTitle">Section Title</Label>
        <Input
          id="sectionTitle"
          value={section.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
          className="font-medium"
        />
      </div>
      <div>
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          type="url"
          value={section.videoUrl}
          onChange={(e) => onChange("videoUrl", e.target.value)}
          required
          className="font-medium"
        />
      </div>
    </div>
  );
}
