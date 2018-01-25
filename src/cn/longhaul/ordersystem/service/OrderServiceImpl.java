package cn.longhaul.ordersystem.service;

import java.util.List;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;

public class OrderServiceImpl extends BaseServiceImpl
  implements OrderService
{
  public boolean saveOrder(Dto orderHead, List<?> orderitemal)
    throws Exception
  {
    this.g4Dao.insert("ordersystem.createorderhead", orderHead);
    for (int i = 0; i < orderitemal.size(); i++) {
      Dto orderitem = (Dto)orderitemal.get(i);
      orderitem.put("salesorderid", orderHead.get("salesorderid"));
      this.g4Dao.insert("ordersystem.createorderitem", orderitem);
    }
    return true;
  }
  public boolean upadteOrder(Dto orderHead, List<?> orderitemal) throws Exception {
    if (this.g4Dao.update("ordersystem.updateorderhead", orderHead) == 1) {
      this.g4Dao.delete("ordersystem.deleteorderItem", orderHead);
      for (int i = 0; i < orderitemal.size(); i++) {
        Dto orderitem = (Dto)orderitemal.get(i);
        this.g4Dao.insert("ordersystem.createorderitem", orderitem);
      }
      this.g4Dao.update("ordersystem.updateorderhead", orderHead);
    } else {
      return false;
    }
    return true;
  }
  public boolean updateOrderForSap(Dto orderHead, List<?> orderitemal) throws Exception {
    this.g4Dao.update("ordersystem.updateorderhead", orderHead);
    this.g4Dao.delete("ordersystem.deleteorderItem", orderHead);
    for (int i = 0; i < orderitemal.size(); i++) {
      Dto orderitem = (Dto)orderitemal.get(i);
      this.g4Dao.insert("ordersystem.createorderitem", orderitem);
    }
    this.g4Dao.update("ordersystem.updateorderheadbysapvbeln", orderHead);
    return true;
  }
  public boolean delOrder(List<?> orderHead) throws Exception {
    for (int i = 0; i < orderHead.size(); i++) {
      Dto delorder = (Dto)orderHead.get(i);
      this.g4Dao.delete("ordersystem.deleteorderhead", delorder);
      this.g4Dao.delete("ordersystem.deleteorderItem", delorder);
    }
    return true;
  }
  public boolean delOrder(Dto orderHead) throws Exception {
    this.g4Dao.delete("ordersystem.deleteorderhead", orderHead);
    this.g4Dao.delete("ordersystem.deleteorderItem", orderHead);
    return true;
  }
  public boolean updateOrderByDelivery(Dto orderHead) throws Exception {
    this.g4Dao.update("ordersystem.updateorderheadbyDelivery", orderHead);
    return true;
  }
  public boolean updateOrderByvbeln(Dto orderHead) throws Exception {
    this.g4Dao.update("ordersystem.updateorderheadbysapvbeln", orderHead);
    return true;
  }
}