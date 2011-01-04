import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._
import org.scala_tools.time.Imports._

class BoozementServlet(protected val database: DB) extends ScalatraServlet with AuthenticationSupport {
  def this() = this(new DB with Env)

  post("/insert") {
    failUnlessAuthenticated
    contentType = "applications/json"
    val time = params("time")
    val date = DateTimeFormat.forPattern("dd.MM.yyyyHH:mm").parseDateTime(params("date") + time)
    val servingType = params("type")
    val amount = params("amount").toInt
    database.insertServing(date, servingType, amount)
    val message: JValue = "Juotu " + servingType + " kello " + time + "." 
    val json =  ("status" -> "ok") ~ ("message" -> message)
    compact(render(json))
  }
  
  post("/delete") {
    failUnlessAuthenticated
    contentType = "applications/json"
    val id = params("id").toInt
    val count = database.deleteServing(Some(id))
    println("count:" + count)
    val json =  ("status" -> "ok")
    compact(render(json))
  }  
  
  get("/servings") {
    failUnlessAuthenticated
    contentType = "applications/json"
    val servings = database.servings.map(x => x.toJson)
    val json = ("servings" -> servings)
    compact(render(json))
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
  
  //notFound {
  //  <html><body>notfound</body></html>
  //}
  //error {
  //  <html><body>we have error here now</body></html>
  //}
}
