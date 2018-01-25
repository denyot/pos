package org.eredlab.g4.arm.web.tag.vo;

import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class UserVo extends BaseVo
{
  private String userid;
  private String username;
  private String deptid;
  private String iconcls;
  private String account;
  private String usertype;
  private String checked;

  public String getUserid()
  {
    return this.userid;
  }
  public void setUserid(String userid) {
    this.userid = userid;
  }
  public String getUsername() {
    return this.username;
  }
  public void setUsername(String username) {
    this.username = username;
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
  public String getAccount() {
    return this.account;
  }
  public void setAccount(String account) {
    this.account = account;
  }
  public String getUsertype() {
    return this.usertype;
  }
  public void setUsertype(String usertype) {
    this.usertype = usertype;
  }
  public String getChecked() {
    return this.checked;
  }
  public void setChecked(String checked) {
    this.checked = checked;
  }
}