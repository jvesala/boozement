
import sbt._
class Boozement(info: ProjectInfo) extends DefaultWebProject(info) with IdeaProject {
  val sonatypeNexusSnapshots = "Sonatype Nexus Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
  val sonatypeNexusReleases = "Sonatype Nexus Releases" at "https://oss.sonatype.org/content/repositories/releases"

  val jetty6 = "org.mortbay.jetty" % "jetty" % "6.1.26" % "test"
  val scalatra = "org.scalatra" %% "scalatra" % "2.0.0.M2"
  val servlet = "javax.servlet" % "servlet-api" % "2.5" % "provided->default"
}

