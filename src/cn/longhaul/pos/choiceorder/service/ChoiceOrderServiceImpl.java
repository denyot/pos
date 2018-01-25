package cn.longhaul.pos.choiceorder.service;

import java.util.List;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;

public class ChoiceOrderServiceImpl extends BaseServiceImpl
  implements ChoiceOrderService
{
  public boolean saveChoiceOrder(Dto orderHead, List<?> orderitemal)
    throws Exception
  {
    this.g4Dao.insert("choiceOrder.saveChoiceOrderHeader", orderHead);

    for (int i = 0; i < orderitemal.size(); i++) {
      this.g4Dao.insert("choiceOrder.saveChoiceOrderItem", orderitemal.get(i));
    }
    return true;
  }
  public boolean saveChoiceOrder(Dto orderHead) throws Exception {
    this.g4Dao.insert("choiceOrder.saveChoiceOrderHeader", orderHead);

    return true;
  }

  public boolean saveChoiceOrder(List<?> orderitemal) throws Exception {
    for (int i = 0; i < orderitemal.size(); i++) {
      this.g4Dao.insert("choiceOrder.saveChoiceOrderItem", orderitemal.get(i));
    }
    return true;
  }

  public boolean upadteChoiceOrder(Dto orderHead, List<?> orderitemal) throws Exception {
    this.g4Dao.delete("choiceOrder.deleteChoiceOrderItems", orderHead);
    this.g4Dao.update("choiceOrder.updateChoiceOrderHead", orderHead);
    for (int i = 0; i < orderitemal.size(); i++) {
      this.g4Dao.insert("choiceOrder.saveChoiceOrderItem", orderitemal.get(i));
    }
    return true;
  }

  public boolean delChoiceOrder(List<?> orderHead) throws Exception {
    for (int i = 0; i < orderHead.size(); i++) {
      Dto delorder = (Dto)orderHead.get(i);
      this.g4Dao.delete("posordersystem.deleteorderhead", delorder);
      this.g4Dao.delete("posordersystem.deleteorderItem", delorder);
    }
    return true;
  }

  public boolean delChoiceOrder(Dto orderHead) throws Exception {
    this.g4Dao.delete("choiceOrder.deleteChoiceOrderHeader", orderHead);
    this.g4Dao.delete("choiceOrder.deleteChoiceOrderItem", orderHead);
    return true;
  }

  public void saveChoiceOrderForGift(Dto orderHead, List<Dto> orderitemal)
  {
    this.g4Dao.insert("choiceOrder.saveChoiceOrderHeaderForGift", orderHead);

    for (int i = 0; i < orderitemal.size(); i++)
      this.g4Dao.insert("choiceOrder.saveChoiceOrderItemForGift", orderitemal.get(i));
  }

  public void upadteChoiceOrderForGift(Dto orderHead, List<Dto> orderitemal)
  {
    this.g4Dao.delete("choiceOrder.deleteChoiceOrderItemsForGift", orderHead);
    this.g4Dao.update("choiceOrder.updateChoiceOrderHeadForGift", orderHead);
    for (int i = 0; i < orderitemal.size(); i++)
      this.g4Dao.insert("choiceOrder.saveChoiceOrderItemForGift", orderitemal.get(i));
  }

  public void delChoiceOrderForGift(Dto dto)
  {
    this.g4Dao.delete("choiceOrder.deleteChoiceOrderHeaderForGift", dto);
    this.g4Dao.delete("choiceOrder.deleteChoiceOrderItemForGift", dto);
  }
}