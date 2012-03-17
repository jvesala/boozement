import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._
import net.liftweb.json.Printer._
import org.scala_tools.time.Imports._
import java.net.URLDecoder
import java.text.DecimalFormat

class BoozementServlet(protected val database: BoozementDatabase) extends ScalatraServlet with AuthenticationSupport with RemoteInfo {
  def this() = this(new BoozementDatabase)

  def getParam[T](convert: String => Option[T])(name: String) = if(params.contains(name)) convert(params(name)) else None
  val toSomeInt = (value: String) => Some(value.toInt)
  val toSomeDouble = (value: String) => Some(value.toDouble)
  val toSomeString = (value: String) => Some(value)
  val intParam = getParam(toSomeInt) _
  val doubleParam = getParam(toSomeDouble) _
  val stringParam = getParam(toSomeString) _
  val dateParam = getParam(jodaDate) _

  def jodaDate(source: String) = Some(DateTimeFormat.forPattern("dd.MM.yyyyHH:mm").parseDateTime(source.replace(" ", "")))

  before() {
    contentType = "applications/json; charset=utf-8"
  }

  post("/insert") {
    failUnlessAuthenticated
    (stringParam("time"), stringParam("date"), stringParam("type"), intParam("amount"), doubleParam("units")) match {
      case (Some(time), Some(date), Some(servingType), Some(amount), Some(units)) => {
        val count = database.insertServing(Some(user), jodaDate(date + time).get, servingType, amount, units)
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
          case Some(s) => {
            if (s.userId != user.id) halt(401)
            val count = field match {
              case "date" => database.updateServing(s.id.get, jodaDate(value).get, s.servingType, s.amount, s.units)
              case "servingType" => database.updateServing(s.id.get, s.date, value, s.amount, s.units)
              case "amount" => database.updateServing(s.id.get, s.date, s.servingType, value.replace(" cl", "").toInt, s.units)
              case "units" => database.updateServing(s.id.get, s.date, s.servingType, s.amount, value.toDouble)
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
    }).take(resultsInPage)
    servingsToJson(returnServings)
  }

  get("/servings-interval") {
    failUnlessAuthenticated
    val returnServings = (dateParam("start"), dateParam("end")) match {
      case(Some(start), Some(end)) => database.servingsInterval(user, start, end)
      case(_, Some(end)) => database.servingsInterval(user, new DateTime, end)
      case(Some(start), _) => database.servingsInterval(user, start, DateTime.now)
      case _ => halt(400)
    }
    servingsToJson(returnServings)
  }
  
  post("/update-user") {
    failUnlessAuthenticated
    (stringParam("email"), stringParam("password"), stringParam("gender"), intParam("weight")) match {
      case (Some(newEmail), Some(newPassword), Some(newGender), Some(newWeight)) => {
        database.userByEmail(newEmail) match {
          case Some(existingUser) if (existingUser.id != user.id) => halt(409)
          case _ =>
        }
        val count = database.updateUser(user.copy(
          email = newEmail, password = PasswordSupport.encrypt(newPassword), gender = newGender, weight = newWeight))
        if(count == 0) halt(400)
        val json =  ("status" -> "ok") ~ ("message" -> "Tiedot päivitetty.")
        compact(render(json))
      }
      case _ => halt(400)
    } 
  }
  
  post("/register") {
    (stringParam("email"), stringParam("password"), stringParam("gender"), intParam("weight")) match {
      case (Some(email), Some(password), Some(gender), Some(weight)) => {
        database.userByEmail(email) match {
          case Some(user) => halt(409)
          case _ =>
        }
        val count = database.insertUser(email, PasswordSupport.encrypt(password), gender, weight)
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

  get("/userdata") {
    failUnlessAuthenticated
    val json:JValue = ("email" -> user.email) ~ ("gender" -> user.gender) ~ ("weight" -> user.weight)
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

  def servingsToJson(servings: List[Serving]) = {
    val json = ("servings" -> servings.map(_.toJson)) ~ ("count" -> servings.length) ~
      ("bac" -> Calculator.bacNow(user, servings.reverse)) ~
      ("units" -> new DecimalFormat("#0.00").format(servings.map(_.units).fold(0 : Double)(_ + _)))
    compact(render(json))
  }
}
