
import sbt._
class Boozement(info: ProjectInfo) extends DefaultWebProject(info) with IdeaProject {
  val sonatypeNexusSnapshots = "Sonatype Nexus Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
  val sonatypeNexusReleases = "Sonatype Nexus Releases" at "https://oss.sonatype.org/content/repositories/releases"

  val jetty6 = "org.mortbay.jetty" % "jetty" % "6.1.26" % "test"
  val scalatra = "org.scalatra" %% "scalatra" % "2.0.0.M2"
  val scalatest = "org.scalatra" %% "scalatra-scalatest" % "2.0.0.M2" % "test"
  val servlet = "javax.servlet" % "servlet-api" % "2.5" % "provided->default"

  val scalaQuery = "org.scalaquery" % "scalaquery_2.8.0" % "0.9.0"
  val mysql = "mysql" % "mysql-connector-java" % "5.1.13"

  override val jettyPort = 8081
}

