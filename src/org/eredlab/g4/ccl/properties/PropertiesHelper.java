package org.eredlab.g4.ccl.properties;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class PropertiesHelper
{
  private static Log log = LogFactory.getLog(PropertiesHelper.class);
  private static String filePath;
  private Properties objProperties;

  public PropertiesHelper(InputStream is)
    throws Exception
  {
    try
    {
      this.objProperties = new Properties();
      this.objProperties.load(is);
    }
    catch (FileNotFoundException e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n未找到属性资源文件!");
      e.printStackTrace();
      throw e;
    }
    catch (Exception e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n读取属性资源文件发生未知错误!");
      e.printStackTrace();
      throw e;
    } finally {
      is.close();
    }
  }

  public void storefile(String pFileName)
  {
    FileOutputStream outStream = null;
    try {
      File file = new File(pFileName + ".properties");
      outStream = new FileOutputStream(file);
      this.objProperties.store(outStream, "#eRedG4");
    } catch (Exception e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n保存属性文件出错.");
      e.printStackTrace();
      try
      {
        outStream.close();
      } catch (IOException e1) {
        e1.printStackTrace();
      }
    }
    finally
    {
      try
      {
        outStream.close();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  public String getValue(String key)
  {
    return this.objProperties.getProperty(key);
  }

  public String getValue(String key, String defaultValue)
  {
    return this.objProperties.getProperty(key, defaultValue);
  }

  public void removeProperty(String key)
  {
    this.objProperties.remove(key);
  }

  public void setProperty(String key, String value)
  {
    this.objProperties.setProperty(key, value);
  }

  public void printAllVlue()
  {
    this.objProperties.list(System.out);
  }
}