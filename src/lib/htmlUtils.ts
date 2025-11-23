export function extractLinksFromHtml(html: string) {

  // Find all content inside href attributes
  const regex = /href=["'](.*?)["']/g;
  let links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    links.push(match[1]);
  }

  // Filter out links that are not valid URLs
  links = links.filter((link) => {
    try {
      new URL(link);
      return true;
    } catch (error) {
      return false;
    }
  });
  return links;
}

export function replaceLinksWithShortUrls(html: string, shortUrls: { shortCode: string, originalUrl: string }[]) {
  let newHtml = html;
  for (let i = 0; i < shortUrls.length; i++) {
    newHtml = newHtml.replace(shortUrls[i].originalUrl, `${process.env.NEXT_PUBLIC_DOMAIN}/${shortUrls[i].shortCode}`);
  }
  return newHtml;
}