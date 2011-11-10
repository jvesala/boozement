import org.mortbay.jetty.Server
import org.mortbay.jetty.Handler
import org.mortbay.jetty.servlet.{Context, ServletHolder, DefaultServlet}
import org.mortbay.jetty.handler._

class Jetty

object Jetty {
  def main(args: Array[String]) {
    val server = new Server(if(args.length > 0) args(0).toInt else 8080)

    val servlet = new Context(server, "/api", Context.SESSIONS)
    servlet.addServlet(new ServletHolder(new BoozementServlet), "/*")

    val static = new Context(server, "/", Context.SESSIONS)
    val base = classOf[Jetty].getClassLoader().getResource("static").toExternalForm
    static.setResourceBase(base)
    val staticHolder = new ServletHolder
    staticHolder.setInitParameter("dirAllowed", "false")
    staticHolder.setServlet(new DefaultServlet)
    static.addServlet(staticHolder, "/*")
    
    server.start
    server.join
  }
}