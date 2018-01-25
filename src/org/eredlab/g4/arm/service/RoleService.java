package org.eredlab.g4.arm.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface RoleService extends BaseService
{
  public abstract Dto saveRoleItem(Dto paramDto);

  public abstract Dto deleteRoleItems(Dto paramDto);

  public abstract Dto updateRoleItem(Dto paramDto);

  public abstract Dto saveGrant(Dto paramDto);

  public abstract Dto saveSelectUser(Dto paramDto);
}