import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfterEach
import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
 
trait TestEnv { self : BoozementDatabase => override def dbUrl = "jdbc:mysql://127.0.0.1:3306/boozement_test?user=boozement&password=boozement" }
 
class ServingDatabaseSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val database = new BoozementDatabase with TestEnv
  override def afterAll = database.init
  override def beforeEach = database.init
  
  test("serving is inserted into db") {    
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    val drinkingTime2 = new DateTime(2011, 3, 26, 12, 10, 0, 0)
    val drinkingTime3 = new DateTime(2012, 4, 26, 12, 0, 0, 0)
    database.insertServing(drinkingTime, "Olut", 33)
    database.insertServing(drinkingTime3, "Siideri", 50)
    database.insertServing(drinkingTime2, "Lonkero", 40)
    val servings = database.servings
    assert(servings.size == 3)
    assert(servings.head.id == Some(1))
    assert(servings.head.amount == 33)
    assert(servings.head.servingType == "Olut")
    assert(servings.head.date == drinkingTime)
    assert(servings.tail.head.id == Some(3))
    assert(servings.last.id == Some(2))
  }

  test("serving is deleted from db") {    
    val drinkingTime = new DateTime(2010, 5, 20, 11, 45, 13, 0)
    val id1 = database.insertServing(drinkingTime, "Siideri", 50)
    val id2 = database.insertServing(drinkingTime, "Lonkero", 33)
    val servings = database.servings
    assert(servings.size == 2)
    database.deleteServing(Some(id1))
    val servings2 = database.servings    
    assert(servings2.size == 1)
    assert(servings2.head.id == Some(id2))
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