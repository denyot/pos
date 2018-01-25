package org.eredlab.g4.rif.server;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.webapp.WebAppContext;

public class G4Server
{
  private static Log log = LogFactory.getLog(G4Server.class);
  private String webContext;
  private int webPort;
  private String WebApp;
  Server server = null;

  public G4Server() {
    this.server = new Server();
  }

  public G4Server(String pWebApp, String pWebContext, int pWebPort)
  {
    this.server = new Server();
    this.webContext = pWebContext;
    this.webPort = pWebPort;
    this.WebApp = pWebApp;
  }

  public void start()
  {
    PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");
    String forceLoad = pHelper.getValue("forceLoad", "0");

    if (forceLoad.equals("1")) {
      log.info("********************************************");
      log.info("G4系统集成与应用开发平台[G4Studio]开始启动...");
      log.info("********************************************");
      log.info("系统正在初始化服务容器...");
      SpringBeanLoader.getApplicationContext();
      log.info("容器初始化成功啦，您的托管Bean已经被实例化。");
    }

    Connector connector = new SelectChannelConnector();
    connector.setPort(this.webPort);
    this.server.setConnectors(new Connector[] { connector });
    WebAppContext context = new WebAppContext(
      this.server, 
      this.WebApp, 
      this.webContext);
    try {
      this.server.start();
    } catch (Exception e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n\n G4Server启动出错.\n");
      e.printStackTrace();
    }
  }

  public void stop()
  {
    try
    {
      this.server.stop();
    } catch (Exception e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n\n G4Server未能正常停止.\n");
      e.printStackTrace();
    }
  }

  public String getWebContext() {
    return this.webContext;
  }

  public void setWebContext(String webContext) {
    this.webContext = webContext;
  }

  public int getWebPort() {
    return this.webPort;
  }

  public void setWebPort(int webPort) {
    this.webPort = webPort;
  }

  public String getWebApp() {
    return this.WebApp;
  }

  public void setWebApp(String webApp) {
    this.WebApp = webApp;
  }
}