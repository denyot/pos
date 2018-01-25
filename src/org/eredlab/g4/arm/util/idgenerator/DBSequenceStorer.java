package org.eredlab.g4.arm.util.idgenerator;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.id.SequenceStorer;
import org.eredlab.g4.ccl.id.StoreSequenceException;

public class DBSequenceStorer
  implements SequenceStorer
{
  private IDao g4Dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");

  public long load(String pIdColumnName)
    throws StoreSequenceException
  {
    Dto dto = new BaseDto();
    dto.put("fieldname", pIdColumnName);
    dto = (BaseDto)this.g4Dao.queryForObject("IdGenerator.getEaSequenceByFieldName", dto);
    Long maxvalue = dto.getAsLong("maxid");
    return maxvalue.longValue();
  }

  public void updateMaxValueByFieldName(long pMaxId, String pIdColumnName)
    throws StoreSequenceException
  {
    Dto dto = new BaseDto();
    dto.put("maxid", String.valueOf(pMaxId));
    dto.put("fieldname", pIdColumnName);
    this.g4Dao.update("IdGenerator.updateMaxValueByFieldName", dto);
  }
}