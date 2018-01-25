package org.eredlab.g4.bmf.aop;

import java.math.BigDecimal;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.ccl.util.G4Utils;

public class SpringBeanAspect
{
  private static Log log = LogFactory.getLog(SpringBeanAspect.class);

  public synchronized Object doServiceAround(ProceedingJoinPoint pjp)
    throws Throwable
  {
    String activeTime = G4Utils.getCurrentTime();
    String clazzString = pjp.getTarget().getClass().getName();
    String methodName = pjp.getSignature().getName();
    String fullPath = clazzString + "." + methodName;
    int flag = clazzString.indexOf("$");
    if (flag < 0)
      log.info("开始业务处理[" + methodName + "];全路径[" + fullPath + "]");
    long time = System.currentTimeMillis();
    Object retVal = pjp.proceed();
    time = System.currentTimeMillis() - time;
    if (flag < 0)
      log.info("结束业务处理[" + methodName + "];耗时:" + time + "毫秒;全路径[" + fullPath + "]");
    Dto mDto = new BaseDto();
    mDto.put("activetime", activeTime);
    mDto.put("advisetype", "1");
    mDto.put("clazz", clazzString);
    mDto.put("costtime", new BigDecimal(time));
    mDto.put("exception", null);
    mDto.put("methodname", methodName);
    mDto.put("pointcuttype", "1");
    if (flag < 0)
      saveEabeanMonitorDomain(mDto);
    return retVal;
  }

  public synchronized void doServiceThrowing(JoinPoint jp, Throwable ex)
  {
    String activeTime = G4Utils.getCurrentTime();
    String clazzString = jp.getTarget().getClass().getName();
    String methodName = jp.getSignature().getName();
    String fullPath = clazzString + "." + methodName;
    int flag = clazzString.indexOf("$");
    if (flag < 0) {
      log.info("业务处理时发生了异常:[" + fullPath + "]");
      ex.printStackTrace();
    }
    Dto mDto = new BaseDto();
    mDto.put("activetime", activeTime);
    mDto.put("advisetype", "2");
    mDto.put("clazz", clazzString);
    mDto.put("costtime", new BigDecimal(0));
    mDto.put("exception", ex.getMessage());
    mDto.put("methodname", methodName);
    mDto.put("pointcuttype", "1");
    if (flag < 0)
      saveEabeanMonitorDomain(mDto);
  }

  private void saveEabeanMonitorDomain(Dto pDto)
  {
    PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");
    String value = pHelper.getValue("beanMonitor", "1");
    if (value.equals("1")) {
      String monitorid = IDHelper.getMonitorID();
      pDto.put("monitorid", monitorid);
      IDao g4Dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
      g4Dao.insert("Monitor.saveEaBeanMonitorDomain", pDto);
    }
  }
}