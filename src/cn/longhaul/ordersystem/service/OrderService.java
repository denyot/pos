package cn.longhaul.ordersystem.service;

import java.util.List;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface OrderService extends BaseService
{
  public abstract boolean saveOrder(Dto paramDto, List<?> paramList)
    throws Exception;

  public abstract boolean upadteOrder(Dto paramDto, List<?> paramList)
    throws Exception;

  public abstract boolean updateOrderForSap(Dto paramDto, List<?> paramList)
    throws Exception;

  public abstract boolean delOrder(List<?> paramList)
    throws Exception;

  public abstract boolean delOrder(Dto paramDto)
    throws Exception;

  public abstract boolean updateOrderByDelivery(Dto paramDto)
    throws Exception;

  public abstract boolean updateOrderByvbeln(Dto paramDto)
    throws Exception;
}