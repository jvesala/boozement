import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._
import org.scala_tools.time.Imports._

class BoozementServlet extends ScalatraServlet {
  val database = new DB with Env

  post("/insert") {
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
  
  get("/servings") {
    val servings = database.servings.map(x => x.toJson)
    val json = ("servings" -> servings)
    compact(render(json))
  }

  notFound {
    <html><body>notfound</body></html>
  }

  //error {
  //  <html><body>we have error here now</body></html>
  //}
}
