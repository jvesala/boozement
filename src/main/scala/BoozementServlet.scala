import org.scalatra._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._



class BoozementServlet extends ScalatraServlet {

  get("/") {
    <html>
      <body>
        <h1>Hello, world!</h1>
        Say hello!
      </body>
    </html>
  }

  before {
    Thread.sleep(1000)
  }

  post("/insert") {
    contentType = "applications/json"
    val message: JValue = "Juotu " + params("type") + " kello " + params("time") + "." 
    val json =  ("status" -> "ok") ~ ("message" -> message)
    compact(render(json))
  }

  notFound {
    <html><body>notfound</body></html>
  }

  error {
    <html><body>we have error here now</body></html>
  }
}
