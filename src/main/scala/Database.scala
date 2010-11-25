import org.scalaquery.ql.extended.MySQLDriver
import org.scalaquery.session._
import org.scalaquery.session.Database.threadLocalSession
import org.scalaquery.ql.{Join, Query, Projection, ColumnBase, AbstractTable}
import org.scalaquery.ql.TypeMapper._
import org.scalaquery.ql.basic.BasicDriver
import org.scalaquery.ql.basic.BasicDriver.Implicit._
import org.scalaquery.ql.basic.{BasicTable => Table}
import org.scalaquery.util.NamingContext



object InitDatabase {
  def main(args: Array[String]) {
    println("Init")
    val db = Database.forURL("jdbc:mysql://127.0.0.1:3306/boozement?user=boozement&password=boozement", driver = "MySQLDriver")

    db withSession {
      (Users.ddl).createStatements.foreach(println)
    }
  }
//    val sf = new DriverManagerSessionFactory(DatabaseSettings.dbUrl, DatabaseSettings.dbDriver)
//    val dropTable = updateNA("DROP TABLE IF EXISTS tracks")
//    val createTable = updateNA("CREATE TABLE tracks (id INTEGER NOT NULL AUTO_INCREMENT,filename VARCHAR(1024) NOT NULL,length INTEGER NOT NULL,artist VARCHAR(1024) NOT NULL,album VARCHAR(1024) NOT NULL,title VARCHAR(1024) NOT NULL,trackNumber VARCHAR(1024) NOT NULL, PRIMARY KEY(ID))")
//    sf withSession {
//      getThreadSession.withTransaction {
//        println("Dropping existing table" + dropTable())
//        println("Creating user table: " + createTable())
//      }
//    }
//  }
}


class Database {

 // val db = Database.forURL("jdbc:mysql://127.0.0.1:3306/boozement?user=boozement&password=boozement", driver = "MySQLDriver")


}

object Users extends Table[(Int, String, String, String)]("users") {
  def id = column[Int]("id")

  def username = column[String]("username")

  def first = column[String]("first")

  def last = column[String]("last")

  def * = id ~ username ~ first ~ last
}


/**
drop database moozement;
create database moozement;
grant all on boozement.* to 'boozement'@'%' identified by 'boozement';
grant all on boozement.* to 'boozement'@'localhost' identified by 'boozement';
**/
