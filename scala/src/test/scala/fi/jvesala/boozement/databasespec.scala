package fi.jvesala.boozement

import org.joda.time.DateTime
import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfterEach
import org.scalatest.FunSuite

trait TestEnv { self : BoozementDatabase => override def dbUrl = "jdbc:mysql://127.0.0.1:3306/boozement_test?user=boozement&password=boozement" }
 
class ServingDatabaseSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val database = new BoozementDatabase with TestEnv
  override def afterAll = database.init
  override def beforeEach = database.init
  
  def user = Some(User(Some(1), "test@user.com", "$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W", "m", 75000))
  def user2 = Some(User(Some(2), "test2@user.com", "$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W", "f", 65000))

  test("serving insert and fetch") {    
    val drinkingTime = new DateTime(2001, 3, 26, 12, 0, 0, 0)
    val id = database.insertServing(user, drinkingTime, "Oluttä", 33, 1.0)
    val res = database.serving(id).get
    assert(res.id.get == id)
    assert(res.date == drinkingTime)
    assert(res.servingType == "Oluttä")
  }  
  
  test("servings are inserted into db") {    
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    val drinkingTime2 = new DateTime(2011, 3, 26, 12, 10, 0, 0)
    val drinkingTime3 = new DateTime(2012, 4, 26, 12, 0, 0, 0)
    database.insertServing(user, drinkingTime, "Olut", 33, 1.0)
    database.insertServing(user, drinkingTime3, "Siideri", 50, 1.5)
    database.insertServing(user, drinkingTime2, "Lonkero", 40, 1.2)
    database.insertServing(user2, drinkingTime3, "Punaviini", 18, 1.5)
    val servings = database.servings(user)
    assert(servings.size == 3)
    assert(servings.head.id == Some(2))
    assert(servings.head.userId == Some(1))
    assert(servings.head.amount == 50)
    assert(servings.head.servingType == "Siideri")
    assert(servings.head.units == 1.5)
    assert(servings.head.date == drinkingTime3)
    assert(servings.tail.head.id == Some(3))
    assert(servings.last.id == Some(1))
    assert(database.servings(user2).size == 1)
    assert(database.servings(None).size == 4)
  }

  test("serving is deleted from db") {    
    val drinkingTime = new DateTime(2010, 5, 20, 11, 45, 13, 0)
    val id1 = database.insertServing(user, drinkingTime, "Siideri", 50, 1.5)
    val id2 = database.insertServing(user, drinkingTime, "Lonkero", 33, 1.0)
    val servings = database.servings(user)
    assert(servings.size == 2)
    database.deleteServing(Some(id1), user.get)
    val servings2 = database.servings(user)    
    assert(servings2.size == 1)
    assert(servings2.head.id == Some(id2))
  }

  test("serving is updated") {    
    val drinkingTime = new DateTime(2007, 2, 21, 8, 12, 9, 0)
    val drinkingTimeUpdated = new DateTime(2008, 2, 21, 8, 12, 9, 0)
    val id1 = database.insertServing(user, drinkingTime, "Siideri", 50, 1.5)
    database.updateServing(id1, drinkingTimeUpdated, "SiideriUpdated", 75, 2.3, user.get)
    val serving = database.serving(id1).get
    assert(serving.id == Some(id1))
    assert(serving.date == drinkingTimeUpdated)
    assert(serving.servingType == "SiideriUpdated")
    assert(serving.amount == 75)
  }
  
  test("search servings") {
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    database.insertServing(user, drinkingTime, "Olut", 33, 1.0)
    database.insertServing(user, drinkingTime.plusHours(1), "Siideri", 50, 1.5)
    database.insertServing(user, drinkingTime.plusHours(2), "Lonkero", 40, 1.2)
    database.insertServing(user, drinkingTime.plusHours(3), "Punaviini", 18, 1.5)
    database.insertServing(user, drinkingTime.plusHours(4), "Gin tonic", 18, 1.5)
    assert(database.servings(user).size == 5)
    assert(database.servings(user, Some(List("olut"))).size == 1)
    assert(database.servings(user, Some(List("ii"))).size == 2)
    val res = database.servings(user, Some(List("Olut", "33")))
    assert(res.size == 1)
    assert(res.head.id == Some(1))
  }
  
  test("search servings by interval") {
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    val startTime = drinkingTime.plusHours(1)
    val endTime = drinkingTime.plusHours(7)
    database.insertServing(user, drinkingTime, "Olut", 33, 1.0)
    database.insertServing(user, drinkingTime.plusHours(3), "Siideri", 50, 1.5)
    database.insertServing(user, drinkingTime.plusHours(6), "Lonkero", 40, 1.2)
    database.insertServing(user, drinkingTime.plusHours(9), "Punaviini", 18, 1.5)
    database.insertServing(user, drinkingTime.plusHours(12), "Gin tonic", 18, 1.5)
    val res = database.servingsInterval(user.get, startTime, endTime) 
    assert(res.size == 2)
    assert(res.head.id == Some(3))
    assert(res.tail.head.id == Some(2))
  }

  test("get serving suggestions") {
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    database.insertServing(user, drinkingTime, "Olut I", 33, 1.0)
    database.insertServing(user, drinkingTime.plusHours(3), "Olut III", 50, 1.5)
    database.insertServing(user, drinkingTime.plusHours(6), "Lonkero", 40, 1.2)
    database.insertServing(user, drinkingTime.plusHours(9), "Punaviini", 18, 1.5)
    database.insertServing(user, drinkingTime.plusHours(12), "Gin tonic", 18, 1.5)
    val res = database.servingTypeSuggestions("ol")
    assert(res.size == 2)
    assert(res.head == "Olut I")
    assert(res.tail.head == "Olut III")

    val res2 = database.servingTypeSuggestions("Gi")
    assert(res2.size == 1)
    assert(res2.head == "Gin tonic")
  }
}

class UserDatabaseSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val database = new BoozementDatabase with TestEnv
  override def afterAll = database.init
  override def beforeEach = database.init

  test("user is inserted into db") {  
    val res = database.insertUser("test@test.com", "mypassword", "M", 79000)
    assert(res == 1)
    assert(database.user(1).get.email == "test@test.com")
  }

  test("user is updated") {
    val user = User(None, "originalemail@test.com", "mypassword", "M", 69000)
    val res = database.insertUser(user)
    assert(res == 1)
    assert(database.user(1).get.email == "originalemail@test.com")
    database.updateUser(user.copy(email = "newemail@test.com", id = Some(1)))
    assert(database.user(1).get.email == "newemail@test.com")
  }
  
  test("user is deleted from db") {
    val res = database.insertUser("test@test.com", "mypassword", "M", 79000)
    database.deleteUser(1)
    assert(database.user(1) == None)    
  }
  
  test("user is found by email") {
    database.insertUser("test@test1.com", "mypassword1", "M", 80000)
    database.insertUser("test@test2.com", "mypassword2", "M", 80000)
    database.insertUser("test@test3.com", "mypassword3", "M", 80000)
    val user = database.userByEmail("test@test2.com")
    assert(user.get.password == "mypassword2")   
  }
}
