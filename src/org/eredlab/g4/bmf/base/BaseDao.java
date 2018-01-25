package org.eredlab.g4.bmf.base;

import java.util.List;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.PKey;
import org.eredlab.g4.ccl.datastructure.impl.BasePo;

public abstract interface BaseDao
{
  public abstract void insertDomain(BasePo paramBasePo);

  public abstract void deleteDomainByKey(PKey paramPKey);

  public abstract Object queryDomainByKey(PKey paramPKey);

  public abstract List queryDomainsByDto(Dto paramDto);

  public abstract void updateDomainByKey(BasePo paramBasePo);

  public abstract List queryForPage(String paramString, Dto paramDto);
}