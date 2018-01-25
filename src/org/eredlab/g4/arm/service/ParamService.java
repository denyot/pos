package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface ParamService extends BaseService
{
  public abstract Dto saveParamItem(Dto paramDto);

  public abstract Dto deleteParamItem(Dto paramDto);

  public abstract Dto updateParamItem(Dto paramDto);
}