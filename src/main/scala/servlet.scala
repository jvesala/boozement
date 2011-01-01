import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._
import org.scala_tools.time.Imports._

class BoozementServlet(database: DB) extends ScalatraServlet with AutoLogger with AuthenticationSupport {
  def this() = this(new DB with Env)

  before {
    //println("setting contentype")
    contentType = "applications/json"    
  }

  post("/insert") {
    auth
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
    auth
    val id = params("id").toInt
    val count = database.deleteServing(Some(id))
    println("count:" + count)
    val json =  ("status" -> "ok")
    compact(render(json))
  }  
  
  get("/servings") {
    auth
    val servings = database.servings.map(x => x.toJson)
    val json = ("servings" -> servings)
    compact(render(json))
  }
  
  post("/login")  {
    cookies.set("userid", "1")
    val json =  ("message" -> "Tervetuloa.")
    compact(render(json))
  }
  

  //notFound {
  //  <html><body>notfound</body></html>
  //}
  //error {
  //  <html><body>we have error here now</body></html>
  //}
}
