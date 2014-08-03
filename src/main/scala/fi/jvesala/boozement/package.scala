package fi.jvesala

import org.joda.time.{DateTimeZone, DateTime}
import org.joda.time.format.DateTimeFormat

package object boozement {
  val mysqlFormatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss").withZone(DateTimeZone.forID("Europe/Helsinki"))
  def now = DateTime.now(DateTimeZone.forID("Europe/Helsinki"))
}