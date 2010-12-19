import org.scalaquery._
import org.scalaquery.session._
import org.scalaquery.session.Database.threadLocalSession
import org.scalaquery.ql.{Join, Query, Projection, ColumnBase, AbstractTable}
import org.scalaquery.ql.TypeMapper._
import org.scalaquery.util.NamingContext
import org.scalaquery.ql.extended.MySQLDriver
import org.scalaquery.ql.extended.MySQLDriver.Implicit._
import org.scalaquery.ql.extended.{ExtendedTable => Table}
import java.sql.Timestamp
import org.scala_tools.time.Imports._

object InitDatabase {
  def apply() {
    println("Init database")
    DB.db withSession {
	    import org.scalaquery.simple.StaticQuery.updateNA
	    updateNA("DROP TABLE IF EXISTS users").execute
	    updateNA("DROP TABLE IF EXISTS servings").execute
			(Users.ddl ++ ServingsTable.ddl) create
    }
  }
}

object DB {
  val db = Database.forURL("jdbc:mysql://127.0.0.1:3306/boozement?user=boozement&password=boozement", driver = "com.mysql.jdbc.Driver")
  implicit def dateTimeToTimestamp(x: DateTime) = new Timestamp(x.getMillis)
  
  
  def insertServing(date: DateTime, servingType: String, amount: Int) {
    db withSession {
      ServingsTable.insert(Servings(None, date, servingType, amount))
    }
  }
}

object ServingsTable extends Table[Servings]("servings") {
  def id = column[Option[Int]]("id", O.NotNull, O.PrimaryKey, O.AutoInc)
  def date = column[Timestamp]("date")
  def servingType = column[String]("type")
  def amount = column[Int]("amount")
  def * = id ~ date ~ servingType ~ amount <> (Servings, Servings.unapply _)
}
case class Servings(id: Option[Int], date: Timestamp, servingType: String, amount: Int)

object Users extends Table[(Int, String, String, String)]("users") {
  def id = column[Int]("id", O PrimaryKey)
  def username = column[String]("username")
  def first = column[String]("first")
  def last = column[String]("last")
  def * = id ~ username ~ first ~ last
}



/**
drop database boozement;
create database boozement;
grant all on boozement.* to 'boozement'@'%' identified by 'boozement';
grant all on boozement.* to 'boozement'@'localhost' identified by 'boozement';
**/
