import { Content } from '@google/genai';

export type ReducedMessage =
  | { type: 'text'; content: string }
  | { type: 'image'; content: string }
  | { type: 'video'; content: string }
  | { type: 'html'; content: string };

const htmlRegex = /(<\s*(html|!doctype)\b[^>]*>[\s\S]*?<\/html>)/i;

export function reduceContentMessage(message: Content): ReducedMessage[] {
  const reduced: ReducedMessage[] = [];

  if (message.parts === undefined || message.parts.length === 0) {
    return reduced;
  }
  for (const part of message.parts) {
    // If it's just a string or has a 'text' field
    if (part.text) {
      const htmlMatch = htmlRegex.test(part.text);
      if (htmlMatch) {
        reduced.push(...extractHtmlContent(part.text));
      } else {
        reduced.push({ type: 'text', content: part.text });
      }
    }

    // If it's a file or media type
    else if (part.inlineData) {
      const mime = part.inlineData.mimeType;
      const data = part.inlineData.data;

      if (mime && mime.startsWith('image/')) {
        reduced.push({ type: 'image', content: `data:${mime};base64,${data}` });
      } else if (mime && mime.startsWith('video/')) {
        reduced.push({ type: 'video', content: `data:${mime};base64,${data}` });
      } else if (mime && mime === 'text/html') {
        reduced.push({ type: 'html', content: atob(data || "") });
      } else {
        // default fallback for unknown inlineData
        reduced.push({ type: 'text', content: `[Unsupported MIME type: ${mime}]` });
      }
    }
  }

  return reduced;
}



function extractHtmlContent(text: string): ReducedMessage[] {
  const parts: ReducedMessage[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Make sure regex has the global flag
  const htmlRegex = /(<\s*(html|!doctype)\b[^>]*>[\s\S]*?<\/html>)/i;

  while ((match = htmlRegex.exec(text)) !== null) {
    const start = match.index;
    const end = htmlRegex.lastIndex;

    // Add unmatched part before the match
    if (start > lastIndex) {
      parts.push({
        content: text.slice(lastIndex, start),
        type: "text",
      });
    }

    // Add the matched part
    parts.push({
      content: match[0],
      type: "html",
    });

    lastIndex = end;
  }

  // Add remaining unmatched part after last match
  if (lastIndex < text.length) {
    parts.push({
      content: text.slice(lastIndex),
      type: "text",
    });
  }

  return parts;
}
