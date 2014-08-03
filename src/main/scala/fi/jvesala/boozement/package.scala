package fi.jvesala

import org.joda.time.{DateTimeZone, DateTime}

package object boozement {
  def now = DateTime.now(DateTimeZone.forID("Europe/Helsinki"))
}