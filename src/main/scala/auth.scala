import org.scalatra.auth.{ScentryConfig, ScentrySupport, ScentryStrategy, ScalatraKernelProxy}
import org.scalatra.ScalatraKernel
import org.scalatra.FlashMapSupport
import org.scalatra.CookieSupport
import org.scalatra.ScalatraServlet
import org.scalatra.auth.ScentryAuthStore

trait AuthenticationSupport extends ScentrySupport[User] with FlashMapSupport with CookieSupport { self: ScalatraKernel =>
  protected val scentryConfig = (new ScentryConfig {}).asInstanceOf[ScentryConfiguration]
  
  override protected def registerAuthStrategies = scentry.registerStrategy('SessionCookie, app => new CookieSessionStrategy(app))
  //protected def fromSession = { case id: String => Users.getUser(id.toInt) }
  protected def fromSession = { case id: String => User(Some(1), "jussi.vesala@iki.fi", "foobar") }
  protected def toSession = { case usr: User => usr.id.getOrElse("").toString }

  before { 
    scentry.authenticate('SessionCookie) 
    println("user?" + user)  
    
  }
}

class CookieSessionStrategy(protected val app: ScalatraKernelProxy) extends ScentryStrategy[User] {
  override def authenticate = {
    app.cookies.get("userid") match { 
      case userid: Some[String] => Some(User(Some(userid.get.toInt), "jussi.vesala@iki.fi2", "foobar2"))
      case _ => None
    }
  }
}

trait AutoLogger extends CookieSupport { self: ScalatraServlet =>

  before {
    println("Setting cookie...")
    cookies.set("userid", "1")
  }
}