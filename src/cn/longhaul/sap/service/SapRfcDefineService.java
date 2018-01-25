package cn.longhaul.sap.service;

import java.util.List;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface SapRfcDefineService extends BaseService
{
  public abstract Dto saveRfcItem(Dto paramDto);

  public abstract Dto saveRfcItems(Dto paramDto, List paramList);

  public abstract Dto saveRfcItems(Dto paramDto, List paramList1, List paramList2);

  public abstract Dto deleteRfcItem(Dto paramDto);

  public abstract Dto updateRfcItem(Dto paramDto);

  public abstract Dto queryRfcItems(Dto paramDto);

  public abstract Dto syncRfcItems(Dto paramDto);
}