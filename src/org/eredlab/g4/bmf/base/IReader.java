package org.eredlab.g4.bmf.base;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import javax.sql.DataSource;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface IReader
{
  public abstract Object queryForObject(String paramString, Object paramObject);

  public abstract Object queryForObject(String paramString);

  public abstract List queryForList(String paramString, Object paramObject);

  public abstract List queryForList(String paramString);

  public abstract List queryForPage(String paramString, Dto paramDto)
    throws SQLException;

  public abstract Connection getConnection()
    throws SQLException;

  public abstract DataSource getDataSourceFromSqlMap()
    throws SQLException;
}