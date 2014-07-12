import java.sql.{Date, Timestamp}
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import org.json4s._
import org.json4s.JsonDSL._
import org.json4s.native.JsonMethods._
import scala.slick.driver.MySQLDriver.simple._
import scala.slick.direct.AnnotationMapper.column
import scala.slick.lifted.{Query, SimpleFunction}
import scala.slick.jdbc.JdbcBackend.Database.dynamicSession
import scala.slick.jdbc.StaticQuery._
import com.github.tototoshi.slick.MySQLJodaSupport._

class BoozementDatabase {
  def dbUrl = System.getProperty("database.url", "jdbc:mysql://127.0.0.1:3306/boozement?user=boozement&password=boozement")
  lazy val db = Database.forURL(dbUrl, driver = "com.mysql.jdbc.Driver")
  val lastId = SimpleFunction.nullary[Int]("last_insert_id")
  def init {
    db withDynSession {
      updateNA("DROP TABLE IF EXISTS users").execute
      updateNA("DROP TABLE IF EXISTS servings").execute
      (Users.ddl ++ Servings.ddl) create
    }    
  }
  def insertServing(user: Option[User], date: DateTime, servingType: String, amount: Int, units: Double): Int = 
    insertServing(Serving(None, user.get.id, date, servingType, amount, units))
  def insertServing(serving: Serving): Int = db withDynSession {
    Servings.insert(serving)
    Query(lastId).first
  }

  def deleteServing(id: Option[Int], user: User) = db withDynSession {
    val q = for(u <- Servings where {s => (s.id is id) && (s.userId is user.id) }) yield u
    q.delete
  } 
  def serving(id: Int): Option[Serving] =  db withDynSession {
    Servings.findById(Some(id)).firstOption
  }
  def updateServing(id: Int, date: DateTime, servingType: String, amount: Int, units: Double, user: User) = db withDynSession {
    val q = for(s <- Servings where {s => (s.id is id) && (s.userId is user.id) }) yield (s.date, s.servingType, s.amount, s.units)
    q.update((date, servingType, amount, units))
  }
  def servings(user: Option[User]): List[Serving] = servings(user, None) 
  def servings(user: Option[User], words: Option[List[String]]): List[Serving] = {
    def containsWord(candidate: String, w: String) = candidate.toLowerCase.contains(w.toLowerCase)
    def containsWords(s: Serving, words: List[String]) =  {
      words.map{ (w) =>  
        if (containsWord(s.date.toString("dd.MM.yyyyHH:mm"), w) || containsWord(s.servingType, w) || containsWord(s.amount.toString, w)) true else false 
      }.forall(_ == true)
    }
    val result = user match {
      case Some(u) => servingsByUser(u.id)
      case _ => servingsByUser(None) 
    }
    words match {
      case w: Some[List[String]] => result.filter{containsWords(_, words.get)}
      case _ => result
    }
  }
  
  private def servingsByUser(userId: Option[Int]): List[Serving] = db withDynSession {
    val q = userId match {
      case Some(id) => for { s <- Servings if s.userId is id } yield s
      case _ => for { s <- Servings } yield s
    }
    q.sortBy(_.date.desc).list
  }
  
  def servingsInterval(user: User, start: DateTime, end: DateTime): List[Serving] = db withDynSession  {
    val q = for {
      s <- Servings if ((s.userId is user.id) && (s.date > start) && (s.date < end))
    } yield s
    q.sortBy(_.date.desc).list
  }

  def servingTypeSuggestions(prefix: String): List[String] = db withDynSession {
    prefix.toList match {
      case x :: xs =>
        val lower = x.toString.toLowerCase + xs.mkString + "%"
        val firstUpper = x.toString.toUpperCase + xs.mkString + "%"
        val q = sql"select type from servings where type like $lower or type like $firstUpper group by type order by count(type) desc;".as[String]
        q.list
      case _ => List.empty
    }
  }
  
  def insertUser(email: String, password: String, gender: String, weight: Int): Int = 
    insertUser(User(None, email, password, gender, weight))
  def insertUser(user: User) = db withDynSession {
    Users.insert(user)
    Query(lastId).first
  }
  def updateUser(usr: User) = db withDynSession {
    val q = for(u <- Users where {_.id is usr.id }) yield (u.email, u.password, u.weight, u.gender)
    q.update((usr.email, usr.password, usr.weight, usr.gender))
  }
  def user(id: Int): Option[User] = db withDynSession {
    Users.findById(Some(id)).firstOption
  }
  def userByEmail(email: String): Option[User] = db withDynSession {
    Users.findByEmail(email).firstOption
  }
  def deleteUser(id: Int) = db withDynSession {
    val q = for(u <- Users where {_.id is id }) yield u
    q.delete
  }
}

class Servings(tag: Tag) extends Table[Serving](tag, "servings") {
  def id = column[Option[Int]]("id", O.NotNull, O.PrimaryKey, O.AutoInc)
  def userId = column[Option[Int]]("userid")
  def date = column[DateTime]("date", O.Default(new DateTime))
  def servingType = column[String]("type")
  def amount = column[Int]("amount")
  def units = column[Double]("units")
  def * = (id, userId, date, servingType, amount, units) <> (Serving.tupled, Serving.unapply)
  //val findById = createFinderBy(_.id)
}
object Servings extends TableQuery(new Servings(_)) {
  val findById = this.findBy(_.id)
}
case class Serving(id: Option[Int], userId: Option[Int], date: DateTime, servingType: String, amount: Int, units: Double) {
  def toJson = {
    val json =  ("id" -> id.getOrElse(0)) ~ ("userId" -> userId.getOrElse(0)) ~ 
      ("date" -> DateTimeFormat.forPattern("dd.MM.yyyy HH:mm").print(date)) ~ 
      ("type" -> servingType) ~ ("amount" -> amount) ~ ("units" -> units)
    compact(render(json))
  }
}

class Users(tag: Tag) extends Table[User](tag, "users") {
  def id = column[Option[Int]]("id", O.NotNull, O.PrimaryKey, O.AutoInc)
  def email = column[String]("email")
  def password = column[String]("password")
  def gender = column[String]("gender", O.DBType("enum ('M','F')"))
  def weight = column[Int]("weight")
  def * = (id, email, password, gender, weight) <> (User.tupled, User.unapply)
  //val findById = createFinderBy(_.id)
  //val findByEmail = createFinderBy(_.email)
}
object Users extends TableQuery(new Users(_)) {
  val findById = this.findBy(_.id)
  val findByEmail = this.findBy(_.email)
}
case class User(id: Option[Int], email: String, password: String, gender: String, weight: Int)