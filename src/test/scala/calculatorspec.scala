import org.joda.time.DateTime
import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfterEach
import org.scalatest.FunSuite

class CalculatorSpec extends FunSuite with BeforeAndAfterAll with BeforeAndAfterEach {
  val calculator = new Calculator

  def user = User(None, "", "", "M", 75000)
  def user2 = User(None, "", "", "F", 69000)

  val now = new DateTime
  val manOneBeerNow = Serving(None, user.id, now, "Olut", 33, 1.0)

  test("should return zero when no drinks consumed") {
    val bacHistory = calculator.calculateBacHistory(user, now, Nil)
    assert(bacHistory.head._1 == 0)
  }
  
  test("should return 0.22 for M/75kg immediately after beer has been consumed") {
    val bacHistory = calculator.calculateBacHistory(user, now, List(manOneBeerNow))
    assert(bacHistory.last._1 == 0.21333333333333332)
  }

  test("should return 0.32 for M/75kg immediately after 1.5 units of alcohol") {
    val bacHistory = calculator.calculateBacHistory(user, now, List(Serving(None, user.id, now, "VahvaOlut", 25, 1.5)))
    assert(bacHistory.last._1 == 0.32)
  }

  test("should return 0.22 for M/75kg immediately after two beers") {
    val bacHistory = calculator.calculateBacHistory(user, now, List(manOneBeerNow, manOneBeerNow))
    assert(bacHistory.last._1 == 0.42666666666666664)
  }

  test("should return 0.26 for F/69kg immediately after beer has been consumed") {
    val serving = Serving(None, user2.id, now, "Olut", 33, 1.0)
    val bacHistory = calculator.calculateBacHistory(user2, now, List(serving))
    assert(bacHistory.last._1 == 0.26350461133069825)    
  }

  test("should return 0.08 for M/75kg one hour after beer has been consumed") {
    val bacHistory = calculator.calculateBacHistory(user, now.plusHours(1), List(manOneBeerNow))
    assert(bacHistory.last._1 == 0.08)    
  }

  test("should return 0 for M/75kg 1:40 after beer has been consumed") {
    val bacHistory = calculator.calculateBacHistory(user, now.plusHours(1).plusMinutes(40), List(manOneBeerNow))
    assert(bacHistory.last._1 == 0.0)
  }
}