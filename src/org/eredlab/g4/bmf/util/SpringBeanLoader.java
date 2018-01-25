package org.eredlab.g4.bmf.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class SpringBeanLoader
{
  private static Log log = LogFactory.getLog(SpringBeanLoader.class);
  private static ApplicationContext applicationContext;

  static
  {
    try
    {
      initApplicationContext();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static void initApplicationContext()
    throws Exception
  {
    PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");
    String forceLoad = pHelper.getValue("forceLoad", "0");
    try {
      if (forceLoad.equalsIgnoreCase("0")) {
        log.info("系统正在初始化服务容器...");
      }
      applicationContext = new ClassPathXmlApplicationContext(new String[] { "config\\global.config.xml" });
      if (forceLoad.equalsIgnoreCase("0"))
        log.info("容器初始化成功啦，您的托管Bean已经被实例化。");
    }
    catch (Exception e) {
      log.error("服务容器初始化失败.");
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n初始化服务容器发生错误,请仔细检查您的配置文件喔!\n" + e.getMessage());
      e.printStackTrace();
      System.exit(0);
      throw e;
    }
  }

  public static ApplicationContext getApplicationContext()
  {
    return applicationContext;
  }

  public static Object getSpringBean(String pBeanId)
  {
    Object springBean = null;
    try {
      springBean = applicationContext.getBean(pBeanId);
    } catch (NoSuchBeanDefinitionException e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\nSpring配置文件中没有匹配到ID号为:[" + pBeanId + "]的SpringBean组件,请检查!");
      log.error(e.getMessage());
    }
    return springBean;
  }
}