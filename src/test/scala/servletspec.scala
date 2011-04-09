import org.scalatra._
import org.scalatra.test.scalatest._
import org.scalatest.matchers._
import org.scalatest.mock._
import org.scalatest.BeforeAndAfterEach
import org.scala_tools.time.Imports._
import org.easymock._

class ServletSpec extends ScalatraFunSuite with ShouldMatchers with EasyMockSugar with BeforeAndAfterEach {
  val database = mock[BoozementDatabase]
  val boozement = new BoozementServlet(database)
  addServlet(boozement, "/*")

  val testUser = Some(User(Some(1), "foo", "$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W", "m", 72000))
  override def beforeEach = { 
    EasyMock.reset(database)
    database.userByEmail("foo").andReturn(testUser)
    lastCall.times(1)
    database.user(1).andReturn(testUser)
    lastCall.times(1)  
    None          
  }
  
  test("insert serving") {
    expecting {
      database.insertServing(testUser, new DateTime(2010, 1, 20, 14, 45, 0, 0), "Siideriä", 50).andReturn(1)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        post("/insert?date=20.01.2010&time=14:45&type=Siideri%C3%A4&amount=50"){
          status should equal(200)
          body should include("Juotu Siideriä kello 14:45")
        }
      }
    }
  }

  test("delete serving") {
    expecting {
      database.deleteServing(Some(1)).andReturn(1)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        post("/delete?id=1") {
          status should equal(200)
          body should include("""{"status":"ok"}""")
        }
      }
    }
  }

  test("update serving date") {
    expecting {
      database.serving(1).andReturn(Some(Serving(Some(1), Some(1), new DateTime(2008, 3, 21, 12, 12, 0, 0), "Siideri", 50)))
      lastCall.times(1)
      database.updateServing(1, new DateTime(2010, 1, 20, 14, 45, 0, 0), "Siideri", 50).andReturn(1)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        post("/update-serving?id=1&field=date&value=20.01.2010%2014:45") {
          status should equal(200)
          body should include("""{"status":"ok""")
          body should include("""päivitetty""")
        }
      }
    }
  }

  test("get servings first page") {
    expecting {
      val results = List.range(1, 100).map( (x) => Serving(Some(x), Some(1), RandomTime.get, "Olut", 33))
      database.servings(testUser, None).andReturn(results)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        get("/servings?query=&page=0") {
          status should equal(200)
          body should include("""{"servings":["{\"id\":1,""")
          body should not include("""{"servings":["{\"id\":11,""")
        }
      }
    }
  }

  test("get servings second page") {
    expecting {
      val results = List.range(1, 100).map( (x) => Serving(Some(x), Some(1), RandomTime.get, "Olut", 33))
      database.servings(testUser, None).andReturn(results)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        get("/servings?query=&page=1") {
          status should equal(200)
          body should not include("""{"servings":["{\"id\":1,""")
          body should include("""\"id\":21""")
          body should not include("""{"servings":["{\"id\":31""")
        }
      }
    }
  }

  test("search servings") {
    expecting {
      val results = List.range(1,50).map( (x) => Serving(Some(x), Some(1), RandomTime.get, "Siideri", 50))
      database.servings(testUser, Some(List("siideri"))).andReturn(results)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        get("/servings?query=siideri&page=1") {
          status should equal(200)
          body should not include("""{"servings":["{\"id\":1,""")
          body should not include("""{"servings":["{\"id\":20,""")
          body should include("""\"id\":21""")
          body should include("""\"id\":39""")
          body should not include("""{"servings":["{\"id\":41,""")
        }
      }
    }
  }

  test("servings with interval") {
    expecting {
      val initialTime = new DateTime(2010, 1, 20, 9, 0, 0, 0)
      val queryStart = new DateTime(2010, 1, 20, 10, 0, 0, 0)
      val queryEnd = new DateTime(2010, 1, 21, 10, 0, 0, 0)
      val results = List.range(1,24).map( (x) => Serving(Some(x), Some(1), initialTime + x.hours, "Siideri", 50))
      database.servingsInterval(testUser.get, queryStart, queryEnd).andReturn(results)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        get("/servings-interval?start=20.01.2010%2010:00&end=21.01.2010%2010:00") {
          status should equal(200)
          body should include("""count":23""")
        }
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
    expecting {
      database.updateUser(User(Some(1), "newemail", EasyMock.anyObject(), "m", 72000)).andReturn(1)
      lastCall.times(1)
      database.userByEmail("newemail").andReturn(None)
      lastCall.times(1)
    }
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        post("/update-user?email=newemail&password=newpassword") {
          status should equal(200)
          body should include("""{"status":"ok""")
        }
      }
    }
  }

  test("update user invalid data") {
    whenExecuting(database) {
      session {
        post("/login?email=foo&password=foobar") { status should equal(200) }
        post("/update-user?wrong=params") {
          status should equal(400)
        }
      }
    }
  }
  
  test("register user") {
    expecting {
      EasyMock.reset(database)
      database.userByEmail("newemail").andReturn(None)
      lastCall.times(1)
      database.insertUser(EasyMock.anyObject(), EasyMock.anyObject()).andReturn(1)
      lastCall.times(1)
      None
    }
    whenExecuting(database) {
      post("/register?email=newemail&password=newpassword") {
        status should equal(200)
        body should include("""{"status":"ok""")
      }
    }
  }
}
