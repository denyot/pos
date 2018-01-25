package cn.longhaul.sap.system.rfcsyntest;

import java.io.PrintStream;
import java.lang.reflect.Field;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

public class SQLCreater
{
  public static final String DEFAULT_STRING = null;
  public static final short DEFAULT_SHORT = -32768;
  public static final int DEFAULT_INT = -2147483648;
  public static final long DEFAULT_LONG = -9223372036854775808L;
  public static final float DEFAULT_FLOAT = 1.4E-45F;
  public static final double DEFAULT_DOUBLE = 4.9E-324D;
  public static final Date DEFAULT_DATE = null;

  public static void main(String[] args) throws Exception
  {
    Map map = new HashMap();
    map.put("TG.TG_NO", "11");

    map.put("TG.ORG_NO", Integer.valueOf(3));

    map.put("TG.TG_CAP", "2");

    map.put("TG.INST_ADDR", "大钟寺1号");
    System.out.println(createSQLDelete(map, "|MAXIMUM_CAPACITY|"));
  }

  public static String createSQLInsert(Object value) throws IllegalArgumentException, IllegalAccessException
  {
    return createSQLInsert(value, null);
  }

  public static String createSQLDelete(Object value) throws IllegalArgumentException, IllegalAccessException
  {
    return createSQLDelete(value, null);
  }

  public static String createSQLUpdate(Object value, String condition) throws IllegalArgumentException, IllegalAccessException
  {
    return createSQLUpdate(value, null, condition);
  }

  public static String createSQLSelect(Object value) throws IllegalArgumentException, IllegalAccessException
  {
    return createSQLSelect(value, null);
  }

  public static String createSQLInsert(Object value, String filter)
    throws IllegalArgumentException, IllegalAccessException
  {
    if (value == null) {
      return "Error: Object is null";
    }

    Class clazz = value.getClass();
    Field[] fields = clazz.getDeclaredFields();
    StringBuffer sb = new StringBuffer("insert into " + 
      clazz.getSimpleName() + "(");
    StringBuffer sbvalue = new StringBuffer(") values (");
    for (int i = 0; i < fields.length; i++) {
      System.out.println(fields[i].getName());
      if (!isInFilter(filter, fields[i].getName()))
      {
        boolean isChangeAccessible = !fields[i].isAccessible();
        fields[i].setAccessible(true);

        if ((fields[i].getType().equals(String.class)) && 
          (fields[i].get(value) != DEFAULT_STRING)) {
          sb.append(fields[i].getName() + ",");
          sbvalue.append("'" + fields[i].get(value) + "',");
        } else if ((fields[i].getType().equals(Integer.TYPE)) && 
          (fields[i].getInt(value) != -2147483648)) {
          sb.append(fields[i].getName() + ",");
          sbvalue.append(fields[i].getInt(value) + ",");
        } else if ((fields[i].getType().equals(Double.TYPE)) && 
          (fields[i].getDouble(value) != 4.9E-324D)) {
          sb.append(fields[i].getName() + ",");
          sbvalue.append(fields[i].getDouble(value) + ",");
        } else if ((fields[i].getType().equals(Long.TYPE)) && 
          (fields[i].getLong(value) != -9223372036854775808L)) {
          sb.append(fields[i].getName() + ",");
          sbvalue.append(fields[i].getLong(value) + ",");
        } else if ((fields[i].getType().equals(Float.TYPE)) && 
          (fields[i].getFloat(value) != 1.4E-45F)) {
          sb.append(fields[i].getName() + ",");
          sbvalue.append(fields[i].getFloat(value) + ",");
        } else if ((fields[i].getType().equals(Date.class)) && 
          (fields[i].get(value) != DEFAULT_DATE)) {
          sb.append(fields[i].getName() + ",");
          sbvalue.append("'" + fields[i].get(value) + "',");
        } else if ((fields[i].getType().equals(Short.TYPE)) && 
          (fields[i].getShort(value) != -32768)) {
          sb.append(fields[i].getName() + ",");
          sbvalue.append(fields[i].getShort(value) + ",");
        }
        if (isChangeAccessible)
          fields[i].setAccessible(false); 
      }
    }
    sb.deleteCharAt(sb.length() - 1);
    sbvalue.deleteCharAt(sbvalue.length() - 1);
    return sb.toString() + sbvalue.toString() + ")";
  }

