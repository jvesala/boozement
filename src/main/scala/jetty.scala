import org.mortbay.jetty.Server
import org.mortbay.jetty.servlet.{Context, ServletHolder, DefaultServlet}
import org.mortbay.jetty.handler.{ResourceHandler, DefaultHandler, HandlerList, ContextHandler, HandlerCollection}


object Jetty {
  def main(args: Array[String]) {
    val server = new Server(if(args.length > 0) args(0).toInt else 8080)

    val handler = new ResourceHandler
    handler.setWelcomeFiles(Array("boozement.html"))
    handler.setResourceBase("src/main/webapp")
    
    val handlers = new HandlerList
    handlers.addHandler(handler)

    val collection = new HandlerCollection
    collection.addHandler(handlers)
    server.setHandler(collection)

    val servlet = new Context(server, "/api", Context.SESSIONS)
    servlet.addServlet(new ServletHolder(new BoozementServlet), "/*")

    server.start
    server.join
  }
}