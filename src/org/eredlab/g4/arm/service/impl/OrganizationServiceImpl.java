package org.eredlab.g4.arm.service.impl;

import java.util.List;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.util.idgenerator.IdGenerator;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;

public class OrganizationServiceImpl extends BaseServiceImpl
  implements OrganizationService
{
  public Dto getUserInfo(Dto pDto)
  {
    Dto outDto = new BaseDto();
    pDto.put("lock", "0");
    pDto.put("enabled", "1");
    UserInfoVo userInfo = (UserInfoVo)this.g4Dao.queryForObject("Organization.getUserInfo", pDto);
    outDto.put("userInfo", userInfo);
    return outDto;
  }

  public Dto queryDeptItems(Dto pDto)
  {
    Dto outDto = new BaseDto();
    List deptList = this.g4Dao.queryForList("Organization.queryDeptItemsByDto", pDto);
    Dto deptDto = new BaseDto();
    for (int i = 0; i < deptList.size(); i++) {
      deptDto = (BaseDto)deptList.get(i);
      if (deptDto.getAsString("leaf").equals("1"))
        deptDto.put("leaf", new Boolean(true));
      else
        deptDto.put("leaf", new Boolean(false));
      if (deptDto.getAsString("id").length() == 6)
        deptDto.put("expanded", new Boolean(true));
    }
    outDto.put("jsonString", JsonHelper.encodeObject2Json(deptList));
    return outDto;
  }

  public synchronized Dto saveDeptItem(Dto pDto)
  {
    String deptid = IdGenerator.getDeptIdGenerator(pDto.getAsString("parentid"));
    pDto.put("deptid", deptid);
    pDto.put("leaf", "1");

    pDto.put("sortno", 
      G4Utils.isEmpty(pDto.getAsString("sortno")) ? Integer.valueOf("0") : pDto.getAsString("sortno"));
    pDto.put("enabled", "1");
    this.g4Dao.insert("Organization.saveDeptItem", pDto);
    Dto updateDto = new BaseDto();
    updateDto.put("deptid", pDto.getAsString("parentid"));
    updateDto.put("leaf", "0");
    this.g4Dao.update("Organization.updateLeafFieldInEaDept", updateDto);
    return null;
  }

  public Dto updateDeptItem(Dto pDto)
  {
    if (G4Utils.isEmpty(pDto.getAsString("sortno"))) {
      pDto.put("sortno", "0");
    }
    if (pDto.getAsString("parentid").equals(pDto.getAsString("parentid_old"))) {
      pDto.remove("parentid");
      this.g4Dao.update("Organization.updateDeptItem", pDto);
    } else {
      this.g4Dao.update("Organization.updateEadeptItem", pDto);
      saveDeptItem(pDto);
      pDto.put("parentid", pDto.getAsString("parentid_old"));
      updateLeafOfDeletedParent(pDto);
    }
    return null;
  }

  private void updateLeafOfDeletedParent(Dto pDto)
  {
    String parentid = pDto.getAsString("parentid");
    pDto.put("deptid", parentid);
    Integer countInteger = (Integer)this.g4Dao.queryForObject("Organization.prepareChangeLeafOfDeletedParentForEadept", pDto);
    if (countInteger.intValue() == 0)
      pDto.put("leaf", "1");
    else {
      pDto.put("leaf", "0");
    }
    this.g4Dao.update("Organization.updateLeafFieldInEaDept", pDto);
  }

  public Dto deleteDeptItems(Dto pDto)
  {
    Dto dto = new BaseDto();
    if (pDto.getAsString("type").equals("1"))
    {
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
        dto.put("deptid", arrChecked[i]);
        deleteDept(dto);
      }
    }
    else {
      dto.put("deptid", pDto.getAsString("deptid"));
      deleteDept(dto);
    }
    return null;
  }

  private void deleteDept(Dto pDto)
  {
    Dto changeLeafDto = new BaseDto();
    Dto tempDto = (BaseDto)this.g4Dao.queryForObject("Organization.queryDeptItemsByDto", pDto);
    if (G4Utils.isNotEmpty(tempDto)) {
      changeLeafDto.put("parentid", tempDto.getAsString("parentid"));
    }
    this.g4Dao.delete("Organization.deleteEaroleAuthorizeInDeptManage", pDto);
    this.g4Dao.delete("Organization.deleteEaroleInDeptManage", pDto);
    this.g4Dao.delete("Organization.deleteEauserauthorizeInDeptManage", pDto);
    this.g4Dao.delete("Organization.deleteEauserauthorizeInDeptManage2", pDto);
    this.g4Dao.delete("Organization.deleteEausermenumapInDeptManage", pDto);
    this.g4Dao.delete("Organization.deleteEausersubinfoInDeptManage", pDto);
    this.g4Dao.delete("Organization.deleteEausermenumapInDeptManage", pDto);
    this.g4Dao.delete("Organization.deleteEarolemenumapInDeptManage", pDto);
    this.g4Dao.update("Organization.updateEauserInDeptManage", pDto);
    this.g4Dao.update("Organization.updateEadeptItem", pDto);
    if (G4Utils.isNotEmpty(tempDto))
      updateLeafOfDeletedParent(changeLeafDto);
  }

  public Dto queryDeptinfoByDeptid(Dto pDto)
  {
    Dto outDto = new BaseDto();
    outDto.putAll((BaseDto)this.g4Dao.queryForObject("Organization.queryDeptinfoByDeptid", pDto));
    outDto.put("success", new Boolean(true));
    return outDto;
  }

  public Dto saveUserTheme(Dto pDto)
  {
    Dto outDto = new BaseDto();
    this.g4Dao.update("Organization.saveUserTheme", pDto);
    outDto.put("success", new Boolean(true));
    return outDto;
  }
}