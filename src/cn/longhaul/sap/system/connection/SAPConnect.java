package cn.longhaul.sap.system.connection;

import cn.longhaul.exception.LonghaulException;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class SAPConnect
{
  public static Dto getSAPConnect(String id)
    throws LonghaulException
  {
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Dto pDto = new BaseDto("pk", id);
    pDto.put("rownum", new Integer(1));
    pDto.put("enabled", "1");
    String sql = "SapSystem.getSapConnectInfoMysql";
    Dto outDto = (BaseDto)reader.queryForObject(sql, pDto);
    if (G4Utils.isEmpty(outDto.getAsString("host"))) outDto.put("host", "");
    if (G4Utils.isEmpty(outDto.getAsString("client"))) outDto.put("client", "");
    if (G4Utils.isNotEmpty(outDto.getAsString("pass")))
      outDto.put("pass", G4Utils.decryptBasedDes(outDto.getAsString("pass")));
    else outDto.put("pass", "");
    if (G4Utils.isEmpty(outDto.getAsString("mhost"))) outDto.put("mhost", "");
    if (G4Utils.isEmpty(outDto.getAsString("group"))) outDto.put("group", "");
    if (G4Utils.isEmpty(outDto.getAsString("sysid"))) outDto.put("sysid", "");
    if (G4Utils.isEmpty(outDto.getAsString("lang"))) outDto.put("lang", "ZH");
    if (G4Utils.isEmpty(outDto.getAsString("pool_capacity"))) outDto.put("pool_capacity", "3");
    if (G4Utils.isEmpty(outDto.getAsString("peak_limit"))) outDto.put("peak_limit", "10");
    if (G4Utils.isEmpty(outDto.getAsString("saprouter"))) outDto.put("saprouter", "");
    return outDto;
  }
}