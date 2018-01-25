package cn.longhaul.sap.system.esb.hesssion;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.remoting.caucho.HessianExporter;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.util.NestedServletException;

public class MyHessianExport extends HessianExporter
  implements HttpRequestHandler
{
  public void handleRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    if (!"POST".equals(request.getMethod()))
      throw new HttpRequestMethodNotSupportedException(request.getMethod(), new String[] { "POST" }, "HessianServiceExporter only supports POST requests");
    try
    {
      HessianContext.setRequest(request);
      invoke(request.getInputStream(), response.getOutputStream());
    } catch (Throwable ex) {
      throw new NestedServletException("Hessian skeleton invocation failed", ex);
    } finally {
      HessianContext.clear();
    }
  }
}