package org.eredlab.g4.arm.service.impl;

import org.eredlab.g4.arm.service.ResourceService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.arm.util.idgenerator.IdGenerator;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class ResourceServiceImpl extends BaseServiceImpl
  implements ResourceService
{
  public Dto saveCodeItem(Dto pDto)
  {
    Dto outDto = new BaseDto();
    String codeid = IDHelper.getCodeID();
    pDto.put("codeid", codeid);
    Dto checkDto = (BaseDto)this.g4Dao.queryForObject("Resource.checkEaCodeByIndex", pDto);
    if (G4Utils.isNotEmpty(checkDto)) {
      outDto.put("success", new Boolean(false));
      outDto.put("msg", "违反唯一约束,[对照字段]和[代码]组合不能重复.");
      return outDto;
    }
    this.g4Dao.insert("Resource.createEacodeDomain", pDto);
    outDto.put("success", new Boolean(true));

    return outDto;
  }

  public Dto deleteCodeItem(Dto pDto)
  {
    Dto dto = new BaseDto();
    String[] arrChecked = pDto.getAsString("strChecked").split(",");
    for (int i = 0; i < arrChecked.length; i++) {
      dto.put("codeid", arrChecked[i]);
      Dto chechkDto = (BaseDto)this.g4Dao.queryForObject("Resource.getEaCodeByKey", dto);
      if (chechkDto.getAsString("editmode").equals("1")) {
        this.g4Dao.delete("Resource.deleteCodeItem", dto);
      }
    }
    return null;
  }

  public Dto updateCodeItem(Dto pDto)
  {
    this.g4Dao.update("Resource.updateCodeItem", pDto);
    return null;
  }

  public synchronized Dto saveMenuItem(Dto pDto)
  {
    String menuid = IdGenerator.getMenuIdGenerator(pDto.getAsString("parentid"));
    pDto.put("menuid", menuid);
    pDto.put("leaf", "1");
    pDto.put("sortno", G4Utils.isEmpty(pDto.getAsString("sortno")) ? Integer.valueOf("0") : pDto
      .getAsString("sortno"));
    this.g4Dao.insert("Resource.saveMenuItem", pDto);
    Dto updateDto = new BaseDto();
    updateDto.put("menuid", pDto.getAsString("parentid"));
    updateDto.put("leaf", "0");
    this.g4Dao.update("Resource.updateLeafFieldInEaMenu", updateDto);
    return null;
  }

  public Dto deleteMenuItems(Dto pDto)
  {
    Dto dto = new BaseDto();
    Dto changeLeafDto = new BaseDto();
    if (pDto.getAsString("type").equals("1")) {
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
        dto.put("menuid", arrChecked[i]);
        changeLeafDto.put("parentid", ((BaseDto)this.g4Dao.queryForObject("Resource.queryMenuItemsByDto", dto))
          .getAsString("parentid"));
        this.g4Dao.delete("Resource.deleteEamenuItem", dto);
        this.g4Dao.delete("Resource.deleteEarwauthorizeItem", dto);
        this.g4Dao.delete("Resource.deleteEausermenumapByMenuid", dto);
        updateLeafOfDeletedParent(changeLeafDto);
      }
    } else {
      dto.put("menuid", pDto.getAsString("menuid"));
      changeLeafDto.put("parentid", ((BaseDto)this.g4Dao.queryForObject("Resource.queryMenuItemsByDto", dto))
        .getAsString("parentid"));
      this.g4Dao.delete("Resource.deleteEamenuItem", dto);
      this.g4Dao.delete("Resource.deleteEarwauthorizeItem", dto);
      this.g4Dao.delete("Resource.deleteEausermenumapByMenuid", dto);
      updateLeafOfDeletedParent(changeLeafDto);
    }
    return null;
  }

  private void updateLeafOfDeletedParent(Dto pDto)
  {
    String parentid = pDto.getAsString("parentid");
    pDto.put("menuid", parentid);
    Integer countInteger = (Integer)this.g4Dao.queryForObject("Resource.prepareChangeLeafOfDeletedParent", pDto);
    if (countInteger.intValue() == 0)
      pDto.put("leaf", "1");
    else {
      pDto.put("leaf", "0");
    }
    this.g4Dao.update("Resource.updateLeafFieldInEaMenu", pDto);
  }

  public Dto updateMenuItem(Dto pDto)
  {
    if (G4Utils.isEmpty(pDto.getAsString("sortno"))) {
      pDto.put("sortno", "0");
    }
    if (pDto.getAsString("parentid").equals(pDto.getAsString("parentid_old"))) {
      pDto.remove("parentid");
      this.g4Dao.update("Resource.updateMenuItem", pDto);
    } else {
      this.g4Dao.delete("Resource.deleteEamenuItem", pDto);
      this.g4Dao.delete("Resource.deleteEarwauthorizeItem", pDto);
      this.g4Dao.delete("Resource.deleteEausermenumapByMenuid", pDto);
      saveMenuItem(pDto);
      pDto.put("parentid", pDto.getAsString("parentid_old"));
      updateLeafOfDeletedParent(pDto);
    }
    return null;
  }
}