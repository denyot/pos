package org.eredlab.g4.bmf.base;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.PKey;
import org.eredlab.g4.ccl.datastructure.impl.BasePo;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

public class BaseDaoImpl extends SqlMapClientDaoSupport
  implements BaseDao
{
  Log log = LogFactory.getLog(BaseDaoImpl.class);

  protected static PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");
  private String domainName;

  public void insertDomain(BasePo domain)
  {
    super.getSqlMapClientTemplate().insert("insert" + getDomainName(), domain);
  }

  public void deleteDomainByKey(PKey key)
  {
    key.validateNullAble();
    super.getSqlMapClientTemplate().delete("delete" + getDomainName() + "ByKey", key);
  }

  public Object queryDomainByKey(PKey key)
  {
    key.validateNullAble();
    return super.getSqlMapClientTemplate().queryForObject("query" + getDomainName() + "ByKey", key);
  }

  public List queryDomainsByDto(Dto dto)
  {
    List lst = super.getSqlMapClientTemplate().queryForList("query" + getDomainName() + "sByDto", dto);
    return lst;
  }

  public List queryForPage(String statementName, Dto qDto)
  {
    return super.getSqlMapClientTemplate().queryForList(statementName, qDto, qDto.getAsInteger("start").intValue(), 
      qDto.getAsInteger("end").intValue());
  }

  public void updateDomainByKey(BasePo domain)
  {
    PKey key = domain.getPk();

    key.validateNullAble();
    super.getSqlMapClientTemplate().update("update" + getDomainName() + "ByKey", domain);
  }

  public String getDomainName() {
    return this.domainName;
  }

  public void setDomainName(String domainName) {
    this.domainName = domainName;
  }
}