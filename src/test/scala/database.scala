import org.scalatest.BeforeAndAfterAll
import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
 
class DBSuite extends FunSuite with BeforeAndAfterAll {
 
  override def beforeAll = {
    InitDatabase()
  }
  
  test("serving is inserted into db") {    
    val drinkingTime = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    DB.insertServing(drinkingTime, "Olut", 33)
    val servings = DB.servings
    assert(servings.size == 1)
    assert(servings.head.id == Some(1))
    assert(servings.head.amount == 33)
    
    println("we got " + servings.head.date.getClass)
    assert(servings.head.date == drinkingTime)
    
  }
}