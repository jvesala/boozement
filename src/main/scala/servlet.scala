import com.typesafe.scalalogging.slf4j.LazyLogging
import java.net.URLDecoder
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import org.scalatra._
import org.json4s._
import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods._
import java.text.DecimalFormat

class BoozementServlet(protected val database: BoozementDatabase) extends ScalatraServlet with AuthenticationSupport with LazyLogging {
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
        logger.info(s"User ${user.email} drank $servingType, $amount cl - $units")
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
              case "date" => database.updateServing(s.id.get, jodaDate(value).get, s.servingType, s.amount, s.units, user)
              case "servingType" => database.updateServing(s.id.get, s.date, value, s.amount, s.units, user)
              case "amount" => database.updateServing(s.id.get, s.date, s.servingType, value.replace(" cl", "").toInt, s.units, user)
              case "units" => database.updateServing(s.id.get, s.date, s.servingType, s.amount, value.toDouble, user)
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
        val count = database.deleteServing(id, user)
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
    servingsToJson(servings, intParam("page"))
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

  get("/servings-suggestions") {
    failUnlessAuthenticated
    stringParam("query") match {
      case Some(string) =>
        val suggestions = database.servingTypeSuggestions(string)
        val json = ("query" -> string) ~ ("count" -> suggestions.length) ~ ("suggestions" -> suggestions)
        compact(render(json))
      case _ => halt(400)
    }
  }

  post("/update-user") {
    failUnlessAuthenticated
    (stringParam("password"), intParam("weight")) match {
      case (Some(newPassword), Some(newWeight)) => {
        val count = database.updateUser(user.copy(password = PasswordSupport.encrypt(newPassword), weight = newWeight * 1000))
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
        logger.info(s"User $email registered.")
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
    val json:JValue = ("email" -> user.email) ~ ("gender" -> user.gender) ~ ("weight" -> user.weight / 1000)
    compact(render(json))
  }
  
  post("/login")  {
    authenticate
    failUnlessAuthenticated
    val json =  ("status" -> "ok")
    logger.info(s"User ${user.email} logged in.")
    compact(render(json))
  }
  
  post("/logout") {
    logger.info(s"User ${user.email} logged out.")
    logOut
    val json =  ("status" -> "ok")
    compact(render(json))
  }

  def resultsInPage = 20

  def servingsToJson(servings: List[Serving], page: Option[Int] = None) = {
    val returnServings = (page match {
      case Some(page) => servings.drop(resultsInPage * page)
      case _ => servings
    }).take(resultsInPage)
    val json = ("servings" -> returnServings.map(_.toJson)) ~ ("count" -> servings.length) ~
      ("units" -> new DecimalFormat("#0.00").format(servings.map(_.units).fold(0 : Double)(_ + _))) ~
      ("bac" -> Calculator.bacNow(user, servings.reverse))
    compact(render(json))
  }
}
