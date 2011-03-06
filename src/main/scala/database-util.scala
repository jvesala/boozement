import org.scalaquery._
import org.scalaquery.ql._
import org.scalaquery.ql.basic._
import org.scalaquery.ql.TypeMapper._
import org.scalaquery.session._
import java.sql.Timestamp
import org.scala_tools.time.Imports._

trait JodaTypeMapperDelegates {
  import JodaTypeMapperDelegates._
    
  implicit object DateTimeTypeMapper extends BaseTypeMapper[DateTime] {
    def apply(profile: BasicProfile) = new DateTimeTypeMapperDelegate
  }
}

object JodaTypeMapperDelegates {
  class DateTimeTypeMapperDelegate extends TypeMapperDelegate[DateTime] {
    def toTimestamp(dateTime: DateTime) = new Timestamp(dateTime.getMillis)
    def zero = new DateTime
    def sqlType = java.sql.Types.TIMESTAMP
    def setValue(v: DateTime, p: PositionedParameters) = p.setTimestamp(toTimestamp(v))
    def setOption(v: Option[DateTime], p: PositionedParameters) = p.setTimestampOption(Some(toTimestamp(v.get)))
    def nextValue(r: PositionedResult) = new DateTime(r.nextTimestamp.getTime)
    def updateValue(v: DateTime, r: PositionedResult) = r.updateTimestamp(toTimestamp(v))
    override def valueToSQLLiteral(value: DateTime) = "{ts '"+toTimestamp(value).toString+"'}"
  } 
}