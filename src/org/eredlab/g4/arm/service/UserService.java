package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface UserService extends BaseService
{
  public abstract Dto saveUserItem(Dto paramDto);

  public abstract Dto deleteUserItems(Dto paramDto);

  public abstract Dto updateUserItem(Dto paramDto);

  public abstract Dto saveSelectedRole(Dto paramDto);

  public abstract Dto saveSelectedMenu(Dto paramDto);

  public abstract Dto updateUserItem4IndexPage(Dto paramDto);
}