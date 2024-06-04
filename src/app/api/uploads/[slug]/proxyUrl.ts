export async function proxyUrl(request: Request, url: string) {
  const response = await fetch(url)

  return new Response(response.body!, {
    status: response.status,
    // @ts-expect-error - TODO: find out why this is a type error
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Length': response.headers.get('content-length'),
      'Content-Type': response.headers.get('content-type'),
      ETag: response.headers.get('etag'),
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      Expires: 0,
    },
  })
}
