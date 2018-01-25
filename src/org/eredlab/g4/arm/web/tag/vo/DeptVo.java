package org.eredlab.g4.arm.web.tag.vo;

import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class DeptVo extends BaseVo
{
  private String deptid;
  private String deptname;
  private String parentid;
  private String icon;
  private String isroot;

  public String getDeptid()
  {
    return this.deptid;
  }
  public void setDeptid(String deptid) {
    this.deptid = deptid;
  }
  public String getDeptname() {
    return this.deptname;
  }
  public void setDeptname(String deptname) {
    this.deptname = deptname;
  }
  public String getParentid() {
    return this.parentid;
  }
  public void setParentid(String parentid) {
    this.parentid = parentid;
  }
  public String getIcon() {
    return this.icon;
  }
  public void setIcon(String icon) {
    this.icon = icon;
  }
  public String getIsroot() {
    return this.isroot;
  }
  public void setIsroot(String isroot) {
    this.isroot = isroot;
  }
}