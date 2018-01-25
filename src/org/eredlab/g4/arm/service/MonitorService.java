package org.eredlab.g4.arm.service;

import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface MonitorService extends BaseService
{
  public abstract void saveHttpSession(UserInfoVo paramUserInfoVo);

  public abstract void deleteHttpSession(Dto paramDto);

  public abstract void saveEvent(Dto paramDto);

  public abstract Dto deleteEvent(Dto paramDto);

  public abstract Dto deleteMonitorData(Dto paramDto);

  public abstract Dto resetMonitorData();
}