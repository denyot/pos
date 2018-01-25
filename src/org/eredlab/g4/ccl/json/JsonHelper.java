package org.eredlab.g4.ccl.json;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class JsonHelper
{
  private static Log log = LogFactory.getLog(JsonHelper.class);

  public static final String encodeObject2Json(Object pObject)
  {
    String jsonString = "[]";
    if (!G4Utils.isEmpty(pObject))
    {
      if ((pObject instanceof ArrayList)) {
        JSONArray jsonArray = JSONArray.fromObject(pObject);
        jsonString = jsonArray.toString();
      } else {
        JSONObject jsonObject = JSONObject.fromObject(pObject);
        jsonString = jsonObject.toString();
      }
    }
    if (log.isInfoEnabled()) {
      log.info("序列化后的JSON资料输出:\n" + jsonString);
    }
    return jsonString;
  }

  public static final String encodeObject2Json(Object pObject, String pFormatString)
  {
    String jsonString = "[]";
    if (!G4Utils.isEmpty(pObject))
    {
      JsonConfig cfg = new JsonConfig();
      cfg.registerJsonValueProcessor(Timestamp.class, new JsonValueProcessorImpl(pFormatString));
      cfg.registerJsonValueProcessor(java.util.Date.class, new JsonValueProcessorImpl(pFormatString));
      cfg.registerJsonValueProcessor(java.sql.Date.class, new JsonValueProcessorImpl(pFormatString));
      if ((pObject instanceof ArrayList)) {
        JSONArray jsonArray = JSONArray.fromObject(pObject, cfg);
        jsonString = jsonArray.toString();
      } else {
        JSONObject jsonObject = JSONObject.fromObject(pObject, cfg);
        jsonString = jsonObject.toString();
      }
    }
    if (log.isInfoEnabled()) {
      log.info("序列化后的JSON资料输出:\n" + jsonString);
    }
    return jsonString;
  }

  private static String encodeJson2PageJson(String jsonString, Integer totalCount)
  {
    jsonString = "{TOTALCOUNT:" + totalCount + ", ROOT:" + jsonString + "}";
    if (log.isInfoEnabled()) {
      log.info("合并后的JSON资料输出:\n" + jsonString);
    }
    return jsonString;
  }

  public static final String encodeList2PageJson(List list, Integer totalCount, String dataFormat)
  {
    String subJsonString = "";
    if (G4Utils.isEmpty(dataFormat))
      subJsonString = encodeObject2Json(list);
    else {
      subJsonString = encodeObject2Json(list, dataFormat);
    }
    String jsonString = "{TOTALCOUNT:" + totalCount + ", ROOT:" + subJsonString + "}";
    return jsonString;
  }

  public static String encodeDto2FormLoadJson(Dto pDto, String pFormatString)
  {
    String jsonString = "";
    String sunJsonString = "";
    if (G4Utils.isEmpty(pFormatString))
      sunJsonString = encodeObject2Json(pDto);
    else {
      sunJsonString = encodeObject2Json(pDto, pFormatString);
    }
    jsonString = "{success:" + (
      G4Utils.isEmpty(pDto.getAsString("success")) ? "true" : pDto.getAsString("success")) + ",data:" + 
      sunJsonString + "}";
    if (log.isInfoEnabled()) {
      log.info("序列化后的JSON资料输出:\n" + jsonString);
    }
    return jsonString;
  }

  public static Dto parseSingleJson2Dto(String jsonString)
  {
    Dto dto = new BaseDto();
    if (G4Utils.isEmpty(jsonString)) {
      return dto;
    }
    JSONObject jb = JSONObject.fromObject(jsonString);
    dto = (BaseDto)JSONObject.toBean(jb, BaseDto.class);
    return dto;
  }

  public static List parseJson2List(String jsonString)
  {
    List list = new ArrayList();
    JSONObject jbJsonObject = JSONObject.fromObject(jsonString);
    Iterator iterator = jbJsonObject.keySet().iterator();
    while (iterator.hasNext()) {
      Dto dto = parseSingleJson2Dto(jbJsonObject.getString(iterator.next().toString()));
      list.add(dto);
    }
    return list;
  }
}