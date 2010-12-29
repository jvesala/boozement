import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfterEach
import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
 
class DBSuite extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val database = new DB with TestEnv
  override def afterAll = database.init
  override def beforeEach = database.init
  
  test("serving is inserted into db") {    
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    database.insertServing(drinkingTime, "Olut", 33)
    val servings = database.servings
    assert(servings.size == 1)
    assert(servings.head.id == Some(1))
    assert(servings.head.amount == 33)
    assert(servings.head.servingType == "Olut")
    assert(servings.head.date == drinkingTime)   
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