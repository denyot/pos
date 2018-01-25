package cn.longhaul.authority.service;

import java.sql.SQLException;
import java.util.List;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface ManagerService
{
  public abstract List getTcode(Dto paramDto)
    throws SQLException;

  public abstract void delTcode(Dto paramDto)
    throws SQLException;

  public abstract void updateTcode(Dto paramDto)
    throws SQLException;

  public abstract void saveTcode(Dto paramDto)
    throws SQLException;

  public abstract int getTcodeCount(Dto paramDto)
    throws SQLException;
}