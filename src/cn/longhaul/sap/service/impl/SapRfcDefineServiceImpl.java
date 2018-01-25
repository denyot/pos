package cn.longhaul.sap.service.impl;

import cn.longhaul.sap.service.SapRfcDefineService;
import cn.longhaul.sap.service.SapTransferService;
import cn.longhaul.sap.system.info.TransferAigInfo;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import org.eredlab.g4.arm.util.idgenerator.IdGenerator;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;

public class SapRfcDefineServiceImpl extends BaseServiceImpl
  implements SapRfcDefineService
{
  public Dto saveRfcItem(Dto pDto)
  {
    Dto outDto = new BaseDto();

    String rfc_id = IdGenerator.getRfcIdGenerator(pDto.getAsString("parent_id"));
    pDto.put("rfc_id", rfc_id);
    pDto.put("leaf", "1");
    if (G4Utils.isEmpty(pDto.getAsString("rfctable")))
      pDto.put("rfctable", "sap_rfcclass");
    Dto checkDto = (BaseDto)this.g4Dao.queryForObject("SapRfcDefine.checkRfcByIndex", pDto);
    if (G4Utils.isNotEmpty(checkDto)) {
      outDto.put("success", new Boolean(false));
      outDto.put("msg", "违反唯一约束,RFC_ID不能重复.");
      return outDto;
    }
    pDto.put("crea_date", G4Utils.getCurDate());
    this.g4Dao.insert("SapRfcDefine.createRfcDomain", pDto);
    outDto.put("success", new Boolean(true));
    outDto.put("msg", "记录保存成功.");

    return outDto;
  }

  public Dto saveRfcItems(Dto pDto, List items)
  {
    Dto outDto = new BaseDto();
    Dto inDto = new BaseDto();
    Dto inDtoT = new BaseDto();

    String rfctable = pDto.getAsString("rfctable");
    for (int i = 0; i < items.size(); i++) {
      inDto = (BaseDto)items.get(i);
      inDtoT.putAll(inDto);
      Set<String> set = inDtoT.keySet();
      for (String keyName : set) {
        if (inDtoT.getAsString(keyName).equals("null"))
          inDto.remove(keyName);
      }
      inDto.putAll(pDto);
      inDto.put("crea_date", G4Utils.getCurDate());
      this.g4Dao.update("SapRfcDefine.updateRfcItem", inDto);
    }
    outDto.put("success", new Boolean(true));
    outDto.put("msg", "数据更新成功.");
    return outDto;
  }

  public Dto saveRfcItems(Dto pDto, List items, List itemE)
  {
    Dto outDto = new BaseDto();
    Dto inDto = new BaseDto();
    Dto inDtoT = new BaseDto();
    List headListT = new ArrayList();
    List itemListT = new ArrayList();

    String rfctable = pDto.getAsString("rfctable");

    String rfcname = pDto.getAsString("rfcname");

    System.out.println(rfcname);

    if (rfctable.equals("sap_rfctables")) {
      for (int i = 0; i < items.size(); i++) {
        inDto = (BaseDto)items.get(i);

        if (inDto.getAsString("leaf").equals("0"))
        {
          headListT.add(inDto);
        }
        else itemListT.add(inDto);

      }

      for (int i = 0; i < headListT.size(); i++) {
        for (int j = 0; j < items.size(); j++) {
          if (((BaseDto)headListT.get(i)).getAsString("para_id").equals(((BaseDto)items.get(j)).getAsString("parent_id"))) {
            itemListT.remove(items.get(j));
          }
        }
      }
      if (headListT.size() > 0) {
        outDto = syncAigTables(pDto, items, headListT);
        if (!outDto.getAsBoolean("success").booleanValue()) {
          outDto.put("msg", "数据表更新失败.");
          return outDto;
        }
      }
      if (itemListT.size() > 0) {
        outDto = syncAigFileds(pDto, items, itemListT, itemE);
        if (!outDto.getAsBoolean("success").booleanValue())
        {
          return outDto;
        }
      }
    }

    for (int i = 0; i < items.size(); i++) {
      inDto = (BaseDto)items.get(i);
      inDtoT.putAll(inDto);
      Set<String> set = inDtoT.keySet();
      for (String keyName : set) {
        if (inDtoT.getAsString(keyName).equals("null"))
          inDto.remove(keyName);
      }
      inDto.putAll(pDto);
      inDto.put("crea_date", G4Utils.getCurDate());
      this.g4Dao.update("SapRfcDefine.updateRfcItem", inDto);
    }
    outDto.put("success", new Boolean(true));
    outDto.put("msg", "数据更新成功.");
    return outDto;
  }

  public Dto deleteRfcItem(Dto pDto)
  {
    for (Iterator it = pDto.keySet().iterator(); it.hasNext(); ) {
      Object key = it.next();
      Object value = pDto.get(key);

      System.out.println(key);
      System.out.println(value);
    }

    Dto dto = new BaseDto();
    Dto outDto = new BaseDto();
    String[] arrChecked = pDto.getAsString("strChecked").split(",");
    for (int i = 0; i < arrChecked.length; i++) {
      dto.put("rfc_id", arrChecked[i]);
      dto.put("rfctable", "sap_rfcclass");
      Dto checkDto = (BaseDto)this.g4Dao.queryForObject("SapRfcDefine.getRfcByKey", dto);
      if ((G4Utils.isNotEmpty(checkDto)) && (checkDto.getAsString("editmode").equals("1"))) {
        this.g4Dao.delete("SapRfcDefine.deleteRfcItem", dto);
      } else {
        outDto.put("success", new Boolean(false));
        outDto.put("msg", "数据不存在，请检查.");
        return outDto;
      }

      dto.put("rfctable", "sap_rfcimport");
      this.g4Dao.delete("SapRfcDefine.deleteRfcItem", dto);

      dto.put("rfctable", "sap_rfcexport");
      this.g4Dao.delete("SapRfcDefine.deleteRfcItem", dto);

      dto.put("rfctable", "sap_rfcchanging");
      this.g4Dao.delete("SapRfcDefine.deleteRfcItem", dto);

      Dto dtoT = new BaseDto();
      dtoT.put("rfc_id", arrChecked[i]);
      dtoT.put("rfctable", "sap_rfctables");
      dtoT.put("leaf", "0");
      dtoT.put("cachemode", "1");
      List aigCache = this.g4Dao.queryForList("SapRfcDefine.getAigByKey", dtoT);
      for (int j = 0; j < aigCache.size(); j++) {
        dtoT = (BaseDto)aigCache.get(j);

        String aigname = dtoT.getAsString("aig_name");

        System.out.println(aigname);

        dtoT.put("aigtable", aigname);
        i = this.g4Dao.update("SapRfcDefine.dropAigTable", dtoT);
      }

      dto.put("rfctable", "sap_rfctables");
      this.g4Dao.delete("SapRfcDefine.deleteRfcItem", dto);
      dto.put("rfctable", "sap_rfcexceptions");
      this.g4Dao.delete("SapRfcDefine.deleteRfcItem", dto);
    }

    outDto.put("success", new Boolean(true));
    outDto.put("msg", "数据删除成功.");
    return outDto;
  }

  public Dto updateRfcItem(Dto pDto)
  {
    Dto outDto = new BaseDto();
    if (G4Utils.isEmpty(pDto.getAsString("rfctable")))
      pDto.put("rfctable", "sap_rfcclass");
    Dto checkDto = (BaseDto)this.g4Dao.queryForObject("SapRfcDefine.checkRfcItem", pDto);
    if (G4Utils.isNotEmpty(checkDto)) {
      outDto.put("success", new Boolean(false));
      outDto.put("msg", "数据没有修改,不需保存.");
      return outDto;
    }
    pDto.put("crea_date", G4Utils.getCurDate());
    this.g4Dao.update("SapRfcDefine.updateRfcItem", pDto);
    outDto.put("success", new Boolean(true));
    outDto.put("msg", "数据更新成功.");

    return outDto;
  }

  public Dto queryRfcItems(Dto pDto)
  {
    Dto outDto = new BaseDto();
    if (G4Utils.isEmpty(pDto.getAsString("rfctable")))
      pDto.put("rfctable", "sap_rfcclass");
    List rfcList = this.g4Dao.queryForList("SapRfcDefine.queryRfcItemsByDto", pDto);
    Dto rfcDto = new BaseDto();
    for (int i = 0; i < rfcList.size(); i++) {
      rfcDto = (BaseDto)rfcList.get(i);
      if (rfcDto.getAsString("leaf").equals("1"))
        rfcDto.put("leaf", new Boolean(true));
      else
        rfcDto.put("leaf", new Boolean(false));
      if (rfcDto.getAsString("id").length() == 6)
        rfcDto.put("expanded", new Boolean(true));
    }
    outDto.put("jsonString", JsonHelper.encodeObject2Json(rfcList));
    return outDto;
  }

  public Dto syncRfcItems(Dto pDto)
  {
    SapTransferService rfcTransfer = (SapTransferService)SpringBeanLoader.getSpringBean("sapTransferService");
    Dto outDto = new BaseDto();
    Dto inDto = new BaseDto();
    TransferAigInfo rfcInfo = null;

    String rfc_id = pDto.getAsString("rfc_id");
    String saprfcname = pDto.getAsString("saprfcname");
    if ((G4Utils.isNotEmpty(rfc_id)) && (G4Utils.isNotEmpty(saprfcname)))
    {
      rfcInfo = rfcTransfer.getRfcInfo(saprfcname, rfc_id);
    }

    if (rfcInfo == null) {
      outDto.put("success", new Boolean(false));
      outDto.put("msg", "函数" + saprfcname + "没找到,请检查!");
      return outDto;
    }
    inDto.put("rfc_id", rfc_id);
    inDto.put("rfctable", "sap_rfcimport");
    this.g4Dao.delete("SapRfcDefine.deleteRfcItem", inDto);

    inDto.put("rfctable", "sap_rfcexport");
    this.g4Dao.delete("SapRfcDefine.deleteRfcItem", inDto);

    inDto.put("rfctable", "sap_rfcchanging");
    this.g4Dao.delete("SapRfcDefine.deleteRfcItem", inDto);

    Dto dtoT = new BaseDto();
    dtoT.put("rfc_id", rfc_id);
    dtoT.put("rfctable", "sap_rfctables");
    dtoT.put("leaf", "0");
    dtoT.put("cachemode", "1");
    List aigCache = this.g4Dao.queryForList("SapRfcDefine.getAigByKey", dtoT);
    for (int j = 0; j < aigCache.size(); j++) {
      dtoT = (BaseDto)aigCache.get(j);
      dtoT.put("aigtable", "A" + dtoT.getAsString("para_id"));
      int i = this.g4Dao.update("SapRfcDefine.dropAigTable", dtoT);
    }

    inDto.put("rfctable", "sap_rfctables");
    this.g4Dao.delete("SapRfcDefine.deleteRfcItem", inDto);
    inDto.put("rfctable", "sap_rfcexceptions");
    this.g4Dao.delete("SapRfcDefine.deleteRfcItem", inDto);
    ArrayList rfcdata = rfcInfo.getRfcImportParameterList();
    if (G4Utils.isNotEmpty(rfcdata)) {
      for (int i = 0; i < rfcdata.size(); i++) {
        Dto items = new BaseDto();
        items.putAll((HashMap)rfcdata.get(i));
        items.put("rfc_id", rfc_id);
        items.put("rfctable", "sap_rfcimport");

        items.put("aig_name", items.get("para_name"));
        items.put("crea_date", G4Utils.getCurDate());
        this.g4Dao.insert("SapRfcDefine.createRfcDomain", items);
      }
    }

    rfcdata = rfcInfo.getRfcExportParameterList();
    if (G4Utils.isNotEmpty(rfcdata)) {
      for (int i = 0; i < rfcdata.size(); i++) {
        Dto items = new BaseDto();
        items.putAll((HashMap)rfcdata.get(i));
        items.put("rfc_id", rfc_id);
        items.put("rfctable", "sap_rfcexport");

        items.put("crea_date", G4Utils.getCurDate());
        items.put("aig_name", items.get("para_name"));
        this.g4Dao.insert("SapRfcDefine.createRfcDomain", items);
      }
    }

    rfcdata = rfcInfo.getRfcChangingParameterList();
    if (G4Utils.isNotEmpty(rfcdata)) {
      for (int i = 0; i < rfcdata.size(); i++) {
        Dto items = new BaseDto();
        items.putAll((HashMap)rfcdata.get(i));
        items.put("rfc_id", rfc_id);
        items.put("rfctable", "sap_rfcchanging");
        items.put("crea_date", G4Utils.getCurDate());
        items.put("aig_name", items.get("para_name"));
        this.g4Dao.insert("SapRfcDefine.createRfcDomain", items);
      }
    }

    rfcdata = rfcInfo.getRfcTalbeParaMeterList();
    for (int i = 0; i < rfcdata.size(); i++) {
      if (G4Utils.isNotEmpty(rfcdata)) {
        Dto items = new BaseDto();
        items.putAll((HashMap)rfcdata.get(i));
        items.put("rfc_id", rfc_id);

        if (items.get("para_type") == "com.sap.conn.jco.JCoTable") {
          System.out.println(items.get("para_name"));
          items.put("aig_name", saprfcname + '_' + items.get("para_name"));
        } else {
          items.put("aig_name", items.get("para_name"));
        }

        items.put("rfctable", "sap_rfctables");
        items.put("crea_date", G4Utils.getCurDate());
        this.g4Dao.insert("SapRfcDefine.createRfcDomain", items);
      }
    }

    outDto.put("success", new Boolean(true));
    outDto.put("msg", "数据同步成功");
    return outDto;
  }

  public Dto syncAigTables(Dto pDto, List items, List headsT)
  {
    Dto outDto = new BaseDto();
    Dto inDto = new BaseDto();
    outDto.put("success", new Boolean(true));
    for (int i = 0; i < headsT.size(); i++) {
      Dto headDtoT = (BaseDto)headsT.get(i);
      Dto itemsqlDto = new BaseDto();

      String aigtable = headDtoT.getAsString("para_id");

      String saptablename = headDtoT.getAsString("para_name");

      System.out.println(headDtoT.getAsString("para_name"));
      String rfcname = pDto.getAsString("rfcname");
      System.out.println(rfcname);

      itemsqlDto.put("aigtable", rfcname + '_' + saptablename);
      System.out.println(itemsqlDto.getAsString("aigtable"));
      int n = this.g4Dao.update("SapRfcDefine.dropAigTable", itemsqlDto);
      if ((headDtoT.getAsString("cachemode").equals("1")) && (headDtoT.getAsString("enabled").equals("1"))) {
        String aigsql = "";
        String pksql = "";
        for (int j = 0; j < items.size(); j++) {
          Dto paraDto = (BaseDto)items.get(j);
          if (paraDto.getAsString("parent_id").equals(aigtable)) {
            String parasql = "";
            String aig_type = "";
            if (paraDto.getAsString("aig_primarykey").equals("1")) {
              pksql = pksql + paraDto.getAsString("aig_name") + ",";
            }

            parasql = "`" + paraDto.getAsString("aig_name") + "`";
            aig_type = paraDto.getAsString("aig_type");
            if (aig_type.contains("String")) {
              parasql = parasql + " varchar(" + paraDto.getAsString("aig_length") + ")";
            }

            if (aig_type.contains("Date")) {
              parasql = parasql + " char(10)";
            }

            if (aig_type.contains("Integer")) {
              parasql = parasql + " int(" + paraDto.getAsString("aig_length") + ")";
            }

            if (aig_type.contains("Char")) {
              parasql = parasql + " char(" + paraDto.getAsString("aig_length") + ")";
            }

            if (aig_type.contains("BigDecimal")) {
              parasql = parasql + " decimal(" + paraDto.getAsString("aig_length") + ",";
              parasql = parasql + paraDto.getAsString("aig_decimals") + ")";
            }

            if (aig_type.contains("Double")) {
              parasql = parasql + " double(" + paraDto.getAsString("aig_length") + ",";
              parasql = parasql + paraDto.getAsString("aig_decimals") + ")";
            }

            if (aig_type.contains("Byte")) {
              parasql = parasql + " binary(" + paraDto.getAsString("aig_length") + ")";
            }

            if (paraDto.getAsString("para_optional").equals("0"))
              parasql = parasql + " NOT NULL ";
            else
              parasql = parasql + " DEFAULT NULL ";
            parasql = parasql + " COMMENT '" + paraDto.getAsString("aig_desc") + "'";

            aigsql = aigsql + parasql + ",";
          }

        }

        aigsql = aigsql.length() > 0 ? aigsql.substring(0, aigsql.length() - 1) : aigsql;
        if (G4Utils.isNotEmpty(pksql))
        {
          pksql = pksql.substring(0, pksql.length() - 1);
          itemsqlDto.put("pksql", pksql);
        }

        itemsqlDto.put("aigsql", aigsql);
        int k = this.g4Dao.update("SapRfcDefine.createAigTable", itemsqlDto);
        outDto.put("success", new Boolean(true));
      }
      else {
        outDto.put("success", new Boolean(true));
      }
    }
    return outDto;
  }

  public Dto syncAigFileds(Dto pDto, List items, List itemsE, List modifyE)
  {
    Dto outDto = new BaseDto();
    for (int i = 0; i < items.size(); i++) {
      Dto itemDto = (BaseDto)items.get(i);
      Dto itemsqlDto = new BaseDto();
      String aigsql = "";
      String aigtable = itemDto.getAsString("parent_id");
      itemsqlDto.put("aigtable", "A" + aigtable);
      if (itemsE.contains(itemDto)) {
        if (itemDto.getAsString("aig_primarykey").equals("1")) {
          outDto.put("success", new Boolean(false));
          outDto.put("msg", "不能只修改PRIMARYKEY，请重新生成缓存表" + itemDto.getAsString("para_id"));
          return outDto;
        }

        String parasql = "";
        String paraOsql = "";
        String aig_type = "";
        aig_type = itemDto.getAsString("aig_type");
        if (aig_type.contains("String")) {
          parasql = parasql + " varchar(" + itemDto.getAsString("aig_length") + ")";
        }

        if (aig_type.contains("Date")) {
          parasql = parasql + " char(10)";
        }

        if (aig_type.contains("Integer")) {
          parasql = parasql + " int(" + itemDto.getAsString("aig_length") + ")";
        }

        if (aig_type.contains("Char")) {
          parasql = parasql + " char(" + itemDto.getAsString("aig_length") + ")";
        }

        if (aig_type.contains("BigDecimal")) {
          parasql = parasql + " decimal(" + itemDto.getAsString("aig_length") + ",";
          parasql = parasql + itemDto.getAsString("aig_decimals") + ")";
        }

        if (aig_type.contains("Double")) {
          parasql = parasql + " double(" + itemDto.getAsString("aig_length") + ",";
          parasql = parasql + itemDto.getAsString("aig_decimals") + ")";
        }

        if (aig_type.contains("Byte")) {
          parasql = parasql + " binary(" + itemDto.getAsString("aig_length") + ")";
        }

        if (itemDto.getAsString("para_optional").equals("0"))
          parasql = parasql + " NOT NULL ";
        else
          parasql = parasql + " DEFAULT NULL ";
        parasql = parasql + " COMMENT '" + itemDto.getAsString("aig_desc") + "'";
        if (((BaseDto)modifyE.get(i)).containsKey("cachemode")) {
          String cachemode = ((BaseDto)items.get(i)).getAsString("cachemode");
          if (cachemode.equals("1"))
            paraOsql = " ADD COLUMN `" + itemDto.getAsString("aig_name") + "`" + parasql;
          else
            paraOsql = " DROP COLUMN `" + itemDto.getAsString("aig_name") + "`";
        }
        else {
          paraOsql = " MODIFY COLUMN `" + itemDto.getAsString("aig_name") + "` `" + ((BaseDto)modifyE.get(i)).containsKey("aig_name") + "` " + parasql;
        }

        aigsql = aigsql + paraOsql;

        itemsqlDto.put("aigsql", aigsql);
        int k = this.g4Dao.update("SapRfcDefine.alterAigTable", itemsqlDto);
        outDto.put("success", new Boolean(true));
      }
      outDto.put("success", new Boolean(true));
    }
    return outDto;
  }
}