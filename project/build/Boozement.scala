
import sbt._
class Boozement(info: ProjectInfo) extends ParentProject(info) with IdeaProject {
  val sonatypeNexusSnapshots = "Sonatype Nexus Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
  val sonatypeNexusReleases = "Sonatype Nexus Releases" at "https://oss.sonatype.org/content/repositories/releases"

  val scalatra = "org.scalatra" %% "scalatra" % "2.0.0.M2"

}

