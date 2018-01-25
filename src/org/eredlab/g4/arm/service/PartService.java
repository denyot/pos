package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface PartService extends BaseService
{
  public abstract Dto saveDirtyDatas(Dto paramDto);

  public abstract Dto deleteItem(Dto paramDto);

  public abstract Dto savePartUserGrantDatas(Dto paramDto);

  public abstract Dto savePartRoleGrantDatas(Dto paramDto);
}