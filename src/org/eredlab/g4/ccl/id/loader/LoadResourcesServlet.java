package org.eredlab.g4.ccl.id.loader;

import java.io.IOException;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoadResourcesServlet extends HttpServlet
{
  private static final long serialVersionUID = 1L;

  public void init()
    throws ServletException
  {
    String WEB_HOME = getServletContext().getRealPath("/");
    ResourcesLoader.load(WEB_HOME);
  }

  public void service(HttpServletRequest request, HttpServletResponse response) throws IOException {
    getServletContext().log(
      "Attempt to call service method on LoadResourcesServlet as [" + 
      request.getRequestURI() + "] was ignored");
    response.sendError(400);
  }
}