import org.scalatra._
import java.net.URL

class BoozementServlet extends ScalatraServlet {

  before {
    contentType = "text/html"
  }

  get("/") {
    <html>
      <body>
        <h1>Hello, world!</h1>
        Say hello!
      </body>
    </html>
  }

  get("/insert-page/") {
    <div id="insertpage">
      <div id="dateRange1">
		    <input type="hidden" class="startDate" name="5/15/2009" />
		  </div>
		  <script type="text/javascript" language="JavaScript">
		    alert("ready2");
		    $(function () &#123;
		    
          $("#dateRange1").continuousCalendar(&#123;weeksBefore: 60,weeksAfter: 1&#125;); 
        (&#125;);
      </script>
    </div>
  }

  notFound {
    <html><body>notfound</body></html>
  }

  error {
    <html><body>we have error here now</body></html>
  }
}
