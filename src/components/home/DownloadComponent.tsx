import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

// Download component to download the revised HTML as a file
interface DownloadComponentProps {
  html: string;
  filename: string;
}

const DownloadComponent = ({ html, filename }: DownloadComponentProps) => {

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Use the original filename and add _shortened to the end
    a.download = `${filename.split('.')[0]}_shortened.html`;
    a.click();
  }
  return (
    <Button type="button" variant="outline" onClick={handleDownload} className="w-1/2 cursor-pointer py-6">
      <DownloadIcon className="size-4" />
      Download
    </Button>
  );
}

export default DownloadComponent