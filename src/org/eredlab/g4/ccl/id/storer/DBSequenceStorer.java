package org.eredlab.g4.ccl.id.storer;

import javax.sql.DataSource;
import org.eredlab.g4.ccl.id.SequenceStorer;
import org.eredlab.g4.ccl.id.StoreSequenceException;

public class DBSequenceStorer
  implements SequenceStorer
{
  private DataSource dataSource;
  private String tableName;
  private String idColumnName;
  private String valueColumnName;

  public long load(String sequenceID)
    throws StoreSequenceException
  {
    return 0L;
  }

  public void updateMaxValueByFieldName(long sequence, String sequenceID)
    throws StoreSequenceException
  {
  }

  public DataSource getDataSource()
  {
    return this.dataSource;
  }

  public void setDataSource(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  public String getTableName() {
    return this.tableName;
  }

  public void setTableName(String tableName) {
    this.tableName = tableName;
  }

  public String getIdColumnName() {
    return this.idColumnName;
  }

  public void setIdColumnName(String idColumnName) {
    this.idColumnName = idColumnName;
  }

  public String getValueColumnName() {
    return this.valueColumnName;
  }

  public void setValueColumnName(String valueColumnName) {
    this.valueColumnName = valueColumnName;
  }
}