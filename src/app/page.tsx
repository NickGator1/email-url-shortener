'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { XIcon } from 'lucide-react';
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

import FileUpload from '@/components/home/FileUpload';
import DownloadComponent from '@/components/home/DownloadComponent';
import CopyComponent from '@/components/home/CopyComponent';

import { extractLinksFromHtml, replaceLinksWithShortUrls } from '@/lib/htmlUtils';

const Home = () => {

  const [html, setHtml] = useState<string>("");
  const [revisedHtml, setRevisedHtml] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      // Only accepting a single file
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setHtml(e.target?.result as string);
        setFilename(file.name);
      };
      reader.readAsText(file);
    }
  }

  const handleClearFile = () => {
    setHtml("");
    setRevisedHtml("");
    setFilename("");
  }

  const handleShortenLinks = async () => {
    setIsLoading(true);

    // Extract the links from the HTML first
    const links = extractLinksFromHtml(html);

    // Call the backend route to create the shortened URLs
    const response = await fetch("/api/shorten", {
      method: "POST",
      body: JSON.stringify({ urls: links }),
    });
    const data = await response.json();

    const shortUrls = data;

    // Replace the links in the HTML with the short URLs
    const revisedHtml = replaceLinksWithShortUrls(html, shortUrls);
    setRevisedHtml(revisedHtml);
    toast.success("URLs successfully shortened! You can now download or copy the revised HTML.");
    setIsLoading(false);
  }


  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <Toaster />
      <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <Card className="w-full">

          <CardHeader>
            <CardTitle>Shorten HTML</CardTitle>
            <CardDescription>
              Upload an HTML file to shorten the URLs in it.
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-4 items-center justify-center">

                <FileUpload onFileSelect={handleFileSelect} multiple={false} />

                {/* Show the filename of the uploaded file */}
                {filename && (
                  <div className="flex items-center gap-2 w-full px-4 py-2 bg-muted rounded-lg border">
                    <span className="text-sm text-foreground font-medium flex-1">
                      Selected File: <span className="text-muted-foreground">{filename}</span>
                    </span>
                    <Button
                      onClick={handleClearFile}
                      variant="destructive"
                      className="p-1 rounded-md hover:bg-destructive/70 transition-colors cursor-pointer"
                      aria-label="Remove file"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                )}

                {/* Button to shorten the URLs in the file */}
                <Button type="submit" onClick={handleShortenLinks} disabled={html.length === 0} className="w-full cursor-pointer py-6">
                  {isLoading ? <Spinner /> : "Shorten URLs"}
                </Button>

              </div>

              {/* Download and copy buttons to download the revised HTML */}
              {revisedHtml &&
                <div className="flex flex-row gap-4 items-center justify-center px-2">
                  <DownloadComponent html={revisedHtml} filename={filename} />
                  <CopyComponent html={revisedHtml} />
                </div>
              }

            </div>
          </CardContent>

        </Card>

      </main>
    </div>
  );
};


export default Home