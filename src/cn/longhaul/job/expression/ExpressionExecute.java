package cn.longhaul.job.expression;

import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import org.eredlab.g4.ccl.util.G4Utils;

public class ExpressionExecute
{
  public static Object execute(String expression)
  {
    Class clazz = ExpressionUtil.class;
    Method[] methods = clazz.getMethods();
    String methodName = expression.substring(0, expression.indexOf('('));
    String methodPara = expression.substring(expression.indexOf('(') + 1, expression.lastIndexOf(')'));
    System.out.println(methodName);
    System.out.println(methodPara);
    String[] param = (String[])null;
    if ((!G4Utils.isEmpty(methodPara.trim())) && 
      (methodPara.indexOf(',') != -1)) {
      param = methodPara.split(",");
    }

    Object ret = null;
    for (int i = 0; i < methods.length; i++) {
      if (methodName.equals(methods[i].getName())) {
        Class[] paraTypes = methods[i].getParameterTypes();
        if ((paraTypes.length == 0) || (paraTypes.length == param.length)) {
          try {
            ret = methods[i].invoke(clazz.newInstance(), param);
          } catch (IllegalArgumentException e) {
            e.printStackTrace();
          } catch (IllegalAccessException e) {
            e.printStackTrace();
          } catch (InvocationTargetException e) {
            e.printStackTrace();
          } catch (InstantiationException e) {
            e.printStackTrace();
          }
        }
      }
    }

    return ret;
  }

  public static Object execute(String expression, Object param) {
    Class clazz = ExpressionUtil.class;
    Method[] methods = clazz.getMethods();
    String methodName = expression.substring(0, expression.indexOf('('));
    String methodPara = expression.substring(expression.indexOf('(') + 1, expression.lastIndexOf(')'));
    System.out.println(methodName);
    System.out.println(methodPara);
    Object ret = null;
    for (int i = 0; i < methods.length; i++) {
      if (methodName.equals(methods[i].getName())) {
        try {
          ret = methods[i].invoke(clazz.newInstance(), new Object[] { param });
        } catch (IllegalArgumentException e) {
          e.printStackTrace();
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        } catch (InvocationTargetException e) {
          e.printStackTrace();
        } catch (InstantiationException e) {
          e.printStackTrace();
        }
      }
    }

    return ret;
  }
}