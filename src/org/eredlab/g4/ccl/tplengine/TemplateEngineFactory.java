package org.eredlab.g4.ccl.tplengine;

import java.util.HashMap;
import java.util.Map;
import org.eredlab.g4.ccl.tplengine.velocity.VelocityTemplateEngine;

public class TemplateEngineFactory
{
  private static Map ENGINES = new HashMap();

  static
  {
    if (isExistClass("org.apache.velocity.app.VelocityEngine")) {
      VelocityTemplateEngine ve = new VelocityTemplateEngine();
      ENGINES.put(TemplateType.VELOCITY, ve);
    }
  }

  private static boolean isExistClass(String pClass)
  {
    try
    {
      Class.forName(pClass);
    } catch (ClassNotFoundException e) {
      return false;
    }
    return true;
  }

  public static TemplateEngine getTemplateEngine(TemplateType pType)
  {
    if (pType == null) {
      return null;
    }
    if (!ENGINES.containsKey(pType)) {
      throw new IllegalArgumentException("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n不支持的模板类别:" + pType.getType());
    }
    return (TemplateEngine)ENGINES.get(pType);
  }
}