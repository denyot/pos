package org.eredlab.g4.arm.service.impl;

import org.eredlab.g4.arm.service.UserService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class UserServiceImpl extends BaseServiceImpl
  implements UserService
{
  public Dto saveUserItem(Dto pDto)
  {
    Dto outDto = new BaseDto();
    pDto.put("enabled", "1");
    Integer temp = (Integer)this.g4Dao.queryForObject("User.checkAccount", pDto);
    if (temp.intValue() != 0) {
      outDto.put("msg", "登录账户" + outDto.getAsString("account") + "已被占用,请尝试其它帐户!");
      outDto.put("success", new Boolean(false));
      return outDto;
    }
    pDto.put("userid", IDHelper.getUserID());
    String password = pDto.getAsString("password");
    String mPasswor = G4Utils.encryptBasedDes(password);
    pDto.put("password", mPasswor);
    this.g4Dao.insert("User.saveUserItem", pDto);
    this.g4Dao.insert("User.saveEausersubinfoItem", pDto);
    outDto.put("msg", "用户数据新增成功");
    outDto.put("success", new Boolean(true));
    return outDto;
  }

  public Dto deleteUserItems(Dto pDto)
  {
    Dto dto = new BaseDto();
    String[] arrChecked = pDto.getAsString("strChecked").split(",");
    for (int i = 0; i < arrChecked.length; i++) {
      dto.put("userid", arrChecked[i]);
      this.g4Dao.update("User.updateEauserInUserManage", dto);
      this.g4Dao.delete("User.deleteEauserauthorizeInUserManage", dto);
      this.g4Dao.delete("User.deleteEausermenumapByUserid", dto);
      this.g4Dao.delete("User.deleteEausersubinfoByUserid", dto);
    }
    return null;
  }

  public Dto updateUserItem(Dto pDto)
  {
    String password = pDto.getAsString("password");
    String mPasswor = G4Utils.encryptBasedDes(password);
    pDto.put("password", mPasswor);
    this.g4Dao.update("User.updateUserItem", pDto);
    if (!pDto.getAsString("deptid").equals(pDto.getAsString("deptid_old"))) {
      this.g4Dao.delete("User.deleteEauserauthorizeInUserManage", pDto);
      this.g4Dao.delete("User.deleteEausermenumapByUserId", pDto);
    }
    return null;
  }

  public Dto saveSelectedRole(Dto pDto)
  {
    this.g4Dao.delete("User.deleteEaUserAuthorizeByUserId", pDto);
    String[] roleids = pDto.getAsString("roleid").split(",");
    for (int i = 0; i < roleids.length; i++) {
      String roleid = roleids[i];
      if (!G4Utils.isEmpty(roleid))
      {
        pDto.put("roleid", roleid);
        pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
        this.g4Dao.insert("User.saveSelectedRole", pDto);
      }
    }
    return null;
  }

  public Dto saveSelectedMenu(Dto pDto)
  {
    this.g4Dao.delete("User.deleteEausermenumapByUserId", pDto);
    String[] menuids = pDto.getAsString("menuid").split(",");
    for (int i = 0; i < menuids.length; i++) {
      String menuid = menuids[i];
      if (!G4Utils.isEmpty(menuid))
      {
        pDto.put("menuid", menuid);
        pDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
        pDto.put("authorizelevel", "1");
        this.g4Dao.insert("User.saveSelectedMenu", pDto);
      }
    }
    return null;
  }

  public Dto updateUserItem4IndexPage(Dto pDto)
  {
    String password = pDto.getAsString("password");
    String mPasswor = G4Utils.encryptBasedDes(password);
    pDto.put("password", mPasswor);
    pDto.put("updatemode", "notnull");
    this.g4Dao.update("User.updateUserItem", pDto);
    return null;
  }
}