  public static String createSQLDelete(Object value, String filter)
    throws IllegalArgumentException, IllegalAccessException
  {
    if (value == null) {
      return "Error: Object is null";
    }

    Class clazz = value.getClass();
    Field[] fields = clazz.getDeclaredFields();
    StringBuffer sb = new StringBuffer("delete from " + 
      clazz.getSimpleName() + " where 1=0 or ");

    for (int i = 0; i < fields.length; i++) {
      if (!isInFilter(filter, fields[i].getName()))
      {
        boolean isChangeAccessible = !fields[i].isAccessible();
        fields[i].setAccessible(true);

        if ((fields[i].getType().equals(String.class)) && 
          (fields[i].get(value) != DEFAULT_STRING))
          sb.append(fields[i].getName() + "='" + fields[i].get(value) + 
            "' and ");
        else if ((fields[i].getType().equals(Integer.TYPE)) && 
          (fields[i].getInt(value) != -2147483648))
          sb.append(fields[i].getName() + "=" + fields[i].getInt(value) + 
            " and ");
        else if ((fields[i].getType().equals(Double.TYPE)) && 
          (fields[i].getDouble(value) != 4.9E-324D))
          sb.append(fields[i].getName() + "=" + 
            fields[i].getDouble(value) + " and ");
        else if ((fields[i].getType().equals(Long.TYPE)) && 
          (fields[i].getLong(value) != -9223372036854775808L))
          sb.append(fields[i].getName() + "=" + fields[i].getLong(value) + 
            " and ");
        else if ((fields[i].getType().equals(Float.TYPE)) && 
          (fields[i].getFloat(value) != 1.4E-45F))
          sb.append(fields[i].getName() + "=" + fields[i].getFloat(value) + 
            " and ");
        else if ((fields[i].getType().equals(Date.class)) && 
          (fields[i].get(value) != DEFAULT_DATE))
          sb.append(fields[i].getName() + "='" + fields[i].get(value) + 
            "' and ");
        else if ((fields[i].getType().equals(Short.TYPE)) && 
          (fields[i].getShort(value) != -32768)) {
          sb.append(fields[i].getName() + "=" + fields[i].getShort(value) + 
            " and ");
        }
        if (isChangeAccessible)
          fields[i].setAccessible(false);
      }
    }
    return sb.delete(sb.length() - 4, sb.length() - 1).toString();
  }

  public static String createSQLUpdate(Object value, String filter, String condition)
    throws IllegalArgumentException, IllegalAccessException
  {
    if (value == null) {
      return "Error: Object is null";
    }

    Class clazz = value.getClass();
    Field[] fields = clazz.getDeclaredFields();
    StringBuffer sb = new StringBuffer("update " + clazz.getSimpleName() + 
      " set ");
    StringBuffer sbvalue = new StringBuffer(" where 1=0 or ");
    for (int i = 0; i < fields.length; i++)
      if (!isInFilter(filter, fields[i].getName()))
      {
        boolean isChangeAccessible = !fields[i].isAccessible();
        fields[i].setAccessible(true);

        if ((fields[i].getType().equals(String.class)) && 
          (fields[i].get(value) != DEFAULT_STRING)) {
          if (isInFilter(condition, fields[i].getName()))
            sbvalue.append(fields[i].getName() + "='" + 
              fields[i].get(value) + "' and ");
          else
            sb.append(fields[i].getName() + "='" + fields[i].get(value) + 
              "',");
        } else if ((fields[i].getType().equals(Integer.TYPE)) && 
          (fields[i].getInt(value) != -2147483648)) {
          if (isInFilter(condition, fields[i].getName()))
            sbvalue.append(fields[i].getName() + "=" + 
              fields[i].getInt(value) + " and ");
          else
            sb.append(fields[i].getName() + "=" + 
              fields[i].getInt(value) + ",");
        } else if ((fields[i].getType().equals(Double.TYPE)) && 
          (fields[i].getDouble(value) != 4.9E-324D)) {
          if (isInFilter(condition, fields[i].getName()))
            sbvalue.append(fields[i].getName() + "=" + 
              fields[i].getDouble(value) + " and ");
          else
            sb.append(fields[i].getName() + "=" + 
              fields[i].getDouble(value) + ",");
        } else if ((fields[i].getType().equals(Long.TYPE)) && 
          (fields[i].getLong(value) != -9223372036854775808L)) {
          if (isInFilter(condition, fields[i].getName()))
            sbvalue.append(fields[i].getName() + "=" + 
              fields[i].getLong(value) + " and ");
          else
            sb.append(fields[i].getName() + "=" + 
              fields[i].getLong(value) + ",");
        } else if ((fields[i].getType().equals(Float.TYPE)) && 
          (fields[i].getFloat(value) != 1.4E-45F)) {
          if (isInFilter(condition, fields[i].getName()))
            sbvalue.append(fields[i].getName() + "=" + 
              fields[i].getFloat(value) + " and ");
          else
            sb.append(fields[i].getName() + "=" + 
              fields[i].getFloat(value) + ",");
        } else if ((fields[i].getType().equals(Date.class)) && 
          (fields[i].get(value) != DEFAULT_DATE)) {
          if (isInFilter(condition, fields[i].getName()))
            sbvalue.append(fields[i].getName() + "='" + 
              fields[i].get(value) + "' and ");
          else
            sb.append(fields[i].getName() + "=" + fields[i].get(value) + 
              ",");
        } else if ((fields[i].getType().equals(Short.TYPE)) && 
          (fields[i].getShort(value) != -32768)) {
          if (isInFilter(condition, fields[i].getName()))
            sbvalue.append(fields[i].getName() + "=" + 
              fields[i].getShort(value) + " and ");
          else
            sb.append(fields[i].getName() + "=" + 
              fields[i].getShort(value) + ",");
        }
        if (isChangeAccessible)
          fields[i].setAccessible(false);
      }
    sb.deleteCharAt(sb.length() - 1);
    return sb.toString() + sbvalue.delete(sbvalue.length() - 4, sbvalue.length() - 1).toString();
  }

