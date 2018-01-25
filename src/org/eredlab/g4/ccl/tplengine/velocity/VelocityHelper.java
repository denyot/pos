package org.eredlab.g4.ccl.tplengine.velocity;

import java.io.InputStream;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;

public class VelocityHelper
{
  private static Log log = LogFactory.getLog(VelocityHelper.class);

  public static VelocityEngine getVelocityEngine()
    throws InitVelocityEngineException
  {
    VelocityEngine ve = new VelocityEngine();
    try {
      ve.init(getDefaultProperties());
    } catch (Exception e) {
      throw new InitVelocityEngineException(e.getMessage());
    }
    return ve;
  }

  public static Properties getDefaultProperties()
  {
    InputStream is = VelocityHelper.class.getResourceAsStream("velocity.properties");
    Properties props = new Properties();
    try {
      props.load(is);
      is.close();
    } catch (Exception e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n导入Velocity模板引擎属性配置文件出错");
      log.error(e.getMessage());
    }
    return props;
  }

  public static VelocityContext convertDto2VelocityContext(Dto pDto)
  {
    if (G4Utils.isEmpty(pDto))
      return null;
    Iterator it = pDto.keySet().iterator();
    VelocityContext context = new VelocityContext();
    while (it.hasNext()) {
      String key = (String)it.next();
      Object value = pDto.get(key);
      context.put(key, value);
    }
    return context;
  }
}