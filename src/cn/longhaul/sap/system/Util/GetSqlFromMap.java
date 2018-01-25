package cn.longhaul.sap.system.Util;

import java.io.PrintStream;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class GetSqlFromMap
{
  private static Map<String, Object> map = new HashMap();

  public static void main(String[] args)
  {
    map.put("TG_NO", "11");
    map.put("ORG_NO", Integer.valueOf(3));
    map.put("TG_CAP", "2");
    map.put("INST_ADDR", "中国深圳");
    System.out.println(updateFromMap("test", "|TG_NO|", map));
    System.out.println(deleteFromMap("test", "|TG_NO|TG_CAP|", map));
    System.out.println(insertFromMap("test", "", map));
    System.out.println(selectFromMap("test", "", map));
  }

  public static String createFromMap(ArrayList tablepara, String tableName, String filter, Map<String, Object> map) {
    StringBuffer sb = new StringBuffer("");
    StringBuffer sbAll = new StringBuffer("");
    String crlf = System.getProperty("line.separator");
    for (int j = 0; j < tablepara.size(); j++) {
      HashMap tablemap = (HashMap)tablepara.get(j);

      String para_type = tablemap.get("para_type").toString();
      String para_length = tablemap.get("para_length").toString();
      String decimals = tablemap.get("decimals") == null ? "0" : tablemap.get("decimals").toString();
      String aig_name = tablemap.get("aig_name").toString();
      if (para_type.equals("java.lang.String"))
        sb.append(aig_name + " varchar(" + para_length + ") DEFAULT NULL," + crlf);
      else if (para_type.equals("java.math.BigDecimal"))
        sb.append(aig_name + " decimal(" + para_length + "," + decimals + ") DEFAULT 0," + crlf);
      else {
        sb.append(aig_name + " varchar(" + para_length + ") DEFAULT NULL," + crlf);
      }
    }
    String ddl = "DROP TABLE IF EXISTS " + tableName + ";" + crlf + " " + 
      "create talbe " + tableName + "(" + sb.delete(sb.length() - 3, sb.length() - 1) + ")" + 
      "ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='" + tableName + "'";
    System.out.println(ddl);
    return sb.toString();
  }

  public static String selectFromMap(String tableName, String filter, Map<String, Object> map)
  {
    StringBuffer sb = new StringBuffer("");
    StringBuffer sbAll = new StringBuffer("");
    Set<String> set = map.keySet();
    for (String keyName : set) {
      Object value = map.get(keyName);
      if ((value instanceof String)) {
        if (value.toString().indexOf('\'') != -1) {
          value = value.toString().replace("'", "\\'");
        }
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
        else
          sbAll.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Integer)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
        else
          sbAll.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Double)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
        else
          sbAll.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Long)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
        else
          sbAll.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Float)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
        else
          sbAll.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Date)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
        else
          sbAll.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Short)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
        else
          sbAll.append(keyName + "='" + value + "' and ");
      }
    }
    if (sb.length() > 0) {
      return "select *  from " + tableName + " where " + sb.delete(sb.length() - 4, sb.length() - 1).toString();
    }
    return "select *  from " + tableName + " where " + sbAll.delete(sbAll.length() - 4, sbAll.length() - 1).toString();
  }

  public static String insertFromMap(String tableName, String filter, Map<String, Object> map)
  {
    StringBuffer sb = new StringBuffer("insert into " + 
      tableName + "(");
    StringBuffer sbvalue = new StringBuffer(") values (");
    Set<String> set = map.keySet();
    for (String keyName : set) {
      Object value = map.get(keyName);
      if ((value instanceof String)) {
        if (value.toString().indexOf('\'') != -1) {
          value = value.toString().replaceAll("'", "\\'");
        }

        sb.append(keyName + ",");
        sbvalue.append("'" + value + "',");
      } else if ((value instanceof Integer)) {
        sb.append(keyName + ",");
        sbvalue.append(value + ",");
      } else if ((value instanceof Double)) {
        sb.append(keyName + ",");
        sbvalue.append(value + ",");
      } else if ((value instanceof Long)) {
        sb.append(keyName + ",");
        sbvalue.append(value + ",");
      } else if ((value instanceof Float)) {
        sb.append(keyName + ",");
        sbvalue.append(value + ",");
      } else if ((value instanceof Date)) {
        sb.append(keyName + ",");
        sbvalue.append(value + ",");
      } else if ((value instanceof Short)) {
        sb.append(keyName + ",");
        sbvalue.append(value + ",");
      }
    }
    sb.deleteCharAt(sb.length() - 1);
    sbvalue.deleteCharAt(sbvalue.length() - 1);
    return sb.toString() + sbvalue.toString() + ")";
  }

  private static boolean isInFilter(String filter, String value) {
    if ((filter != null) && (filter.indexOf("|" + value + "|") != -1))
      return true;
    return false;
  }

  public static String updateFromMap(String tableName, String filter, Map<String, Object> map) {
    StringBuffer sb = new StringBuffer("update " + tableName + 
      " set ");
    StringBuffer sbvalue = new StringBuffer("");
    Set<String> set = map.keySet();
    for (String keyName : set) {
      Object value = map.get(keyName);
      if ((value instanceof String))
      {
        if (value.toString().indexOf('\'') != -1) {
          value = value.toString().replace("'", "\\'");
        }

        if (isInFilter(filter, keyName))
          sbvalue.append(keyName + "='" + value + "' and ");
        else
          sb.append(keyName + "='" + value + "',");
      } else if ((value instanceof Integer)) {
        if (isInFilter(filter, keyName))
          sbvalue.append(keyName + "='" + value + "' and ");
        else
          sb.append(keyName + "='" + value + "',");
      } else if ((value instanceof Double)) {
        if (isInFilter(filter, keyName))
          sbvalue.append(keyName + "='" + value + "' and ");
        else
          sb.append(keyName + "='" + value + "',");
      } else if ((value instanceof Long)) {
        if (isInFilter(filter, keyName))
          sbvalue.append(keyName + "='" + value + "' and ");
        else
          sb.append(keyName + "='" + value + "',");
      } else if ((value instanceof Float)) {
        if (isInFilter(filter, keyName))
          sbvalue.append(keyName + "='" + value + "' and ");
        else
          sb.append(keyName + "='" + value + "',");
      } else if ((value instanceof Date)) {
        if (isInFilter(filter, keyName))
          sbvalue.append(keyName + "='" + value + "' and ");
        else
          sb.append(keyName + "='" + value + "',");
      } else if ((value instanceof Short)) {
        if (isInFilter(filter, keyName))
          sbvalue.append(keyName + "='" + value + "' and ");
        else
          sb.append(keyName + "='" + value + "',");
      }
    }
    sb.deleteCharAt(sb.length() - 1);
    if (sbvalue.length() > 0) {
      return sb.toString() + " where " + sbvalue.delete(sbvalue.length() - 4, sbvalue.length() - 1).toString();
    }
    return sb.toString() + sbvalue;
  }

  public static String deleteFromMap(String tableName, String filter, Map<String, Object> map)
  {
    StringBuffer sb = new StringBuffer("");
    Set<String> set = map.keySet();
    for (String keyName : set) {
      Object value = map.get(keyName);
      if ((value instanceof String))
      {
        if (value.toString().indexOf('\'') != -1) {
          value = value.toString().replaceAll("'", "'");
        }

        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Integer)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Double)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Long)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Float)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
      } else if ((value instanceof Date)) {
        if (isInFilter(filter, keyName))
          sb.append(keyName + "='" + value + "' and ");
      } else if (((value instanceof Short)) && 
        (isInFilter(filter, keyName))) {
        sb.append(keyName + "='" + value + "' and ");
      }
    }
    if (sb.length() > 0) {
      return "delete from " + tableName + " where " + sb.delete(sb.length() - 4, sb.length() - 1).toString();
    }
    return "delete from " + tableName;
  }
}