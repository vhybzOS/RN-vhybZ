import { Content } from '@google/genai';

export type ReducedMessage =
  | { type: 'text'; content: string }
  | { type: 'image'; content: string }
  | { type: 'video'; content: string }
  | { type: 'html'; content: string };

const htmlRegex = /<\s*(html|!doctype)\b[^>]*>/i;

export function reduceContentMessage(message: Content): ReducedMessage[] {
  const reduced: ReducedMessage[] = [];

  if (message.parts === undefined || message.parts.length === 0) {
    return reduced;
  }
  for (const part of message.parts) {
    // If it's just a string or has a 'text' field
    if (part.text) {
      if (htmlRegex.test(part.text)) {
        reduced.push({ type: 'html', content: part.text });
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
