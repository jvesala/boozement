import org.scalatra.auth.{ScentryConfig, ScentrySupport, ScentryStrategy, ScalatraKernelProxy}
import org.scalatra.ScalatraKernel
import org.scalatra.FlashMapSupport
import org.scalatra.CookieSupport
import org.scalatra.ScalatraServlet
import org.scalatra.auth.ScentryAuthStore

trait AuthenticationSupport extends ScentrySupport[User] with FlashMapSupport with CookieSupport { self: BoozementServlet =>
  protected val scentryConfig = (new ScentryConfig {}).asInstanceOf[ScentryConfiguration]
  override protected def registerAuthStrategies = 
    scentry.registerStrategy('SessionCookie, app => new CookieSessionStrategy(app, database))
  protected def fromSession = { case id: String => database.user(id.toInt).get }
  protected def toSession = { case usr: User => usr.id.getOrElse("").toString }
 
  def auth = {
    scentry.authenticate('SessionCookie) 
    user match {
      case user: User => 
      case _ => halt(401, "Unauthorized")
    }    
  }
}

class CookieSessionStrategy(protected val app: ScalatraKernelProxy, val database: DB) extends ScentryStrategy[User] {
  override def authenticate = {
    app.cookies.get("userid") match { 
      case id: Some[String] => database.user(id.get.toInt)
      case _ => None
    }
  }
}