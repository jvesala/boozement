import AssemblyKeys._

seq(assemblySettings: _*)

seq(webSettings :_*)

name := "boozement"

version := "2.0"

organization := "jvesala"

scalaVersion := "2.10.2"

parallelExecution in Test := false

mainClass := Some("Jetty")

resolvers += "Akka Repo" at "http://repo.akka.io/repository"

libraryDependencies ++= Seq(
  "org.scalatra" % "scalatra_2.10" % "2.2.0",
  "org.scalatra" % "scalatra-auth_2.10" % "2.2.0",
  "org.scalatra" % "scalatra-json_2.10" % "2.2.1",
  "org.json4s"   % "json4s-jackson_2.10" % "3.2.4",
  "com.typesafe.slick" %% "slick" % "1.0.1",
  "mysql" % "mysql-connector-java" % "5.1.26",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "joda-time" % "joda-time" % "2.3",
  "org.scalaj" % "scalaj-time_2.10.2" % "0.7",
  "org.eclipse.jetty" % "jetty-webapp" % "8.1.13.v20130916" % "compile, runtime, container",
  "org.scalatra" % "scalatra-scalatest_2.10" % "2.2.0" % "test"
)

console in Compile <<= console in Test

test in assembly := {}

jarName in assembly := "boozement.jar"

excludedJars in assembly <<= (fullClasspath in assembly) map { cp => 
  cp filter {_.data.getName == "scala-compiler.jar"}
}

webappResources in Compile := Seq(file("src/main/resources/static/"), file("src/test/"))

port in container.Configuration := 8081

mergeStrategy in assembly <<= (mergeStrategy in assembly) { (old) =>
  {
    case PathList("META-INF", xs @ _*) => MergeStrategy.discard
    case _ => MergeStrategy.first
  }
}