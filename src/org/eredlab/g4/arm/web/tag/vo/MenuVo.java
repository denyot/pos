package org.eredlab.g4.arm.web.tag.vo;

import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class MenuVo extends BaseVo
{
  private String menuid;
  private String menuname;
  private String iconcls;
  private String parentid;
  private String request;
  private String leaf;
  private String isNotLast;
  private String isRoot;
  private String expanded;
  private String menupath;
  private String icon;
  private String checked;

  public String getMenuid()
  {
    return this.menuid;
  }
  public void setMenuid(String menuid) {
    this.menuid = menuid;
  }
  public String getMenuname() {
    return this.menuname;
  }
  public void setMenuname(String menuname) {
    this.menuname = menuname;
  }
  public String getIsNotLast() {
    return this.isNotLast;
  }
  public void setIsNotLast(String isNotLast) {
    this.isNotLast = isNotLast;
  }
  public void setParentid(String parentid) {
    this.parentid = parentid;
  }
  public void setRequest(String request) {
    this.request = request;
  }
  public void setLeaf(String leaf) {
    this.leaf = leaf;
  }
  public String getParentid() {
    return this.parentid;
  }
  public String getRequest() {
    return this.request;
  }
  public String getIsRoot() {
    return this.isRoot;
  }
  public void setIsRoot(String isRoot) {
    this.isRoot = isRoot;
  }
  public String getIconcls() {
    return this.iconcls;
  }
  public void setIconcls(String iconcls) {
    this.iconcls = iconcls;
  }
  public String getLeaf() {
    return this.leaf;
  }
  public String getExpanded() {
    return this.expanded;
  }
  public void setExpanded(String expanded) {
    this.expanded = expanded;
  }
  public String getMenupath() {
    return this.menupath;
  }
  public void setMenupath(String menupath) {
    this.menupath = menupath;
  }
  public String getIcon() {
    return this.icon;
  }
  public void setIcon(String icon) {
    this.icon = icon;
  }
  public String getChecked() {
    return this.checked;
  }
  public void setChecked(String checked) {
    this.checked = checked;
  }
}