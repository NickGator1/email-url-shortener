import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { CopyIcon } from "lucide-react"

interface CopyComponentProps {
  html: string;
}

const CopyComponent = ({ html }: CopyComponentProps) => {

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    toast.success("Copied to clipboard");
  }
  return (
    <Button type="button" variant="outline" onClick={handleCopy} className="w-1/2 cursor-pointer py-6">
      <Toaster />
      <CopyIcon className="size-4" />
      Copy
    </Button>
  );
}

export default CopyComponent