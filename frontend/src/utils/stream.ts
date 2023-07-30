import { type WebStream } from "@openpgp/web-stream-tools";

export async function readStream(stream: WebStream<string>) {
  const reader = stream.getReader();
  let result = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += value;
  }
  return result;
}
