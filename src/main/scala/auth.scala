import org.scalatra.auth.{ScentryConfig, ScentrySupport, ScentryStrategy}
import org.scalatra.ScalatraKernel
import org.scalatra.ScalatraBase
import org.scalatra.FlashMapSupport
import org.scalatra.CookieSupport
import org.scalatra.ScalatraServlet
import org.scalatra.auth.ScentryAuthStore

trait AuthenticationSupport extends ScentrySupport[User] with FlashMapSupport { self: BoozementServlet =>
  protected val scentryConfig = (new ScentryConfig {}).asInstanceOf[ScentryConfiguration]
  override protected def registerAuthStrategies =
    scentry.register("SessionCookie", app => new CookieSessionStrategy(app, database))
  protected def fromSession = { case id: String => database.user(id.toInt).get }
  protected def toSession = { case usr: User => usr.id.getOrElse("").toString }

  override abstract def initialize(config: ConfigT) = super.initialize(config)

  def failUnlessAuthenticated = if (!isAuthenticated) halt(401)
}

class CookieSessionStrategy(protected val app: ScalatraBase, val database: BoozementDatabase) extends ScentryStrategy[User] {
  def email = app.params.get("email")
  def password = app.params.get("password")
  override def isValid = email.isDefined && password.isDefined
  
  override def authenticate = {
    val userCandidate = database.userByEmail(email.getOrElse(""))
    userCandidate match {
      case user: Some[user] =>if (PasswordSupport.check(password.getOrElse(""), user.get.password)) user else None
      case _ => None
    }
  }
}

trait RemoteInfo {
 self: ScalatraKernel =>
  def remoteAddress(): String = {
    val proxiedAddress = Option(request.getHeader("X-FORWARDED-FOR")).getOrElse("")
    if (!proxiedAddress.isEmpty) proxiedAddress else request.getRemoteAddr
  }
}

object PasswordSupport {
  import org.mindrot.jbcrypt.BCrypt
  def encrypt(password: String) = BCrypt.hashpw(password, BCrypt.gensalt(12))
  def check(password:String , passwordHash: String) = BCrypt.checkpw(password, passwordHash)
}