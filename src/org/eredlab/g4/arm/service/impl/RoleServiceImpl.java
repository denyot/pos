package org.eredlab.g4.arm.service.impl;

import org.eredlab.g4.arm.service.RoleService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class RoleServiceImpl extends BaseServiceImpl
  implements RoleService
{
  public Dto saveRoleItem(Dto pDto)
  {
    pDto.put("roleid", IDHelper.getRoleID());
    this.g4Dao.insert("Role.saveRoleItem", pDto);
    return null;
  }

  public Dto deleteRoleItems(Dto pDto)
  {
    Dto dto = new BaseDto();
    String[] arrChecked = pDto.getAsString("strChecked").split(",");
    for (int i = 0; i < arrChecked.length; i++) {
      dto.put("roleid", arrChecked[i]);
      this.g4Dao.delete("Role.deleteEaroleAuthorizeInRoleManage", dto);
      this.g4Dao.delete("Role.deleteEauserauthorizeInRoleManage", dto);
      this.g4Dao.delete("Role.deleteEarolemenupartInRoleManage", dto);
      this.g4Dao.delete("Role.deleteEaroleInRoleManage", dto);
    }
    return null;
  }

  public Dto updateRoleItem(Dto pDto)
  {
    this.g4Dao.update("Role.updateRoleItem", pDto);
    if (!pDto.getAsString("deptid").equals(pDto.getAsString("deptid_old"))) {
      this.g4Dao.delete("Role.deleteEaroleAuthorizeInRoleManage", pDto);
    }
    return null;
  }

  public Dto saveGrant(Dto pDto)
  {
    this.g4Dao.delete("Role.deleteERoleGrants", pDto);
    String[] menuids = pDto.getAsString("menuid").split(",");
    for (int i = 0; i < menuids.length; i++) {
      String menuid = menuids[i];
      if (!G4Utils.isEmpty(menuid))
      {
        pDto.put("menuid", menuid);
        pDto.put("authorizeid", IDHelper.getAuthorizeid4Role());
        this.g4Dao.insert("Role.saveRoleGrantItem", pDto);
      }
    }
    return null;
  }

  public Dto saveSelectUser(Dto pDto)
  {
    this.g4Dao.delete("Role.deleteEaUserAuthorizeByRoleId", pDto);
    String[] userids = pDto.getAsString("userid").split(",");
    for (int i = 0; i < userids.length; i++) {
      String userid = userids[i];
      if (!G4Utils.isEmpty(userid))
      {
        pDto.put("userid", userid);
        pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
        this.g4Dao.insert("Role.saveSelectUser", pDto);
      }
    }
    return null;
  }
}