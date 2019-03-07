/*
   We probably shouldn't install either express or fastify in the neiston dependencies
   Because installing either one creates unnecessary dependencies
   However this also means that we're requiring them to install an additional dependency
   Every time they install so it's kind of debatable. I'll leave it up to you how to handle that but
   in any case this code is good to make sure at least one is installed.
*/
try {
  require("express")
} catch(error) {
  if (!error.startsWith("Cannot find module")) throw error // Throw the error directly if it is some other error when requiring than not being able to find the package
  try {
    require("fastify")
  } catch(error) {
    if (!error.startsWith("Cannot find module")) throw error
    throw new Error("Requires either Fastify or Express to be installed.")
  }
}

class HTTPServer {
  constructor(serverType: string) {
    if (!["express", "fastify"].includes(serverType)) throw new Error("Invalid Server Type")
    this.type: string = serverType
  }
  declareRoute(method)
}

export default HTTPServer
