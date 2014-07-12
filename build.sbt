import AssemblyKeys._

import com.typesafe.sbt.SbtNativePackager._

import NativePackagerKeys._

packageArchetype.java_application

seq(assemblySettings: _*)

name := "boozement"

version := "1.2"

organization := "jvesala"

scalaVersion :="2.10.3"

parallelExecution in Test := false

mainClass := Some("Jetty")

libraryDependencies ++= Seq(
  "org.scalatra" %% "scalatra" % "2.2.2",
  "org.scalatra" %% "scalatra-auth" % "2.2.2",
  "org.json4s" %% "json4s-native" % "3.2.9",
  "com.typesafe.slick" %% "slick" % "2.0.1",
  "mysql" % "mysql-connector-java" % "5.1.23",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "joda-time" % "joda-time" % "2.3",
  "org.joda" % "joda-convert" % "1.5",
  "com.github.tototoshi" %% "slick-joda-mapper" % "1.1.0",
  "org.slf4j" % "slf4j-api" % "1.7.5",
  "org.slf4j" % "slf4j-simple" % "1.7.5",
  "org.eclipse.jetty" % "jetty-webapp" % "9.1.0.v20131115" % "compile, runtime",
  "org.eclipse.jetty" % "jetty-plus"   % "9.1.0.v20131115" % "compile, runtime",
  "org.scalatra" %% "scalatra-scalatest" % "2.2.2" % "test",
  "javax.servlet" % "javax.servlet-api" % "3.0.1" % "provided"
)

test in assembly := {}

fork in Test := true

autoScalaLibrary := true

jarName in assembly := "boozement.jar"

mergeStrategy in assembly <<= (mergeStrategy in assembly) { (old) =>
  {
    case PathList("META-INF", xs @ _*) => MergeStrategy.discard
    case _ => MergeStrategy.first
  }
}
