package org.eredlab.g4.arm.service.impl;

import org.eredlab.g4.arm.service.MonitorService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;

public class MonitorServiceImpl extends BaseServiceImpl
  implements MonitorService
{
  public void saveHttpSession(UserInfoVo userInfo)
  {
    this.g4Dao.insert("Monitor.saveHttpSession", userInfo);
  }

  public void deleteHttpSession(Dto dto)
  {
    this.g4Dao.delete("Monitor.deleteHttpSession", dto);
  }

  public void saveEvent(Dto dto)
  {
    String eventid = IDHelper.getEventID();
    dto.put("eventid", eventid);
    this.g4Dao.insert("Monitor.saveEvent", dto);
  }

  public Dto deleteEvent(Dto inDto)
  {
    if (inDto.getAsString("type").equalsIgnoreCase("reset")) {
      this.g4Dao.delete("Monitor.resetEvent");
    } else {
      String[] checked = inDto.getAsString("strChecked").split(",");
      for (int i = 0; i < checked.length; i++) {
        this.g4Dao.delete("Monitor.deleteEvent", checked[i]);
      }
    }
    return null;
  }

  public Dto deleteMonitorData(Dto inDto)
  {
    if (inDto.getAsString("type").equalsIgnoreCase("reset")) {
      this.g4Dao.delete("Monitor.resetBeanMonitorRecords");
    } else {
      String[] checked = inDto.getAsString("strChecked").split(",");
      for (int i = 0; i < checked.length; i++) {
        this.g4Dao.delete("Monitor.deleteBeanMonitorRecord", checked[i]);
      }
    }
    return null;
  }

  public Dto resetMonitorData()
  {
    this.g4Dao.delete("Monitor.resetJdbcMonitorData");
    return null;
  }
}