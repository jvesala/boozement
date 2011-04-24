import org.scala_tools.time.Imports._

class Calculator {
  
  def alcoholInGramsInServing(serving: Serving) = 12D
  
  def burnRate(weight: Double) = 0.1 * weight / (3600 * 1000)
  
  def remainingAmount(weight: Double, startGrams: Double, start: DateTime, end: DateTime) =
    startGrams - burnRate(weight) * (end.millis - start.millis)
  
  def genderFactor(gender: String) = if (gender == "M") 0.75 else 0.66
  
  def gramsToBac(user: User, grams: Double) = grams / (genderFactor(user.gender) * user.weight) * 1000
  
  def calculateBacHistory(user: User, now: DateTime, servings: List[Serving]): List[(Double, DateTime)] = {
    val initTime = if(servings.size > 0) servings.head.date else now
    val init = (0D, initTime)
    val gramHistory = servings.scanLeft(init)( (last, next) => {
      (remainingAmount(user.weight, last._1, last._2, next.date) + alcoholInGramsInServing(next), next.date)
    })    
    gramHistory.map( x => { (gramsToBac(user, x._1), x._2) })
  }
  
}

object Calculator extends Calculator