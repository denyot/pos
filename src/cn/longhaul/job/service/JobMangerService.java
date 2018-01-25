package cn.longhaul.job.service;

import java.sql.SQLException;
import java.util.List;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface JobMangerService extends BaseService
{
  public abstract List getJobQrtzTriggers(Dto paramDto)
    throws SQLException;

  public abstract void saveReportHistory(Dto paramDto)
    throws SQLException;

  public abstract void updateSyncState(Dto paramDto)
    throws SQLException;

  public abstract void delSyncState(Dto paramDto)
    throws SQLException;

  public abstract void delSyncHistory(Dto paramDto)
    throws SQLException;

  public abstract List getTableDesc(Dto paramDto)
    throws SQLException;
}