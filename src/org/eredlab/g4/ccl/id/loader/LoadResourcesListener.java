package org.eredlab.g4.ccl.id.loader;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class LoadResourcesListener
  implements ServletContextListener
{
  public void contextInitialized(ServletContextEvent pServletContextEvent)
  {
    String WEB_HOME = pServletContextEvent.getServletContext().getRealPath("/");
    ResourcesLoader.load(WEB_HOME);
  }

  public void contextDestroyed(ServletContextEvent pServletContextEvent)
  {
  }
}