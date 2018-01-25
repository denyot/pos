package cn.longhaul.pos.common;

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;

public class Common extends BaseAction
{
  private static List<Map<String, String>> allValues = new ArrayList();
  private static List<Map<String, String>> allKeys = new ArrayList();

  public static Map<String, Map<String, String>> allNewString = new HashMap();

  static String[] allSqlStr = { "getToneType", "getGoldType", "getToneNeatNess", "getToneColor", "getWerks", "getReason", "getPostType", "getGoodType", "getTechnics", "getToneFireColor", "getCertificate" };

  public Common() {
    init();
  }

  public void init()
  {
    for (int i = 0; i < allSqlStr.length; i++) {
      Map values = new HashMap();
      Map keys = new HashMap();
      List dtoList = this.g4Dao.queryForList("commonsqlmap." + allSqlStr[i]);
      for (int j = 0; j < dtoList.size(); j++) {
        Dto value = (Dto)dtoList.get(j);
        values.put(value.getAsString("value"), value.getAsString("valuestr"));
        keys.put(value.getAsString("valuestr"), value.getAsString("value"));
      }
      allValues.add(values);
      allKeys.add(keys);
    }

    List dtoNewStringList = this.g4Dao.queryForList("commonsqlmap.getNewString");

    for (int i = 0; i < dtoNewStringList.size(); i++) {
      Dto item = (Dto)dtoNewStringList.get(i);

      if (allNewString.containsKey(item.getAsString("werks").trim())) {
        ((Map)allNewString.get(item.getAsString("werks").trim())).put(item.getAsString("wlms").trim(), item.getAsString("tsms").trim());
      } else {
        Map map = new HashMap();
        map.put(item.getAsString("wlms").trim(), item.getAsString("tsms").trim());
        allNewString.put(item.getAsString("werks").trim(), map);
      }
    }
  }

  public static String getToneType(String toneType)
  {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(0)).get(toneType);
    return str;
  }

  public static String getToneTypeKey(String toneType) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(0)).get(toneType);
    return str;
  }

  public static String getToneNeatNess(String toneNeatNess)
  {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(2)).get(toneNeatNess);
    return str;
  }
  public static String getToneNeatNessKey(String toneNeatNess) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(2)).get(toneNeatNess);
    return str;
  }

  public static String getToneColor(String toneColor)
  {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(3)).get(toneColor);
    return str;
  }
  public static String getToneColorKey(String toneColor) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(3)).get(toneColor);
    return str;
  }

  public static String getWerks(String asString)
  {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(4)).get(asString);
    return str;
  }
  public static String getWerksKey(String asString) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(4)).get(asString);
    return str;
  }

  public static String getGoodType(String goodType) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(7)).get(goodType);
    return str;
  }
  public static String getGoodTypeKey(String goodType) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(7)).get(goodType);
    return str;
  }

  public static String getPostType(String postType)
  {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(6)).get(postType);
    return str;
  }
  public static String getPostTypeKey(String postType) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(6)).get(postType);
    return str;
  }

  public static String getGoldType(String goldType) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(1)).get(goldType != null ? goldType.toUpperCase() : goldType);
    return str;
  }
  public static String getGoldTypeKey(String goldType) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(1)).get(goldType != null ? goldType.toUpperCase() : goldType);
    return str;
  }

  public static String getTechnics(String technics) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(8)).get(technics);
    return str;
  }
  public static String getTechnicsKey(String technics) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(8)).get(technics);
    return str;
  }

  public static String getToneFireColor(String toneFireColor) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(9)).get(toneFireColor);
    return str;
  }
  public static String getToneFireColorKey(String toneFireColor) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(9)).get(toneFireColor);
    return str;
  }

  public static String getCertificate(String certificate) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allValues.get(10)).get(certificate);
    return str;
  }
  public static String getCertificateKey(String certificate) {
    if (allValues.size() == 0) {
      Common localCommon = new Common();
    }
    String str = (String)((Map)allKeys.get(10)).get(certificate);
    return str;
  }

  public static void main(String[] args) {
    Common common = new Common();
    System.out.println(getToneType("DI"));

    System.out.println(getNewString("NB01", "女戒"));
  }

  public static String getNewString(String werks, String word)
  {
    try
    {
      if (G4Utils.isEmpty(allNewString)) {
        Common localCommon = new Common();
      }
      String newString = new String(word);

      Map value = (Map)allNewString.get(werks);

      if (G4Utils.isEmpty(value)) {
        return word;
      }
      Set keys = value.keySet();
      Iterator it = keys.iterator();
      while (it.hasNext()) {
        String key = (String)it.next();

        if (word.indexOf(key) != -1) {
          newString = newString.replaceAll(key, (String)value.get(key));
        }
      }
      return newString;
    } catch (Exception e) {
      e.printStackTrace();
    }return word;
  }
}