import org.scalatra._
import org.scalatra.test.scalatest._
import org.scalatest.matchers._
import org.scalatest.mock._
import org.scalatest.BeforeAndAfterEach
import org.scala_tools.time.Imports._
import org.easymock._

trait DummyAuthentication { self: AuthenticationSupport => override def auth = {} }

class ServletSpec extends ScalatraFunSuite with ShouldMatchers with EasyMockSugar with BeforeAndAfterEach {
  val database = mock[DB]
  val boozement = new BoozementServlet(database) with DummyAuthentication
  addServlet(boozement, "/*")
 
  override def beforeEach = EasyMock.reset(database)
    
  test("insert serving") {
    expecting {
      database.insertServing(new DateTime(2010, 1, 20, 14, 45, 0, 0), "Siideri", 50).andReturn(1)
      lastCall.times(1)
    }
    whenExecuting(database) {
      post("/insert?date=20.01.2010&time=14:45&type=Siideri&amount=50"){
        status should equal(200)
        body should include("Juotu Siideri kello 14:45")
      }
    }
  }

  test("delete serving") {
    expecting {
      database.deleteServing(Some(1)).andReturn(1)
      lastCall.times(1)
    }
    whenExecuting(database) {
      post("/delete?id=1"){
        status should equal(200)
        body should include("""{"status":"ok"}""")
      }
    }
  }

  test("get servings") {
    expecting {
      database.servings.andReturn(List(Serving(Some(1), DateTime.now, "Olut", 33)))
      lastCall.times(1)
    }
    whenExecuting(database) {
      get("/servings"){
        status should equal(200)
        body should include("""{"servings":["{\"id\":1,""")
      }
    }
  }
}

