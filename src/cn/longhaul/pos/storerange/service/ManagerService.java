package cn.longhaul.pos.storerange.service;

import java.util.List;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface ManagerService
{
  public abstract List getBrandList(Dto paramDto)
    throws Exception;

  public abstract int getBrandCount(Dto paramDto)
    throws Exception;

  public abstract void saveBrand(Dto paramDto)
    throws Exception;

  public abstract void updateBrand(Dto paramDto)
    throws Exception;

  public abstract void delBrand(Dto paramDto)
    throws Exception;

  public abstract void saveBrandSale(Dto paramDto)
    throws Exception;

  public abstract List getBrandSaleList(Dto paramDto)
    throws Exception;

  public abstract int getBrandSaleCount(Dto paramDto)
    throws Exception;

  public abstract Dto getDeptTree(Dto paramDto)
    throws Exception;

  public abstract void saveBrandSale2(Dto paramDto)
    throws Exception;
}