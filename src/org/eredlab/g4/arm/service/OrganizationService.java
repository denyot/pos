package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface OrganizationService extends BaseService
{
  public abstract Dto getUserInfo(Dto paramDto);

  public abstract Dto queryDeptItems(Dto paramDto);

  public abstract Dto saveDeptItem(Dto paramDto);

  public abstract Dto updateDeptItem(Dto paramDto);

  public abstract Dto deleteDeptItems(Dto paramDto);

  public abstract Dto queryDeptinfoByDeptid(Dto paramDto);

  public abstract Dto saveUserTheme(Dto paramDto);
}