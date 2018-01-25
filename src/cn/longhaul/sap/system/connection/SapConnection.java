package cn.longhaul.sap.system.connection;

import cn.longhaul.exception.ExceptionManage;
import cn.longhaul.exception.LonghaulException;
import cn.longhaul.sap.system.model.SapAppSystem;
import cn.longhaul.sap.system.model.SapMsSystem;
import com.sap.conn.jco.JCoContext;
import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoRepository;
import com.sap.conn.jco.ext.Environment;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class SapConnection
{
  private static Log log = LogFactory.getLog(SapConnection.class);
  private JCoRepository repos;
  private JCoDestination dest;

  public SapConnection()
    throws LonghaulException
  {
    System.getProperty("java.library.path");
    MyDestinationDataProvider myProvider = MyDestinationDataProvider.getInstance();
    if (!Environment.isDestinationDataProviderRegistered())
      Environment.registerDestinationDataProvider(myProvider);
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Dto pDto = new BaseDto("paramkey", "SAP_CONNECT");
    String sql = "Param.queryParamvalueByParamkey";
    String systemName = (String)reader.queryForObject(sql, pDto);
    try {
      myProvider.addSystem(systemName);
      this.dest = JCoDestinationManager.getDestination(systemName);

      log.info("Attributes:");
      log.info(this.dest.getAttributes());
      this.repos = this.dest.getRepository();
    } catch (JCoException e) {
      throw new LonghaulException(ExceptionManage.JCOINT, e);
    } catch (Exception e) {
      log.info("====连接SAP错误!!!====");
      throw new LonghaulException(e);
    }
  }

  public SapConnection(String systemName)
    throws LonghaulException
  {
    MyDestinationDataProvider myProvider = MyDestinationDataProvider.getInstance();
    if (!Environment.isDestinationDataProviderRegistered())
      Environment.registerDestinationDataProvider(myProvider);
    try {
      myProvider.addSystem(systemName);
      this.dest = JCoDestinationManager.getDestination(systemName);

      log.info("Attributes:");
      log.info(this.dest.getAttributes());
      this.repos = this.dest.getRepository();
    } catch (JCoException e) {
      throw new LonghaulException(ExceptionManage.JCOINT, e);
    } catch (Exception e) {
      log.info("====连接SAP错误!!!====");
      throw new LonghaulException(e);
    }
  }

  public SapConnection(SapAppSystem system)
    throws LonghaulException
  {
    MyDestinationDataProvider myProvider = MyDestinationDataProvider.getInstance();
    if (!Environment.isDestinationDataProviderRegistered())
      Environment.registerDestinationDataProvider(myProvider);
    myProvider.addSystem(system);
    try {
      this.dest = JCoDestinationManager.getDestination(system.getName());

      log.info("Attributes:");
      log.info(this.dest.getAttributes());
      this.repos = this.dest.getRepository();
    } catch (JCoException e) {
      throw new LonghaulException(ExceptionManage.JCOINT, e);
    } catch (Exception e) {
      log.info("====连接SAP错误!!!====");
      throw new LonghaulException(e);
    }
  }

  public SapConnection(SapMsSystem system) throws LonghaulException
  {
    MyDestinationDataProvider myProvider = MyDestinationDataProvider.getInstance();
    if (!Environment.isDestinationDataProviderRegistered())
      Environment.registerDestinationDataProvider(myProvider);
    myProvider.addSystem(system);
    try {
      this.dest = JCoDestinationManager.getDestination(system.getName());

      log.info("Attributes:");
      log.info(this.dest.getAttributes());
      this.repos = this.dest.getRepository();
    } catch (JCoException e) {
      throw new LonghaulException(ExceptionManage.JCOINT, e);
    } catch (Exception e) {
      log.info("====连接SAP错误!!!====");
      throw new LonghaulException(e);
    }
  }

  public JCoFunction getFunction(String functionStr)
    throws LonghaulException
  {
    JCoFunction function = null;
    try {
      function = this.repos.getFunction(functionStr);
    } catch (Exception e) {
      log.info("Problem retrieving JCoFunction object.");
      throw new LonghaulException(ExceptionManage.JCOFUNCTION, e);
    }
    if (function == null) {
      log.info("Not possible to receive function.");
      throw new LonghaulException(ExceptionManage.JCOFUNCTION, "不存在此函数:" + functionStr + "请检查!");
    }

    return function;
  }

  public void execute(JCoFunction function)
    throws LonghaulException
  {
    try
    {
      JCoContext.begin(this.dest);
      function.execute(this.dest);
    }
    catch (JCoException e) {
      log.info("Problem execute JCoFunction ");
      throw new LonghaulException(ExceptionManage.JCOEXEFUNCTION, e);
    } finally {
      try {
        JCoContext.end(this.dest);
      } catch (JCoException e) {
        log.info("Problem end of execute JCoFunction ");
        e.printStackTrace();
      }
    }
  }
}