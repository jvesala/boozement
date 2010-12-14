import org.scalaquery._
import org.scalaquery.session._
import org.scalaquery.session.Database.threadLocalSession
import org.scalaquery.ql.{Join, Query, Projection, ColumnBase, AbstractTable}
import org.scalaquery.ql.TypeMapper._
import org.scalaquery.util.NamingContext
import org.scalaquery.ql.extended.MySQLDriver
import org.scalaquery.ql.extended.MySQLDriver.Implicit._
import org.scalaquery.ql.basic.{BasicTable => Table}
import java.sql.Date

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
}

object ServingsTable extends Table[Servings]("servings") {
  def id = column[Int]("id", O PrimaryKey)
  def date = column[Date]("date")
  def servingType = column[String]("type")
  def amount = column[Int]("amount")
  def * = id ~ date ~ servingType ~ amount <> (Servings, Servings.unapply _)
}
case class Servings(id: Int, date: Date, servingType: String, amount: Int)

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
