package org.eredlab.g4.arm.vo;

import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class UserInfoVo extends BaseVo
{
  private String userid;
  private String username;
  private String account;
  private String password;
  private String sex;
  private String deptid;
  private String lock;
  private String customId;
  private String theme;
  private String sessionID;
  private String sessionCreatedTime;
  private String loginIP;
  private String explorer;

  public UserInfoVo()
  {
  }

  public UserInfoVo(String userid)
  {
    this.userid = userid;
  }

  public String getUserid() {
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

  public String getAccount() {
    return this.account;
  }

  public void setAccount(String account) {
    this.account = account;
  }

  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getSex() {
    return this.sex;
  }

  public void setSex(String sex) {
    this.sex = sex;
  }

  public String getDeptid() {
    return this.deptid;
  }

  public void setDeptid(String deptid) {
    this.deptid = deptid;
  }

  public String getLock() {
    return this.lock;
  }

  public void setLock(String lock) {
    this.lock = lock;
  }

  public String getCustomId() {
    return this.customId;
  }

  public void setCustomId(String customId) {
    this.customId = customId;
  }

  public String getTheme() {
    return this.theme;
  }

  public void setTheme(String theme) {
    this.theme = theme;
  }

  public String getSessionID() {
    return this.sessionID;
  }

  public void setSessionID(String sessionID) {
    this.sessionID = sessionID;
  }

  public String getLoginIP() {
    return this.loginIP;
  }

  public void setLoginIP(String loginIP) {
    this.loginIP = loginIP;
  }

  public String getSessionCreatedTime() {
    return this.sessionCreatedTime;
  }

  public void setSessionCreatedTime(String sessionCreatedTime) {
    this.sessionCreatedTime = sessionCreatedTime;
  }

  public String getExplorer() {
    return this.explorer;
  }

  public void setExplorer(String explorer) {
    this.explorer = explorer;
  }
}