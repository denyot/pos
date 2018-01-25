package cn.longhaul.sap.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface SapRfcParamService extends BaseService
{
  public abstract Dto saveRfcItem(Dto paramDto);

  public abstract Dto deleteRfcItem(Dto paramDto);

  public abstract Dto updateRfcItem(Dto paramDto);
}