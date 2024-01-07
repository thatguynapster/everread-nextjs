import { NextRequest, NextResponse } from "next/server";
import { PassThrough } from "stream";

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode("[1,2,3,4]");
  await sleep(1000);
  yield encoder.encode("<p>Two</p>");
  await sleep(1000);
  yield encoder.encode("<p>Three</p>");
}

export async function GET(req: NextRequest, res: any) {
  // const iterator = makeIterator();
  // const stream = iteratorToStream(iterator);
  // console.log(stream);

  // return new Response(stream);

  const myStream = new PassThrough();

  // Write data to the stream
  myStream.write("Hello, world!");

  // Pipe the stream to the response
  myStream.pipe(res);
}
