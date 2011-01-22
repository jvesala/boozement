import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._
import org.scala_tools.time.Imports._
import java.net.URLDecoder

class BoozementServlet(protected val database: BoozementDatabase) extends ScalatraServlet with AuthenticationSupport with RemoteInfo {
  def this() = this(new BoozementDatabase)

  post("/insert") {
    failUnlessAuthenticated
    contentType = "applications/json"
    val time = params("time")
    val date = DateTimeFormat.forPattern("dd.MM.yyyyHH:mm").parseDateTime(params("date") + time)
    val servingType = params("type")
    val amount = params("amount").toInt
    database.insertServing(Some(user), date, servingType, amount)
    val message: JValue = "Juotu " + servingType + " kello " + time + "." 
    val json =  ("status" -> "ok") ~ ("message" -> message)
    compact(render(json))
  }
  
  post("/delete") {
    failUnlessAuthenticated
    contentType = "applications/json"
    (if (params.contains("id")) Some(params("id").toInt) else None) match {
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
    val page = if (params.contains("page")) params("page").toInt else 0
    val query = (if (params.contains("query")) params("query") else "") match {
      case s: String => if(s.length == 0) None else Some(URLDecoder.decode(s, "UTF-8").split(" ").toList)
      case _ => None
    }
    val servings = database.servings(Some(user), query)
    val json = ("servings" -> servings.drop(resultsInPage * page).take(resultsInPage).map(_.toJson)) ~
      ("count" -> servings.length)
    compact(render(json))
  }
  
  post("/update-user") {
    failUnlessAuthenticated
    contentType = "applications/json"
    val email = if (params.contains("email")) Some(params("email")) else None
    val password = if (params.contains("password")) Some(params("password")) else None
    email match {
      case e: Some[String] => password match {
        case p: Some[String] => {
          val count = database.updateUser(user.copy(email = e.get, password = p.get))
          if(count == 0) halt(400)
          val json =  ("status" -> "ok")
          compact(render(json))
        }
        case None => halt(400)
      }
      case None => halt(400)
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
    welcomePage
  }

  post("/logout") {
    contentType = "text/html"
    logOut
    """<div>Olet kirjautunut ulos.</div>"""
  }
  
}
