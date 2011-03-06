import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._
import org.scala_tools.time.Imports._
import java.net.URLDecoder

class BoozementServlet(protected val database: BoozementDatabase) extends ScalatraServlet with AuthenticationSupport with RemoteInfo {
  def this() = this(new BoozementDatabase)

  def getParam[T](convert: String => Option[T])(name: String) = if(params.contains(name)) convert(params(name)) else None
  val toSomeInt = (value: String) => Some(value.toInt)
  val toSomeString = (value: String) => Some(value)
  val intParam = getParam(toSomeInt) _
  val stringParam = getParam(toSomeString) _
  val dateParam = getParam(jodaDate) _

  def jodaDate(source: String) = Some(DateTimeFormat.forPattern("dd.MM.yyyyHH:mm").parseDateTime(source.replace(" ", "")))

  before {
    contentType = "applications/json"  
  }

  post("/insert") {
    failUnlessAuthenticated
    (stringParam("time"), stringParam("date"), stringParam("type"), intParam("amount") ) match {
      case (Some(time), Some(date), Some(servingType), Some(amount)) => {
        val count = database.insertServing(Some(user), jodaDate(date + time).get, servingType, amount)
        if (count == 0) halt(400)
        val message: JValue = "Juotu " + servingType + " kello " + time + "."
        val json =  ("status" -> "ok") ~ ("message" -> message)
        compact(render(json))
      }
      case _ => halt(400)
    }
  }

  post("/update-serving") {
    failUnlessAuthenticated
    (intParam("id"), stringParam("field"), stringParam("value")) match {
      case (Some(id), Some(field), Some(value)) => {
        database.serving(id) match {
          case Some(serving) => {
            if (serving.userId != user.id) halt(401)
            val count = field match {
              case "date" => database.updateServing(serving.id.get, jodaDate(value).get, serving.servingType, serving.amount)
              case "servingType" => database.updateServing(serving.id.get, serving.date, value, serving.amount)
              case "amount" => database.updateServing(serving.id.get, serving.date, serving.servingType, value.replace(" cl", "").toInt)
              case _ => halt(400)
            }
            if (count == 0) halt(400)
            val message: JValue = value + " päivitetty."
            val json =  ("status" -> "ok") ~ ("message" -> message )
            compact(render(json))
          }
          case _ => halt(400)
        }        
      }
      case _ => halt(400)
    }
  }
  
  post("/delete") {
    failUnlessAuthenticated
    intParam("id") match {
      case id: Some[Int] => {
        val count = database.deleteServing(id)
        if(count == 0) halt(400)
        val json =  ("status" -> "ok")
        compact(render(json))
      }
      case None => halt(400) 
    }
  }  
  
  get("/servings") {
    val resultsInPage = 20
    failUnlessAuthenticated
    val query = stringParam("query") match {
      case x if x.get.trim.length == 0 => None
      case Some(string) => Some(URLDecoder.decode(string, "UTF-8").split(" ").toList)
      case _ => None
    }
    val servings = database.servings(Some(user), query)
    val returnServings = (intParam("page") match {
      case Some(page) => servings.drop(resultsInPage * page)
      case _ => servings
    }).take(resultsInPage).map(_.toJson)
    val json = ("servings" -> returnServings) ~ ("count" -> servings.length)
    compact(render(json))
  }

  get("/servings-interval") {
    failUnlessAuthenticated
    val returnServings = (dateParam("start"), dateParam("end")) match {
      case(Some(start), Some(end)) => database.servingsInterval(user, start, end)
      case(_, Some(end)) => database.servingsInterval(user, new DateTime, end)
      case(Some(start), _) => database.servingsInterval(user, start, DateTime.now)
      case _ => halt(400)
    }
    val json = ("servings" -> returnServings.map(_.toJson)) ~ ("count" -> returnServings.length)
    compact(render(json))    
  }
  
  post("/update-user") {
    failUnlessAuthenticated
    (stringParam("email"), stringParam("password")) match {
      case (Some(newEmail), Some(newPassword)) => {
        database.userByEmail(newEmail) match {
          case Some(user) => halt(409)
          case _ =>
        }
        val count = database.updateUser(user.copy(email = newEmail, password = PasswordSupport.encrypt(newPassword)))
        if(count == 0) halt(400)
        val json =  ("status" -> "ok") ~ ("message" -> "Tiedot päivitetty.")
        compact(render(json))
      }
      case _ => halt(400)
    } 
  }
  
  post("/register") {
    (stringParam("email"), stringParam("password")) match {
      case (Some(email), Some(password)) => {
        database.userByEmail(email) match {
          case Some(user) => halt(409)
          case _ =>
        }
        val count = database.insertUser(email, PasswordSupport.encrypt(password))
        if(count == 0) halt(400)
        val json =  ("status" -> "ok") ~ ("message" -> "Käyttäjä luotu.")
        compact(render(json))
      }
      case _ => halt(400)
    }
  }
    
  get("/whoami") {
    val json = user match {
      case user: User => ("user" -> user.email)
      case _ => ("user" -> "")
    }
    compact(render(json))
  }
  
  post("/login")  {
    authenticate
    failUnlessAuthenticated
    val json =  ("status" -> "ok")
    compact(render(json))
  }
  
  post("/logout") {
    logOut
    val json =  ("status" -> "ok")
    compact(render(json))
  }
}
