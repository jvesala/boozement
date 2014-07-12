import org.eclipse.jetty.server.Server
import org.eclipse.jetty.server.Handler
import org.eclipse.jetty.servlet.{ServletContextHandler, ServletHolder, DefaultServlet}
import org.eclipse.jetty.server.handler._

class Jetty

object Jetty {
  def main(args: Array[String]) {
    val server = new Server(sys.env.getOrElse("PORT", "8080").toInt)
    val base = classOf[Jetty].getClassLoader().getResource("static").toExternalForm

    val context = new ServletContextHandler(ServletContextHandler.SESSIONS)
    context.setContextPath("/")
    context.setResourceBase(base)

    val staticHolder = new ServletHolder
    staticHolder.setInitParameter("dirAllowed", "false")
    staticHolder.setServlet(new DefaultServlet)

    context.addServlet(new ServletHolder(new BoozementServlet),"/api/*");    
    context.addServlet(staticHolder, "/*")

    server.setHandler(context)
    server.start
    server.join
  }
}