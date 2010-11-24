import org.scalatra._
import org.scalatra.test.scalatest._
import org.scalatest.matchers._

class BoozementServletSpec extends ScalatraFunSuite with ShouldMatchers {
  addServlet(classOf[BoozementServlet], "/*")

  test("get insert page") {
    get("/insert-page/") {
      status should equal (200)
      //body should include ("hi!")
    }
  }
}

