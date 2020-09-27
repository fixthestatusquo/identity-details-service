const identity = require('./src/identity')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const headers = {
  'Access-Control-Allow-Origin': '*',
  'content-type': 'application/json;charset=UTF-8',
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)
  const guid = (new URLSearchParams(url.search)).get("guid")
  const apiConf = {
    token: TOKEN,
    url: IDENTITY_API_URL
  }

  if (!guid) {
    return new Response('{error: "bad argument"}', {status: 400, headers: headers})
  }

  const details = await identity.getMember({guid: guid}, apiConf)

  if (details === null || details === {}) {
    return new Response('{error: "not found"}', {status: 404, headers: headers})
  }

  const r = {
    data: details
  }

  console.log("wut")

  return new Response(
    JSON.stringify(r),
    {
      headers: headers
    })
}

function handleOptions(request) {
  // Make sure the necesssary headers are present
  // for this to be a valid pre-flight request
  if (
    request.headers.get('Origin') !== null &&
      request.headers.get('Access-Control-Request-Method') !== null &&
      request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check the requested method + headers
    // you can do that here.
    return new Response(null, {
      headers: corsHeaders,
    })
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}
