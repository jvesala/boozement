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
import net.liftweb.json.JsonAST._
import net.liftweb.json.JsonDSL._

trait Env {
  def connectDb = Database.forURL("jdbc:mysql://127.0.0.1:3306/boozement?user=boozement&password=boozement", driver = "com.mysql.jdbc.Driver") 
}

trait TestEnv {
  def connectDb = Database.forURL("jdbc:mysql://127.0.0.1:3306/boozement_test?user=boozement&password=boozement", driver = "com.mysql.jdbc.Driver")
}

abstract class DB extends Implicits {
  def connectDb: Database  
  lazy val db = connectDb
  
  def init {
    db withSession {
	    import org.scalaquery.simple.StaticQuery.updateNA
	    updateNA("DROP TABLE IF EXISTS users").execute
	    updateNA("DROP TABLE IF EXISTS servings").execute
			(Users.ddl ++ ServingsTable.ddl) create
    }    
  }
  
  def insertServing(date: DateTime, servingType: String, amount: Int) = {
    db withSession {
      ServingsTable.insert(Serving(None, date, servingType, amount))
    }
  }
  
  def servings: List[Serving] = { 
    db withSession  {
      ServingsTable.servings
    }
  }
}

object ServingsTable extends Table[(Option[Int], Timestamp, String, Int)]("servings") with Implicits {
  def id = column[Option[Int]]("id", O.NotNull, O.PrimaryKey, O.AutoInc)
  def date = column[Timestamp]("date")
  def servingType = column[String]("type")
  def amount = column[Int]("amount")
  def * = id ~ date ~ servingType ~ amount
  def toServing(x: (Option[Int], Timestamp, String, Int)) = Serving(x._1, x._2, x._3, x._4)  
  def servings = (for(s <- ServingsTable) yield s).mapResult(toServing).list   
}
case class Serving(id: Option[Int], date: DateTime, servingType: String, amount: Int) {
  def toJson = {
    val json =  ("id" -> id.getOrElse(0)) ~ 
      ("date" -> DateTimeFormat.forPattern("dd.MM.yyyy HH:mm").print(date)) ~ 
      ("type" -> servingType) ~ ("amount" -> amount)
    compact(render(json))
  }
}

object Users extends Table[(Int, String, String, String)]("users") {
  def id = column[Int]("id", O PrimaryKey)
  def username = column[String]("username")
  def first = column[String]("first")
  def last = column[String]("last")
  def * = id ~ username ~ first ~ last
}

trait Implicits {
  implicit def dateTimeToTimestamp(x: DateTime): Timestamp = new Timestamp(x.getMillis)
  implicit def timeStampToDateTime(x: Timestamp): DateTime = new DateTime(x.getTime)  
  implicit def servingToTableRow(x: Serving): (Option[Int], Timestamp, String, Int) = (x.id, x.date, x.servingType, x.amount)        
}

/**
drop database boozement;
create database boozement;
grant all on boozement.* to 'boozement'@'%' identified by 'boozement';
grant all on boozement.* to 'boozement'@'localhost' identified by 'boozement';

drop database boozement_test;
create database boozement_test;
grant all on boozement_test.* to 'boozement'@'%' identified by 'boozement';
grant all on boozement_test.* to 'boozement'@'localhost' identified by 'boozement';
**/
