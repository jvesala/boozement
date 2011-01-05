import org.scalaquery._
import org.scalaquery.session._
import org.scalaquery.session.Database.threadLocalSession
import org.scalaquery.ql.{Join, Query, Projection, ColumnBase, AbstractTable}
import org.scalaquery.ql.TypeMapper._
import org.scalaquery.util.NamingContext
import org.scalaquery.ql.extended.MySQLDriver
import org.scalaquery.ql.extended.MySQLDriver.Implicit._
import org.scalaquery.ql.extended.{ExtendedTable => Table}
import org.scalaquery.simple.StaticQuery._
import java.sql.Timestamp
import org.scala_tools.time.Imports._
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._

class BoozementDatabase extends Implicits {
  def dbUrl = System.getProperty("database.url", "jdbc:mysql://127.0.0.1:3306/boozement?user=boozement&password=boozement")  
  lazy val db = Database.forURL(dbUrl, driver = "com.mysql.jdbc.Driver")
  def init {
    db withSession {
      updateNA("DROP TABLE IF EXISTS users").execute
      updateNA("DROP TABLE IF EXISTS servings").execute
      (Users.ddl ++ Servings.ddl) create
    }    
  }
  def insertServing(user: Option[User], date: DateTime, servingType: String, amount: Int) = {
    db withSession {
      Servings.insert(Serving(None, user.get.id, date, servingType, amount))
      queryNA[Int]("select last_insert_id()").list.head
    }
  }
  def deleteServing(id: Option[Int]) = {
    db withSession {
      val q = for(u <- Servings where {_.id is id }) yield u
      q.delete
    }
  } 
  def servings: List[Serving] = { 
    db withSession  {
      Servings.servings
    }
  }
  
  def insertUser(email: String, password: String) = { db withSession {
    Users.insert(User(None, email, password))
    queryNA[Int]("select last_insert_id()").list.head
  }}
  def user(id: Int): Option[User] = { db withSession { 
    Users.findById.firstOption(Some(id))     
  }}
  def userByEmail(email: String): Option[User] = { db withSession {
    Users.findByEmail.firstOption(email) 
  }}
  def deleteUser(id: Int) = { db withSession {
    val q = for(u <- Users where {_.id is id }) yield u
    q.delete
  }}  
}

object Servings extends Table[(Option[Int], Option[Int], Timestamp, String, Int)]("servings") with Implicits {
  def id = column[Option[Int]]("id", O.NotNull, O.PrimaryKey, O.AutoInc)
  def userId = column[Option[Int]]("userid")
  def date = column[Timestamp]("date", O.Default(new Timestamp(1000)))
  def servingType = column[String]("type")
  def amount = column[Int]("amount")
  def * = id ~ userId ~ date ~ servingType ~ amount
  def servings: List[Serving] = (for(s <- Servings; _ <- Query orderBy s.date) yield s).list
}
case class Serving(id: Option[Int], userId: Option[Int], date: DateTime, servingType: String, amount: Int) {
  def toJson = {
    val json =  ("id" -> id.getOrElse(0)) ~ ("userId" -> userId.getOrElse(0)) ~ 
      ("date" -> DateTimeFormat.forPattern("dd.MM.yyyy HH:mm").print(date)) ~ 
      ("type" -> servingType) ~ ("amount" -> amount)
    compact(render(json))
  }
}

object Users extends Table[User]("users") {
  def id = column[Option[Int]]("id", O.NotNull, O.PrimaryKey, O.AutoInc)
  def email = column[String]("email")
  def password = column[String]("password")
  def * = id ~ email ~ password <> (User, User.unapply _)
  val findById = createFinderBy(_.id)
  val findByEmail = createFinderBy(_.email)
}
case class User(id: Option[Int], email: String, password: String)

trait Implicits {
  implicit def dateTimeToTimestamp(x: DateTime): Timestamp = new Timestamp(x.getMillis)
  implicit def timeStampToDateTime(x: Timestamp): DateTime = new DateTime(x.getTime)  
  implicit def servingToTableRow(x: Serving): (Option[Int], Option[Int], Timestamp, String, Int) = 
    (x.id, x.userId, x.date, x.servingType, x.amount)        
  implicit def tableRowsToServings(r: List[(Option[Int], Option[Int], Timestamp, String, Int)]): List[Serving] =
    r.map({x => Serving(x._1, x._2, x._3, x._4, x._5)})
}