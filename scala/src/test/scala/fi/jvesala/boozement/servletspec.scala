package fi.jvesala.boozement


import java.sql.{Date, Timestamp}
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import org.json4s._
import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods._
import scala.slick.driver.MySQLDriver.simple._
import scala.slick.direct.AnnotationMapper.column
import scala.slick.lifted.{Query, SimpleFunction}
import scala.slick.jdbc.JdbcBackend.Database.dynamicSession
import scala.slick.jdbc.StaticQuery._
import com.github.tototoshi.slick.MySQLJodaSupport._
import org.scalatra._
import org.scalatra.test.scalatest._
import org.scalatest.matchers._
import org.scalatest.BeforeAndAfterEach

class ServletSpec extends ScalatraFunSuite with ShouldMatchers with BeforeAndAfterEach {
  val database = new BoozementDatabase with TestEnv
  val boozement = new BoozementServlet(database)
  addServlet(boozement, "/*")

  override def beforeEach = TestDatabaseInit.init

  def login = post("/login?email=jussi.vesala@iki.fi&password=foobar") { status should equal(200) }

  test("insert serving") {
    session {
      login
      post("/insert?date=20.01.2010&time=14:45&type=Siideri%C3%A4&amount=50&units=1.5"){
        status should equal(200)
        body should include("Juotu Siideriä kello 14:45")
      }
    }
  }

  test("delete serving") {
    session {
      login
      post("/delete?id=1") {
        status should equal(200)
        body should include("""{"status":"ok"}""")
      }
    }
  }

  test("update serving date") {
    session {
      login
      post("/update-serving?id=2&field=date&value=20.01.2010%2014:45") {
        status should equal(200)
        body should include("""{"status":"ok""")
        body should include("""päivitetty""")
      }
    }
  }

  test("get servings first page") {
    session {
      login
      get("/servings?query=") {
        status should equal(200)
        resultContainsIds(body, 63 to 82 toList)
        resultCount(body, 82)
      }
    }
  }

  test("get servings second page") {
    session {
      login
      get("/servings?query=&page=1") {
        status should equal(200)
        body should not include("""{"servings":["{\"id\":63,""")
        body should include("""\"id\":61""")
        body should not include("""{"servings":["{\"id\":42""")
      }
    }
  }

  test("search servings") {
    session {
      login
      get("/servings?query=kuohuviini&page=0") {
        status should equal(200)
        resultContainsIds(body, List(10, 11, 13, 62, 63, 66))
        resultCount(body, 6)
      }
    }
  }

  test("servings with interval") {
    session {
      login
      get("/servings-interval?start=24.02.2011%2012:15&end=25.02.2011%2019:15") {
        status should equal(200)
        resultContainsIds(body, List(64, 65, 66))
        resultCount(body, 3)
      }
    }
  }

  test("servingType suggestions") {
    session {
      login
      get("/servings-suggestions?query=cor") {
        status should equal(200)
        resultCount(body, 3)
      }
    }
  }

  test("whoami") {
    get("/whoami") {
      status should equal(200)
      body should include("""{"user":""}""")
    }
  }

  test("update user happy flow") {
    session {
      login
      post("/update-user?email=newemail&password=newpassword&gender=M&weight=72000") {
        status should equal(200)
        body should include("""{"status":"ok""")
      }
    }
  }

  test("update user invalid data") {
    session {
      login
      post("/update-user?wrong=params") {
        status should equal(400)
      }
    }
  }

  test("register user") {
    post("/register?email=newemail&password=newpassword&gender=F&weight=44000") {
      status should equal(200)
      body should include("""{"status":"ok""")
    }
  }

  def resultContainsIds(body: String, ids: List[Int]) {
    ids.foreach { (id: Int) =>
      body should include("\\\"id\\\":" + id.toString)
    }
  }

  def resultCount(body: String, count: Int) {
    body should include("\"count\":" + count)
  }
}

object TestDatabaseInit {
  lazy val db = Database.forURL("jdbc:mysql://127.0.0.1:3306/boozement_test?user=boozement&password=boozement", driver = "com.mysql.jdbc.Driver")
  def init {
    db withDynSession {
      updateNA("DROP TABLE IF EXISTS servings").execute
      updateNA("DROP TABLE IF EXISTS users").execute
      updateNA("CREATE TABLE servings LIKE servings_template").execute
      updateNA("CREATE TABLE users LIKE users_template").execute
      updateNA("INSERT INTO servings SELECT * FROM servings_template;").execute
      updateNA("INSERT INTO users SELECT * FROM users_template;").execute
    }
  }
}
