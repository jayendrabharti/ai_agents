export function extractTextFromMarkdown(markdown) {
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Convert links to text
      .replace(/(`{1,3}.*?`{1,3})/g, "") // Remove inline code
      .replace(/#{1,6}\s?/g, "") // Remove headings
      .replace(/>\s?/g, "") // Remove blockquotes
      .replace(/[*_~`]/g, "") // Remove formatting characters (*, _, ~, `)
      .replace(/\n{2,}/g, "\n") // Reduce multiple newlines to a single newline
      .trim();
  }
  