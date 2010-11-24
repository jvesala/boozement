//package com.example

import org.scalatra._
import java.net.URL

class BoozementFilter extends ScalatraFilter {
  
  get("/") {
    <html>
      <body>
        <h1>Hello, world!</h1>
        Say hello!
      </body>
    </html>
  }

  notFound {
    <html><body>notfound</body></html>
  }
}
