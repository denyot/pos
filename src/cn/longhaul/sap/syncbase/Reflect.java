package cn.longhaul.sap.syncbase;

import java.lang.reflect.Method;

public class Reflect
{
  public String getBaseFunction(String functionname)
    throws Exception
  {
    Class executeClass = Class.forName("cn.longhaul.sap.syncbase.Reflect");
    Object runnableObject = executeClass.newInstance();
    Method executeMethod = null;
    executeMethod = executeClass.getDeclaredMethod(functionname, new Class[0]);
    return executeMethod.invoke(runnableObject, new Object[0]).toString();
  }
}