package cn.longhaul.sap.system.connection;

import cn.longhaul.sap.system.model.SapAppSystem;
import cn.longhaul.sap.system.model.SapMsSystem;
import com.sap.conn.jco.ext.DestinationDataEventListener;
import com.sap.conn.jco.ext.DestinationDataProvider;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.Properties;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class MyDestinationDataProvider
  implements DestinationDataProvider
{
  private static Log log = LogFactory.getLog(MyDestinationDataProvider.class);
  private static HashMap<String, Properties> destinations;
  private static Properties ABAP_AS_properties;
  private static MyDestinationDataProvider provider = new MyDestinationDataProvider();

  private MyDestinationDataProvider() {
    if (provider == null)
    {
      log.info("Creating MyDestinationDataProvider ...");
      destinations = new HashMap();
    }
  }

  public static MyDestinationDataProvider getInstance()
  {
    log.info("Creating MyDestinationDataProvider ...");
    return provider;
  }

  void addDestination(String destinationName, Properties properties)
  {
    synchronized (destinations) {
      if (destinations.containsKey(destinationName))
        destinations.remove(destinationName);
      destinations.put(destinationName, properties);
    }
  }

  public void addSystem(String systemName) throws Exception {
    try {
      Dto pDto = (BaseDto)SAPConnect.getSAPConnect(systemName);
      if ((G4Utils.isNotEmpty(pDto.getAsString("pk"))) && (G4Utils.isNotEmpty(pDto.getAsString("host")))) {
        SapAppSystem system = new SapAppSystem(pDto.getAsString("pk"), pDto.getAsString("host"), 
          pDto.getAsString("client"), pDto.getAsString("sysno"), pDto.getAsString("user"), 
          pDto.getAsString("pass"), pDto.getAsString("lang"), pDto.getAsString("pool_capacity"), 
          pDto.getAsString("peak_limit"), pDto.getAsString("saprouter"));
        addSystem(system);
      } else if ((G4Utils.isNotEmpty(pDto.getAsString("pk"))) && (G4Utils.isNotEmpty(pDto.getAsString("mhost")))) {
        SapMsSystem system = new SapMsSystem(pDto.getAsString("pk"), pDto.getAsString("mhost"), 
          pDto.getAsString("r3name"), pDto.getAsString("group"), pDto.getAsString("client"), 
          pDto.getAsString("sysno"), pDto.getAsString("user"), pDto.getAsString("pass"), 
          pDto.getAsString("lang"), pDto.getAsString("pool_capacity"), pDto.getAsString("peak_limit"), 
          pDto.getAsString("saprouter"));
        addSystem(system);
      }
    } catch (Exception e) {
      System.out.println("====连接SAP错误!!!====");
      e.printStackTrace();
    }
  }

  public void addSystem(SapAppSystem system) {
    Properties properties = new Properties();
    properties.setProperty("jco.client.ashost", system.getHost());
    properties.setProperty("jco.client.sysnr", system.getSystemNumber());
    properties.setProperty("jco.client.client", system.getClient());
    if (system.getSaprouter() != "") properties.setProperty("jco.client.saprouter", system.getSaprouter());
    properties.setProperty("jco.client.lang", system.getLanguage());
    properties.setProperty("jco.client.user", system.getUser());
    properties.setProperty("jco.client.passwd", system.getPassword());
    if (system.getPool_capacity() != "") properties.setProperty("jco.destination.pool_capacity", system.getPool_capacity());
    if (system.getPeak_limit() != "") properties.setProperty("jco.destination.peak_limit", system.getPeak_limit());
    ABAP_AS_properties = properties;

    addDestination(system.getName(), ABAP_AS_properties);
  }
  public void addSystem(SapMsSystem system) {
    Properties properties = new Properties();
    properties.setProperty("jco.client.mshost", system.getMhost());
    properties.setProperty("jco.client.sysnr", system.getSystemNumber());
    properties.setProperty("jco.client.client", system.getClient());
    properties.setProperty("jco.client.group", system.getGroup());
    if (system.getR3name() != "") properties.setProperty("jco.client.r3name", system.getR3name());
    if (system.getSaprouter() != "") properties.setProperty("jco.client.saprouter", system.getSaprouter());
    properties.setProperty("jco.client.lang", system.getLanguage());
    properties.setProperty("jco.client.user", system.getUser());
    properties.setProperty("jco.client.passwd", system.getPassword());
    if (system.getPool_capacity() != "") properties.setProperty("jco.destination.pool_capacity", system.getPool_capacity());
    if (system.getPeak_limit() != "") properties.setProperty("jco.destination.peak_limit", system.getPeak_limit());

    ABAP_AS_properties = properties;
    addDestination(system.getName(), ABAP_AS_properties);
  }

  public Properties getDestinationProperties(String destinationName) {
    if (destinations.containsKey(destinationName)) {
      return (Properties)destinations.get(destinationName);
    }
    throw new RuntimeException("Destination " + destinationName + " is not available");
  }

  public void setDestinationDataEventListener(DestinationDataEventListener eventListener)
  {
  }

  public boolean supportsEvents()
  {
    return false;
  }
}