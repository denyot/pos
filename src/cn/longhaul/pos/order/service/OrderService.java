package cn.longhaul.pos.order.service;

import java.util.List;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import cn.longhaul.sap.system.aig.AigTransferInfo;

public abstract interface OrderService extends BaseService
{
  public abstract boolean saveOrder(Dto paramDto, List<?> paramList)
    throws Exception;

  public abstract boolean upadteOrder(Dto paramDto, List<?> paramList)
    throws Exception;
  
  public abstract Dto createSapZys1(Dto paramDto, List<Dto> paramList) throws Exception;
  public abstract Dto   saveOderZys1(Dto paramDto, List<Dto> paramList) throws Exception;
  
  

  public abstract boolean updateOrderForSap(Dto paramDto, List<?> paramList)
    throws Exception;

  public abstract boolean delOrder(List<?> paramList)
    throws Exception;

  public abstract boolean delOrder(Dto paramDto1, Dto paramDto2)
    throws Exception;

  public abstract boolean delOrderForNewOrder(Dto paramDto)
    throws Exception;

  public abstract boolean updateOrderByDelivery(Dto paramDto)
    throws Exception;

  public abstract boolean updateOrderByvbeln(Dto paramDto, List<Dto> paramList)
    throws Exception;

  public abstract boolean updateOrderByvbeln2(Dto paramDto, List<Dto> paramList)
  throws Exception;
  
  public abstract String getCustomId(String paramString)
    throws Exception;
}