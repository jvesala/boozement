package fi.jvesala.boozement

import org.joda.time.{DateTimeZone, Duration, DateTime}
import scala.math._
import java.text.DecimalFormat

class Calculator {
  val gramsInUnit = 12D
  def alcoholInGramsInServing(serving: Serving) = serving.units * gramsInUnit

  def weightInKilos(weight: Double) = weight / 1000
  def hourInMillis = 3600 * 1000
  def burnRateInMillis(weight: Double) = 0.1 * weightInKilos(weight) / hourInMillis

  def remainingAmount(weight: Double, startGrams: Double, start: DateTime, end: DateTime) = 
    max(startGrams - burnRateInMillis(weight) * new Duration(start, end).getMillis, 0)

  def genderFactor(gender: String) = if (gender == "M") 0.75 else 0.66
  def gramsToBac(user: User, grams: Double) = grams / (genderFactor(user.gender) * user.weight) * 1000

  def calculateBacHistory(user: User, now: DateTime, servings: List[Serving]): List[(Double, DateTime)] = {
    val startTime = if(servings.size > 0) servings.head.date else now
    val start = (0D, startTime)
    val end = Serving(None, None, now, "", 0, 0)
    val gramHistory = (servings ++ List(end)).scanLeft(start)( (last, next) => {
      (remainingAmount(user.weight, last._1, last._2, next.date) + alcoholInGramsInServing(next), next.date)
    })
    gramHistory.map( x => { (gramsToBac(user, x._1), x._2) })
  }
  
  def formatBac(d: Double): String = new DecimalFormat("#0.00").format(d)
  
  def bacNow(user: User, servings: List[Serving]): String = 
    formatBac(calculateBacHistory(user, now, servings).last._1)
}

object Calculator extends Calculator