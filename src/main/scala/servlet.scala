import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._
import org.scala_tools.time.Imports._
import java.net.URLDecoder

class BoozementServlet(protected val database: BoozementDatabase) extends ScalatraServlet with AuthenticationSupport with RemoteInfo {
  def this() = this(new BoozementDatabase)

  def getParam[T](convert: (String) => Option[T])(name: String) = if(params.contains(name)) convert(params(name)) else None
  val toSomeInt = (value: String) => Some(value.toInt)
  val toSomeString = (value: String) => Some(value)
  val intParam = getParam(toSomeInt) _
  val stringParam = getParam(toSomeString) _

  def jodaDate(source: String) = DateTimeFormat.forPattern("dd.MM.yyyyHH:mm").parseDateTime(source)

  post("/insert") {
    failUnlessAuthenticated
    contentType = "applications/json"
    (stringParam("time"), stringParam("date"), stringParam("type"), intParam("amount") ) match {
      case (time: Some[String], date: Some[String], servingType: Some[String], amount: Some[Int]) => {
        val count = database.insertServing(Some(user), jodaDate(date.get + time.get), servingType.get, amount.get)
        if (count == 0) halt(400)
        val message: JValue = "Juotu " + servingType.get + " kello " + time.get + "."
        val json =  ("status" -> "ok") ~ ("message" -> message)
        compact(render(json))
      }
      case _ => halt(400)
    }
  }

  post("/update-serving") {
    failUnlessAuthenticated
    contentType = "applications/json"
    (intParam("id"), stringParam("field"), stringParam("value")) match {
      case (id: Some[Int], field: Some[String], value: Some[String]) => {
        database.serving(id.get) match {
          case s: Some[Serving] => {
            if (s.get.userId != user.id) halt(500)
            val count = field.get match {
              case "date" => database.updateServing(s.get.id.get, jodaDate(value.get.replace(" ", "")), s.get.servingType, s.get.amount)
              case "servingType" => database.updateServing(s.get.id.get, s.get.date, value.get, s.get.amount)
              case "amount" => database.updateServing(s.get.id.get, s.get.date, s.get.servingType, value.get.replace(" cl", "").toInt)
              case _ => halt(400)
            }
            if (count == 0) halt(400)
            val message: JValue = value.get + " päivitetty."
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
    contentType = "applications/json"
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
    contentType = "applications/json"
    val query = stringParam("query") match {
      case x if x.get.trim.length == 0 => None
      case s: Some[String] => Some(URLDecoder.decode(s.get, "UTF-8").split(" ").toList)
      case _ => None
    }
    val servings = database.servings(Some(user), query)
    val returnServings = (intParam("page") match {
      case p: Some[Int] => servings.drop(resultsInPage * p.get)
      case _ => servings
    }).take(resultsInPage).map(_.toJson)
    val json = ("servings" -> returnServings) ~ ("count" -> servings.length)
    compact(render(json))
  }
  
  post("/update-user") {
    failUnlessAuthenticated
    contentType = "applications/json"
    (stringParam("email"), stringParam("password")) match {
      case (e: Some[String], p: Some[String]) => {
        val count = database.updateUser(user.copy(email = e.get, password = PasswordSupport.encrypt(p.get)))
        if(count == 0) halt(400)
        val json =  ("status" -> "ok") ~ ("message" -> "Tiedot päivitetty.")
        compact(render(json))
      }
      case _ => halt(400)
    } 
  }
  
  def welcomePage = """<div id="tab-welcome" class="tab">Tervetuloa</div>"""
  
  get("/welcome") {
    failUnlessAuthenticated
    contentType = "text/html"
    welcomePage
  }
  
  get("/whoami") {
    user match {
      case user: User => user.email
      case _ => ""
    }
  }
  
  post("/login")  {
    contentType = "text/html"
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
