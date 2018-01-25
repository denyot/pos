package org.eredlab.g4.arm.service.impl;

import org.eredlab.g4.arm.service.ParamService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class ParamServiceImpl extends BaseServiceImpl
  implements ParamService
{
  public Dto saveParamItem(Dto pDto)
  {
    pDto.put("paramid", IDHelper.getParamID());
    this.g4Dao.insert("Param.saveParamItem", pDto);
    return null;
  }

  public Dto deleteParamItem(Dto pDto)
  {
    Dto dto = new BaseDto();
    String[] arrChecked = pDto.getAsString("strChecked").split(",");
    for (int i = 0; i < arrChecked.length; i++) {
      dto.put("paramid", arrChecked[i]);
      this.g4Dao.delete("Param.deletParamItem", dto);
    }
    return null;
  }

  public Dto updateParamItem(Dto pDto)
  {
    this.g4Dao.update("Param.updateParamItem", pDto);
    return null;
  }
}