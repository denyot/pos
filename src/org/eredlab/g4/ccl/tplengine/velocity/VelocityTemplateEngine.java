package org.eredlab.g4.ccl.tplengine.velocity;

import java.io.StringWriter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.tplengine.AbstractTemplateEngine;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.util.G4Utils;

public class VelocityTemplateEngine extends AbstractTemplateEngine
{
  Log log = LogFactory.getLog(VelocityTemplateEngine.class);

  protected StringWriter mergeStringTemplate(DefaultTemplate pTemplate, Dto pDto)
  {
    VelocityEngine ve = VelocityHelper.getVelocityEngine();
    String strTemplate = pTemplate.getTemplateResource();
    if (G4Utils.isEmpty(strTemplate)) {
      throw new IllegalArgumentException("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n字符串模板不能为空");
    }
    StringWriter writer = new StringWriter();
    VelocityContext context = VelocityHelper.convertDto2VelocityContext(pDto);
    try {
      if (this.log.isDebugEnabled())
        this.log.debug("字符串模板为:\n" + strTemplate);
      this.log.debug("eRed模板引擎启动,正在驱动字符串模板合并...");
      ve.evaluate(context, writer, "eRedTemplateEngine.log", strTemplate);
      if (this.log.isDebugEnabled())
        this.log.debug("字符串模板合并成功.合并结果如下:\n" + writer);
    } catch (Exception e) {
      this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n字符串模板合并失败");
      e.printStackTrace();
    }
    return writer;
  }

  protected StringWriter mergeFileTemplate(DefaultTemplate pTemplate, Dto pDto)
  {
    VelocityEngine ve = VelocityHelper.getVelocityEngine();
    String filePath = pTemplate.getTemplateResource();
    if (G4Utils.isEmpty(filePath)) {
      throw new IllegalArgumentException("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n文件模板资源路径不能为空");
    }
    StringWriter writer = new StringWriter();
    Template template = null;
    try {
      if (this.log.isDebugEnabled())
        this.log.debug("eRed模板引擎启动,正在生成文件模板...");
      template = ve.getTemplate(filePath);
      if (this.log.isDebugEnabled())
        this.log.debug("生成文件模板成功");
    } catch (Exception e) {
      this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n生成文件模板失败");
      e.printStackTrace();
    }
    VelocityContext context = VelocityHelper.convertDto2VelocityContext(pDto);
    try {
      if (this.log.isDebugEnabled())
        this.log.debug("eRed模板引擎启动,正在驱动文件模板合并...");
      template.merge(context, writer);
      if (this.log.isDebugEnabled())
        this.log.debug("合并文件模板成功.合并结果如下:\n" + writer);
    } catch (Exception e) {
      if (this.log.isDebugEnabled()) this.log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n文件模板合并失败");
      e.printStackTrace();
    }
    return writer;
  }
}