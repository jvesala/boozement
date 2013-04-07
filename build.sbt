import AssemblyKeys._

seq(assemblySettings: _*)

seq(webSettings :_*)

name := "boozement"

version := "1.1"

organization := "jvesala"

scalaVersion :="2.9.1"

parallelExecution in Test := false

mainClass := Some("Jetty")

libraryDependencies ++= Seq(
  "org.scalatra" %% "scalatra" % "2.0.1",  
  "org.scalatra" %% "scalatra-auth" % "2.0.1",
  "net.liftweb" %% "lift-json" % "2.4-M4",
  "org.scalaquery" % "scalaquery_2.9.0-1" % "0.9.5",
  "mysql" % "mysql-connector-java" % "5.1.13",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "joda-time" % "joda-time" % "1.6.2",
  "org.scala-tools.time" %% "time" % "0.5",
  "org.eclipse.jetty" % "jetty-webapp" % "8.1.9.v20130131" % "compile, runtime, container",
  "org.scalatra" %% "scalatra-scalatest" % "2.0.1" % "test"
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