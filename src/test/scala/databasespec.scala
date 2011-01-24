import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfterEach
import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
 
trait TestEnv { self : BoozementDatabase => override def dbUrl = "jdbc:mysql://127.0.0.1:3306/boozement_test?user=boozement&password=boozement" }
 
class ServingDatabaseSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val database = new BoozementDatabase with TestEnv
  override def afterAll = database.init
  override def beforeEach = database.init
  
  def user = Some(User(Some(1), "test@user.com", "$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W"))
  def user2 = Some(User(Some(2), "test2@user.com", "$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W"))

  test("serving insert and search") {    
    val drinkingTime = new DateTime(2001, 3, 26, 12, 0, 0, 0)
    val id = database.insertServing(user, drinkingTime, "Olut", 33)
    val res = database.serving(id).get
    assert(res.id.get == id)
    assert(res.date == drinkingTime)
    assert(res.servingType == "Olut")    
  }  
  
  test("servings are inserted into db") {    
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    val drinkingTime2 = new DateTime(2011, 3, 26, 12, 10, 0, 0)
    val drinkingTime3 = new DateTime(2012, 4, 26, 12, 0, 0, 0)
    database.insertServing(user, drinkingTime, "Olut", 33)
    database.insertServing(user, drinkingTime3, "Siideri", 50)
    database.insertServing(user, drinkingTime2, "Lonkero", 40)
    database.insertServing(user2, drinkingTime3, "Punaviini", 18)
    val servings = database.servings(user)
    assert(servings.size == 3)
    assert(servings.head.id == Some(2))
    assert(servings.head.userId == Some(1))
    assert(servings.head.amount == 50)
    assert(servings.head.servingType == "Siideri")
    assert(servings.head.date == drinkingTime3)
    assert(servings.tail.head.id == Some(3))
    assert(servings.last.id == Some(1))
    assert(database.servings(user2).size == 1)
    assert(database.servings(None).size == 4)
  }

  test("serving is deleted from db") {    
    val drinkingTime = new DateTime(2010, 5, 20, 11, 45, 13, 0)
    val id1 = database.insertServing(user, drinkingTime, "Siideri", 50)
    val id2 = database.insertServing(user, drinkingTime, "Lonkero", 33)
    val servings = database.servings(user)
    assert(servings.size == 2)
    database.deleteServing(Some(id1))
    val servings2 = database.servings(user)    
    assert(servings2.size == 1)
    assert(servings2.head.id == Some(id2))
  }
  
  test("search servings") {
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    database.insertServing(user, drinkingTime, "Olut", 33)
    database.insertServing(user, drinkingTime + 1.hours, "Siideri", 50)
    database.insertServing(user, drinkingTime + 2.hours, "Lonkero", 40)
    database.insertServing(user, drinkingTime + 3.hours, "Punaviini", 18)
    database.insertServing(user, drinkingTime + 4.hours, "Gin tonic", 18)
    assert(database.servings(user).size == 5)
    assert(database.servings(user, Some(List("olut"))).size == 1)
    assert(database.servings(user, Some(List("ii"))).size == 2)
    val res = database.servings(user, Some(List("Olut", "33")))
    assert(res.size == 1)
    assert(res.head.id == Some(1))
  }
}

class UserDatabaseSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val database = new BoozementDatabase with TestEnv
  override def afterAll = database.init
  override def beforeEach = database.init

  test("user is inserted into db") {  
    val res = database.insertUser("test@test.com", "mypassword")
    assert(res == 1)
    assert(database.user(1).get.email == "test@test.com")
  }

  test("user is updated") {
    val user = User(None, "originalemail@test.com", "mypassword")
    val res = database.insertUser(user)
    assert(res == 1)
    assert(database.user(1).get.email == "originalemail@test.com")
    database.updateUser(user.copy(email = "newemail@test.com", id = Some(1)))
    assert(database.user(1).get.email == "newemail@test.com")
  }
  
  test("user is deleted from db") {
    val res = database.insertUser("test@test.com", "mypassword")
    database.deleteUser(1)
    assert(database.user(1) == None)    
  }
  
  test("user is found by email") {
    database.insertUser("test@test1.com", "mypassword1")
    database.insertUser("test@test2.com", "mypassword2")
    database.insertUser("test@test3.com", "mypassword3")
    val user = database.userByEmail("test@test2.com")
    assert(user.get.password == "mypassword2")   
  }
}