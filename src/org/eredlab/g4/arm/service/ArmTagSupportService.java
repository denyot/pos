package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface ArmTagSupportService extends BaseService
{
  public abstract Dto getCardList(Dto paramDto);

  public abstract Dto getCardTreeList(Dto paramDto);

  public abstract Dto getDepartmentInfo(Dto paramDto);

  public abstract Dto getEauserSubInfo(Dto paramDto);
}