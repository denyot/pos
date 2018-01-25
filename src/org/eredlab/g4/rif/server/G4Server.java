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
      log.info("G4ϵͳ������Ӧ�ÿ���ƽ̨[G4Studio]��ʼ����...");
      log.info("********************************************");
      log.info("ϵͳ���ڳ�ʼ����������...");
      SpringBeanLoader.getApplicationContext();
      log.info("������ʼ���ɹ����������й�Bean�Ѿ���ʵ������");
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
      log.error("\n�ǳ��ź���֪ͨ��,���������쳣.\n�쳣��Ϣ����:\n\n G4Server��������.\n");
      e.printStackTrace();
    }
  }

  public void stop()
  {
    try
    {
      this.server.stop();
    } catch (Exception e) {
      log.error("\n�ǳ��ź���֪ͨ��,���������쳣.\n�쳣��Ϣ����:\n\n G4Serverδ������ֹͣ.\n");
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