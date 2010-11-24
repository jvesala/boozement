//package com.example

import org.scalatra._
import java.net.URL

class BoozementFilter extends ScalatraFilter {
  
  get("/") {
    <html>
      <body>
        <h1>Hello, world!</h1>
        Say <a href="hello-scalate">hello</a>.
      </body>
    </html>
  }

  notFound {
    <html><body>notfound</body></html>
  }
}
