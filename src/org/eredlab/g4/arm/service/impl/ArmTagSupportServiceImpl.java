package org.eredlab.g4.arm.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.eredlab.g4.arm.service.ArmTagSupportService;
import org.eredlab.g4.arm.web.tag.vo.MenuVo;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class ArmTagSupportServiceImpl extends BaseServiceImpl
  implements ArmTagSupportService
{
  public Dto getCardList(Dto pDto)
  {
    Dto outDto = new BaseDto();
    List resultList = new ArrayList();
    String accountType = pDto.getAsString("accountType");
    if (!accountType.equalsIgnoreCase("1")) {
      resultList = this.g4Dao.queryForList("ArmTagSupport.getCardListBasedSuperAndDeveloper", pDto);
      outDto.setDefaultAList(resultList);
      return outDto;
    }
    List cardListBasedRole = this.g4Dao.queryForList("ArmTagSupport.getCardList", pDto);
    List cardListBasedUser = this.g4Dao.queryForList("ArmTagSupport.getCardListBasedUser", pDto);
    if (G4Utils.isEmpty(cardListBasedRole)) {
      resultList.addAll(cardListBasedUser);
    } else {
      resultList.addAll(cardListBasedRole);
      for (int i = 0; i < cardListBasedUser.size(); i++) {
        MenuVo menuVoBaseUser = (MenuVo)cardListBasedUser.get(i);
        boolean flag = true;
        for (int j = 0; j < cardListBasedRole.size(); j++) {
          MenuVo menuVoBaseRole = (MenuVo)cardListBasedRole.get(j);
          if (menuVoBaseUser.getMenuid().equals(menuVoBaseRole.getMenuid())) {
            flag = false;
          }
        }
        if (flag)
          resultList.add(menuVoBaseUser);
      }
    }
    outDto.setDefaultAList(resultList);
    return outDto;
  }

  public Dto getCardTreeList(Dto pDto)
  {
    Dto outDto = new BaseDto();
    List resultList = new ArrayList();
    String accountType = pDto.getAsString("accountType");
    if (!accountType.equalsIgnoreCase("1")) {
      if (G4Utils.defaultJdbcTypeOracle())
        resultList = this.g4Dao.queryForList("ArmTagSupport.getCardTreeListBasedSuperAndDeveloper", pDto);
      else if (G4Utils.defaultJdbcTypeMysql()) {
        resultList = this.g4Dao.queryForList("ArmTagSupport.getCardTreeListBasedSuperAndDeveloperMysql", pDto);
      }
      outDto.setDefaultAList(resultList);
      return outDto;
    }
    List cardTreeListBasedRole = new ArrayList();
    if (G4Utils.defaultJdbcTypeOracle())
      cardTreeListBasedRole = this.g4Dao.queryForList("ArmTagSupport.getCardTreeList", pDto);
    else if (G4Utils.defaultJdbcTypeMysql()) {
      cardTreeListBasedRole = this.g4Dao.queryForList("ArmTagSupport.getCardTreeListMysql", pDto);
    }
    List cardTreeListBasedUser = new ArrayList();
    if (G4Utils.defaultJdbcTypeOracle())
      cardTreeListBasedUser = this.g4Dao.queryForList("ArmTagSupport.getCardTreeListBasedUser", pDto);
    else if (G4Utils.defaultJdbcTypeMysql()) {
      cardTreeListBasedUser = this.g4Dao.queryForList("ArmTagSupport.getCardTreeListBasedUserMysql", pDto);
    }
    if (G4Utils.isEmpty(cardTreeListBasedRole)) {
      resultList.addAll(cardTreeListBasedUser);
    } else {
      resultList.addAll(cardTreeListBasedRole);
      for (int i = 0; i < cardTreeListBasedUser.size(); i++) {
        MenuVo menuVoBaseUser = (MenuVo)cardTreeListBasedUser.get(i);
        boolean flag = true;
        for (int j = 0; j < cardTreeListBasedRole.size(); j++) {
          MenuVo menuVoBaseRole = (MenuVo)cardTreeListBasedRole.get(j);
          if (menuVoBaseUser.getMenuid().equals(menuVoBaseRole.getMenuid())) {
            flag = false;
          }
        }
        if (flag)
          resultList.add(menuVoBaseUser);
      }
    }
    for (int i = 0; i < resultList.size(); i++) {
      MenuVo menuVo = (MenuVo)resultList.get(i);
      if (menuVo.getMenuid().equals("01")) {
        resultList.remove(i);
      }
    }
    outDto.setDefaultAList(resultList);
    return outDto;
  }

  public Dto getDepartmentInfo(Dto pDto)
  {
    Dto outDto = (BaseDto)this.g4Dao.queryForObject("ArmTagSupport.getDepartmentInfo", pDto);
    String deptname = ((BaseDto)this.g4Dao.queryForObject("ArmTagSupport.getDepartmentInfo", pDto)).getAsString("deptname");
    return outDto;
  }

  public Dto getEauserSubInfo(Dto pDto)
  {
    return (BaseDto)this.g4Dao.queryForObject("ArmTagSupport.getEauserSubInfo", pDto);
  }
}