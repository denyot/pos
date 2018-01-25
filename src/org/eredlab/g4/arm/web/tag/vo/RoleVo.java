package org.eredlab.g4.arm.web.tag.vo;

import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class RoleVo extends BaseVo
{
  private String roleid;
  private String rolename;
  private String deptid;
  private String iconcls;
  private String roletype;
  private String checked;

  public String getRoleid()
  {
    return this.roleid;
  }
  public void setRoleid(String roleid) {
    this.roleid = roleid;
  }
  public String getRolename() {
    return this.rolename;
  }
  public void setRolename(String rolename) {
    this.rolename = rolename;
  }
  public String getDeptid() {
    return this.deptid;
  }
  public void setDeptid(String deptid) {
    this.deptid = deptid;
  }
  public String getIconcls() {
    return this.iconcls;
  }
  public void setIconcls(String iconcls) {
    this.iconcls = iconcls;
  }
  public String getRoletype() {
    return this.roletype;
  }
  public void setRoletype(String roletype) {
    this.roletype = roletype;
  }
  public String getChecked() {
    return this.checked;
  }
  public void setChecked(String checked) {
    this.checked = checked;
  }
}