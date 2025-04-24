export const formatTimestamp = (mongoTimestamp) => {
    if (!mongoTimestamp) return null;

    const date = new Date(mongoTimestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)

    return `${day} ${month} ${year} • ${hours}:${minutes} ${ampm}`;
};

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
  