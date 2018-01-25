package org.eredlab.g4.ccl.datastructure.impl;

import java.io.Serializable;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.PKey;
import org.eredlab.g4.ccl.util.G4Utils;

public abstract class BasePo
  implements Serializable
{
  public Dto toDto()
  {
    Dto dto = new BaseDto();
    G4Utils.copyPropFromBean2Dto(this, dto);

    dto.remove("pk");
    return dto;
  }

  public String toXml(String pStyle)
  {
    Dto dto = toDto();
    return dto.toXml(pStyle);
  }

  public String toJson()
  {
    Dto dto = toDto();
    return dto.toJson();
  }

  public abstract PKey getPk();
}