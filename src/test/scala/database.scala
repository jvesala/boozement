import org.scalatest.BeforeAndAfterAll
import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
 
class DBSuite extends FunSuite with BeforeAndAfterAll {
  val database = new DB with TestEnv
  override def beforeAll = database.init
  
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
}