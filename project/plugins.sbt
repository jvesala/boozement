resolvers += "sbt-assembly-repo" at "http://nexus.scala-tools.org/content/repositories/releases/"

resolvers += Classpaths.typesafeResolver

resolvers += "sbt-idea-repo" at "http://mpeltonen.github.com/maven/"

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.8.6")

libraryDependencies <+= sbtVersion(v => "com.github.siasia" %% "xsbt-web-plugin" % ("0.12.0-0.2.11.1"))

addSbtPlugin("com.github.mpeltonen" % "sbt-idea" % "1.2.0")
