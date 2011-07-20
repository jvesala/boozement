import org.scala_tools.time.Imports._
import scala.util.Random

object RandomTime {
  val random = new Random
  def randomTimeBetween(start: DateTime, end: DateTime) = new DateTime(start.millis + (random.nextFloat() * (start to end).millis).toLong)  
  def get = randomTimeBetween(DateTime.now-2.years, DateTime.now)  
}

object ServingGenerator {
  val database = new BoozementDatabase

  val userId = Some(1)
  val beerTypes = List("Karjala", "Corona", "Olut", "Tuoppi", "Karhu III")
  val beerSizes = List(25, 33, 50, 66)
  val wineTypes = List("Valkoviini", "Punaviini", "Merlot", "Shampanja", "Kuohuviini", "Shiraz")
  val wineSizes = List(12, 16, 18, 36)
  val drinkTypes = List("Mohito", "Tom Collins", "Gin tonic", "Dry Martini")
  val drinkSizes = List(12, 20)
  
  def cycle[T](seq: Seq[T]) = Stream.from(0).flatten(_ => seq)
  
  def createBeers(count: Int) = {
    val beers = cycle(beerTypes).take(count).toList
    val sizes = cycle(beerSizes).take(count).toList  
    beers.zip(sizes).map(x => Serving(None, userId, RandomTime.get, x._1, x._2, 1.0))
  }
  def createWines(count: Int) = {
    val wines = cycle(wineTypes).take(count).toList
    val sizes = cycle(wineSizes).take(count).toList  
    wines.zip(sizes).map(x => Serving(None, userId, RandomTime.get, x._1, x._2, 1.0))
  }
  def createDrinks(count: Int) = {
    val drinks = cycle(drinkTypes).take(count).toList
    val sizes = cycle(drinkSizes).take(count).toList  
    drinks.zip(sizes).map(x => Serving(None, userId, RandomTime.get, x._1, x._2, 1.0))
  }
  
  def insertBeers(count: Int) = for (s <- createBeers(count)) database.insertServing(s)
  def insertWines(count: Int) = for (s <- createWines(count)) database.insertServing(s)
  def insertDrinks(count: Int) = for (s <- createDrinks(count)) database.insertServing(s)
  
  def doAll(count: Int) =  {insertBeers(count); insertWines(count); insertDrinks(count) }
  
}