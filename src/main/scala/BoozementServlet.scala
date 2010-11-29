import org.scalatra._
import java.net.URL

class BoozementServlet extends ScalatraServlet {

  before {
    contentType = "text/html"
  }

  get("/") {
    <html>
      <body>
        <h1>Hello, world!</h1>
        Say hello!
      </body>
    </html>
  }

  get("/insert-page/") {
  }

  notFound {
    <html><body>notfound</body></html>
  }

  error {
    <html><body>we have error here now</body></html>
  }
}
