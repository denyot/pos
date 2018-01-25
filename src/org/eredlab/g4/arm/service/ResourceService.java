package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface ResourceService extends BaseService
{
  public abstract Dto saveCodeItem(Dto paramDto);

  public abstract Dto deleteCodeItem(Dto paramDto);

  public abstract Dto updateCodeItem(Dto paramDto);

  public abstract Dto saveMenuItem(Dto paramDto);

  public abstract Dto deleteMenuItems(Dto paramDto);

  public abstract Dto updateMenuItem(Dto paramDto);
}