  public static String createSQLSelect(Object value, String filter)
    throws IllegalArgumentException, IllegalAccessException
  {
    if (value == null) {
      return "Error: Object is null";
    }

    Class clazz = value.getClass();
    Field[] fields = clazz.getDeclaredFields();
    StringBuffer sb = new StringBuffer("select * from " + 
      clazz.getSimpleName() + " where 1=1");

    for (int i = 0; i < fields.length; i++) {
      if (!isInFilter(filter, fields[i].getName()))
      {
        boolean isChangeAccessible = !fields[i].isAccessible();
        fields[i].setAccessible(true);

        if ((fields[i].getType().equals(String.class)) && 
          (fields[i].get(value) != DEFAULT_STRING))
          sb.append(" and " + fields[i].getName() + "='" + 
            fields[i].get(value) + "'");
        else if ((fields[i].getType().equals(Integer.TYPE)) && 
          (fields[i].getInt(value) != -2147483648))
          sb.append(" and " + fields[i].getName() + "=" + 
            fields[i].getInt(value));
        else if ((fields[i].getType().equals(Double.TYPE)) && 
          (fields[i].getDouble(value) != 4.9E-324D))
          sb.append(" and " + fields[i].getName() + "=" + 
            fields[i].getDouble(value));
        else if ((fields[i].getType().equals(Long.TYPE)) && 
          (fields[i].getLong(value) != -9223372036854775808L))
          sb.append(" and " + fields[i].getName() + "=" + 
            fields[i].getLong(value));
        else if ((fields[i].getType().equals(Float.TYPE)) && 
          (fields[i].getFloat(value) != 1.4E-45F))
          sb.append(" and " + fields[i].getName() + "=" + 
            fields[i].getFloat(value));
        else if ((fields[i].getType().equals(Date.class)) && 
          (fields[i].get(value) != DEFAULT_DATE))
          sb.append(" and " + fields[i].getName() + "='" + 
            fields[i].get(value) + "'");
        else if ((fields[i].getType().equals(Short.TYPE)) && 
          (fields[i].getShort(value) != -32768)) {
          sb.append(" and " + fields[i].getName() + "=" + 
            fields[i].getShort(value));
        }
        if (isChangeAccessible)
          fields[i].setAccessible(false);
      }
    }
    return sb.toString();
  }

  private static boolean isInFilter(String filter, String value)
  {
    if ((filter != null) && (filter.indexOf("|" + value + "|") != -1))
      return true;
    return false;
  }
}