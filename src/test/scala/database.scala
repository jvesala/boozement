import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
 
class DBSuite extends FunSuite {
 
  InitDatabase
  
  test("serving is inserted into db") {    
    val time = new DateTime(2010, 3, 26, 12, 0, 0, 0)
    DB.insertServing(time, "Olut", 33) 
  }
}