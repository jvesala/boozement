import org.scalatra.auth.{ScentryConfig, ScentrySupport, ScentryStrategy, ScalatraKernelProxy}
import org.scalatra.ScalatraKernel
import org.scalatra.FlashMapSupport
import org.scalatra.CookieSupport
import org.scalatra.ScalatraServlet
import org.scalatra.auth.ScentryAuthStore

trait AuthenticationSupport extends ScentrySupport[User] with FlashMapSupport with CookieSupport { self: BoozementServlet =>
  protected val scentryConfig = (new ScentryConfig {}).asInstanceOf[ScentryConfiguration]
  protected def contextPath = request.getContextPath
  override protected def registerAuthStrategies = 
    scentry.registerStrategy('SessionCookie, app => new CookieSessionStrategy(app, database))
  protected def fromSession = { case id: String => database.user(id.toInt).get }
  protected def toSession = { case usr: User => usr.id.getOrElse("").toString }
 
  def failUnlessAuthenticated = if (!isAuthenticated) halt(401)
}

class CookieSessionStrategy(protected val app: ScalatraKernelProxy, val database: BoozementDatabase) extends ScentryStrategy[User] {
  def email = app.params.get("email")
  def password = app.params.get("password")
  override def isValid = email.isDefined && password.isDefined
  
  override def authenticate = {
    val userCandidate = database.userByEmail(email.getOrElse(""))
    userCandidate match {
      case user: Some[User] =>if (PasswordSupport.check(password.getOrElse(""), user.get.password)) user else None
      case _ => None
    }
  }
}

object PasswordSupport {
  import org.mindrot.jbcrypt.BCrypt
  def encrypt(password: String) = BCrypt.hashpw(password, BCrypt.gensalt(12))
  def check(password:String , passwordHash: String) = BCrypt.checkpw(password, passwordHash)
}