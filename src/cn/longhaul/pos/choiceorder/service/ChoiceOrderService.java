package cn.longhaul.pos.choiceorder.service;

import java.util.List;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface ChoiceOrderService extends BaseService
{
  public abstract boolean saveChoiceOrder(Dto paramDto, List<?> paramList)
    throws Exception;

  public abstract boolean saveChoiceOrder(Dto paramDto)
    throws Exception;

  public abstract boolean saveChoiceOrder(List<?> paramList)
    throws Exception;

  public abstract boolean upadteChoiceOrder(Dto paramDto, List<?> paramList)
    throws Exception;

  public abstract boolean delChoiceOrder(List<?> paramList)
    throws Exception;

  public abstract boolean delChoiceOrder(Dto paramDto)
    throws Exception;

  public abstract void saveChoiceOrderForGift(Dto paramDto, List<Dto> paramList);

  public abstract void upadteChoiceOrderForGift(Dto paramDto, List<Dto> paramList);

  public abstract void delChoiceOrderForGift(Dto paramDto);
}