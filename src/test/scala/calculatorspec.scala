import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfterEach
import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
  
class CalculatorSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val calculator = new Calculator
  
  def user = User(Some(1), "test@user.com", "$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W", "M", 75000)
    
  test("should return zero when no drinks consumed") {
    val bacHistory = calculator.calculateBacHistory(user, new DateTime(), Nil)
    assert(bacHistory.head._1 == 0)
  }
  
  test("should return 0.22 for M/75kg immediately after beer has been consumed") {
    val time = new DateTime()
    val serving = new Serving(None, user.id, time, "Olut", 33)
    val bacHistory = calculator.calculateBacHistory(user, time, List(serving))
    assert(bacHistory.last._1 == 0.21333333333333332)    
  }

}