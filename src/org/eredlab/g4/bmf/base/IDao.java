package org.eredlab.g4.bmf.base;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import javax.sql.DataSource;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.exception.PrcException;
import org.springframework.orm.ibatis.SqlMapClientTemplate;

public interface IDao
{
  void insert(String paramString, Object paramObject);

  void insert(String paramString);

  Object queryForObject(String paramString, Object paramObject);

  Object queryForObject(String paramString);

  List queryForList(String paramString, Object paramObject);

  List queryForList(String paramString);

  List queryForPage(String paramString, Dto paramDto)
    throws SQLException;

  int update(String paramString, Object paramObject);

  int update(String paramString);

  int delete(String paramString, Object paramObject);

  int delete(String paramString);

  void callPrc(String paramString, Dto paramDto)
    throws PrcException;

  void callPrc(String paramString1, Dto paramDto, String paramString2)
    throws PrcException;

  Connection getConnection()
    throws SQLException;

  DataSource getDataSourceFromSqlMap()
    throws SQLException;

  SqlMapClientTemplate getSqlMapClientTpl();
}