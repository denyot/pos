package cn.longhaul.sap.service.impl;

import cn.longhaul.sap.service.SapRfcParamService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class SapRfcParamServiceImpl extends BaseServiceImpl
  implements SapRfcParamService
{
  public Dto saveRfcItem(Dto pDto)
  {
    Dto outDto = new BaseDto();
    String pass = G4Utils.encryptBasedDes(pDto.getAsString("pass"));
    pDto.put("pass", pass);
    Dto checkDto = (BaseDto)this.g4Dao.queryForObject("SapRfcParam.checkRfcByIndex", pDto);
    if (G4Utils.isNotEmpty(checkDto)) {
      outDto.put("success", new Boolean(false));
      outDto.put("msg", "违反唯一约束,数据源ID不能重复.");
      return outDto;
    }
    pDto.put("crea_date", G4Utils.getCurDate());
    this.g4Dao.insert("SapRfcParam.createRfcDomain", pDto);
    outDto.put("success", new Boolean(true));

    return outDto;
  }

  public Dto deleteRfcItem(Dto pDto)
  {
    Dto dto = new BaseDto();
    String[] arrChecked = pDto.getAsString("strChecked").split(",");
    for (int i = 0; i < arrChecked.length; i++) {
      dto.put("pk", arrChecked[i]);
      Dto chechkDto = (BaseDto)this.g4Dao.queryForObject("SapRfcParam.getRfcByKey", dto);
      if (chechkDto.getAsString("editmode").equals("1")) {
        this.g4Dao.delete("SapRfcParam.deleteRfcItem", dto);
      }
    }
    return null;
  }

  public Dto updateRfcItem(Dto pDto)
  {
    Dto outDto = new BaseDto();
    String pass = G4Utils.encryptBasedDes(pDto.getAsString("pass"));
    Dto checkDto = (BaseDto)this.g4Dao.queryForObject("SapRfcParam.checkRfcItem", pDto);
    if (G4Utils.isNotEmpty(checkDto)) {
      outDto.put("success", new Boolean(false));
      outDto.put("msg", "数据没有修改,不需保存.");
      return outDto;
    }
    pDto.put("pass", pass);
    pDto.put("crea_date", G4Utils.getCurDate());
    this.g4Dao.update("SapRfcParam.updateRfcItem", pDto);
    outDto.put("success", new Boolean(true));

    return outDto;
  }
}