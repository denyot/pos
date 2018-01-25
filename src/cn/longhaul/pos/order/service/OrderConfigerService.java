package cn.longhaul.pos.order.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface OrderConfigerService extends BaseService
{
  public abstract boolean saveconfiger(Dto paramDto)
    throws Exception;
}