import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfterEach
import org.scalatest.FunSuite
import org.scala_tools.time.Imports._
 
trait TestEnv { self : BoozementDatabase => override def dbUrl = "jdbc:mysql://127.0.0.1:3306/boozement_test?user=boozement&password=boozement" }
 
class CalculatorSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val calculator = new Calculator
  
  def user = User(Some(1), "test@user.com", "$2a$12$6NGXXN3gneDXR7YBv7cO6ezZraBcn14lrIqcQmydvK.ksMRIfPd9W", "M", 75000)
  
  test("should return zero when no drinks consumed") {
    assert(calculator.calculateBac(user, new DateTime(), Nil) == 0)
  }
  


}