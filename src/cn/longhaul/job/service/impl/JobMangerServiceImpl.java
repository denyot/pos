package cn.longhaul.job.service.impl;

import cn.longhaul.job.service.JobMangerService;
import java.sql.SQLException;
import java.util.List;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class JobMangerServiceImpl extends BaseServiceImpl
  implements JobMangerService
{
  public List getJobQrtzTriggers(Dto vDto)
    throws SQLException
  {
    Dto outDto = new BaseDto();
    List list = this.g4Dao.queryForPage("job.getqrtz_triggers", vDto);
    return list;
  }

  public void saveReportHistory(Dto vDto) throws SQLException
  {
    this.g4Dao.insert("job.insertreport_history", vDto);
  }

  public void updateSyncState(Dto vDto)
    throws SQLException
  {
    this.g4Dao.update("job.updatereport_syncstate", vDto);
  }

  public void delSyncState(Dto dto)
    throws SQLException
  {
    Dto vDto = new BaseDto();
    String triggerName = (String)dto.get("quartzname");
    if (triggerName != null)
      triggerName = triggerName.indexOf('&') > 0 ? triggerName.substring(0, triggerName.indexOf('&')) : triggerName;
    vDto.put("functionname", triggerName);
    List list = this.g4Dao.queryForList("job.getqrtz_triggersbyname", vDto);
    if (list.size() <= 0)
      this.g4Dao.delete("job.deletereport_syncstate", dto);
  }

  public void delSyncHistory(Dto dto) throws SQLException
  {
    this.g4Dao.delete("job.deletereport_history", dto);
  }

  public List getTableDesc(Dto dto) throws SQLException
  {
    List list = this.g4Dao.queryForList("job.getTableDesc", dto);
    return list;
  }
}