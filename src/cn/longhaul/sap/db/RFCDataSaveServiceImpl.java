package cn.longhaul.sap.db;

import cn.longhaul.sap.system.Util.GetSqlFromMap;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;

public class RFCDataSaveServiceImpl
  implements RFCDataSaveService
{
  private static Log log = LogFactory.getLog(RFCDataSaveServiceImpl.class);

  public boolean rfcDataSave(ArrayList<?> dataList, String rfc_id, String tablename)
    throws Exception
  {
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Connection con = reader.getConnection();
    con.setAutoCommit(false);
    boolean result = true;
    try {
      Statement statement = con.createStatement();
      String primaryKeyStr = getRfcTablePrimaryKey(con, rfc_id, tablename);

      if (primaryKeyStr.equals("")) {
        String deletesql = "DELETE FROM " + tablename;
        statement.addBatch(deletesql);
      }
      for (int j = 0; j < dataList.size(); j++)
      {
        HashMap tableMap = (HashMap)dataList.get(j);

        if (!primaryKeyStr.equals("")) {
          String deletesql = GetSqlFromMap.deleteFromMap(tablename, primaryKeyStr, tableMap);
          statement.addBatch(deletesql);
          String insertsql = GetSqlFromMap.insertFromMap(tablename, "", tableMap);
          statement.addBatch(insertsql);
          if (insertsql.indexOf("0.000','0.000','M','0.000','K18Y','0.000','0.000','0.00','','0.000','0.000'") != -1) {
          }
          log.debug(insertsql);
        }
        else
        {
          String insertsql = GetSqlFromMap.insertFromMap(tablename, "", tableMap);

          log.debug(insertsql);

          statement.addBatch(insertsql);
        }

      }
      statement.executeBatch();
      statement.close();
      con.commit();
    } catch (Exception ex) {
      result = false;
      con.rollback();
      ex.printStackTrace();
      throw new RuntimeException("rfcDataSave：" + ex.getMessage());
    } finally {
      con.close();
    }
    return result;
  }

  public String getRfcTablePrimaryKey(Connection con, String rfc_id, String tablename)
  {
    String primaryKeyStr = "";
    try
    {
      String sql = "select aig_name from sap_rfctables where rfc_id=? and AIG_PRIMARYKEY=1 and PARENT_ID=(select PARA_ID FROM sap_rfctables WHERE AIG_NAME=?)";
      PreparedStatement pstmt = con.prepareStatement(sql);
      pstmt.setString(1, rfc_id);
      pstmt.setString(2, tablename);
      ResultSet rs = pstmt.executeQuery();
      while (rs.next()) {
        primaryKeyStr = primaryKeyStr + "|" + rs.getString("aig_name") + "|";
      }
      rs.close();
      pstmt.close();
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new RuntimeException("getRfcTablePrimaryKey：" + ex.getMessage());
    }
    return primaryKeyStr;
  }

  public boolean getAigTableDataExist(Connection con, String selectsql)
  {
    boolean isExist = false;
    try {
      PreparedStatement pstmt = con.prepareStatement(selectsql);
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        isExist = true;
      }
      rs.close();
      pstmt.close();
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new RuntimeException("getAigTableDataExist：" + ex.getMessage());
    }
    return isExist;
  }

  public String getRfcID(String rfc_name)
    throws SQLException
  {
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Connection con = reader.getConnection();
    String rfc_id = "";
    try {
      String sql = "select rfc_id from sap_rfcclass where saprfcname=?";
      PreparedStatement pstmt = con.prepareStatement(sql);
      pstmt.setString(1, rfc_name);
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        rfc_id = rs.getString("rfc_id");
      }
      rs.close();
      pstmt.close();
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new RuntimeException("getRfcID：" + ex.getMessage());
    } finally {
      con.close();
    }
    return rfc_id;
  }

  public HashMap<?, ?> getRFfcAIGTable(String rfc_id)
    throws Exception
  {
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Connection conn = reader.getConnection();
    HashMap tableMap = new HashMap();
    try {
      String sql = "select PARA_NAME,AIG_NAME,PARA_ID from sap_rfctables where RFC_ID=? and  PARENT_ID='0'";
      PreparedStatement pstmt = conn.prepareStatement(sql);
      pstmt.setString(1, rfc_id);
      ResultSet rs = pstmt.executeQuery();
      while (rs.next())
      {
        tableMap.put(rs.getString("PARA_NAME"), rs.getString("AIG_NAME"));
      }
      rs.close();
      pstmt.close();
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new RuntimeException("getRFfcAIGTable：" + ex.getMessage());
    } finally {
      conn.close();
    }
    return tableMap;
  }

  public ArrayList<HashMap<?, ?>> getRFfcAIGImport(String rfc_id, String parent_id)
    throws Exception
  {
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Connection conn = reader.getConnection();
    ArrayList importList = new ArrayList();
    HashMap tableMap = null;
    try {
      String sql = "select PARA_ID,PARA_NAME,AIG_NAME,parent_id,PARA_TYPE,aig_type,PARA_VALE,PARA_VALEPER,leaf from sap_rfcimport where RFC_ID=? and  PARENT_ID=?";
      PreparedStatement pstmt = conn.prepareStatement(sql);
      pstmt.setString(1, rfc_id);
      pstmt.setString(2, parent_id);
      ResultSet rs = pstmt.executeQuery();
      while (rs.next()) {
        tableMap = new HashMap();
        tableMap.put("para_id", rs.getString("PARA_ID"));
        tableMap.put("para_name", rs.getString("PARA_NAME"));
        System.out.println(rs.getString("PARA_NAME")+":"+rs.getString("PARA_VALE"));
        tableMap.put("aig_name", rs.getString("AIG_NAME"));
        tableMap.put("para_type", rs.getString("PARA_TYPE"));
        tableMap.put("parent_id", rs.getString("parent_id"));
        tableMap.put("aig_type", rs.getString("aig_type"));
        tableMap.put("para_vale", rs.getString("PARA_VALE") == null ? "" : rs.getString("PARA_VALE"));
        tableMap.put("para_valeper", rs.getString("PARA_VALEPER") == null ? "" : rs.getString("PARA_VALEPER"));
        tableMap.put("leaf", rs.getString("leaf"));
        importList.add(tableMap);
      }
      rs.close();
      pstmt.close();
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new RuntimeException("getRFfcAIGImport：" + ex.getMessage());
    } finally {
      conn.close();
    }
    return importList;
  }

  public HashMap<?, ?> getRFfcAIGTablePara_valeper(String rfc_id)
    throws Exception
  {
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Connection conn = reader.getConnection();
    HashMap tableMap = new HashMap();
    try {
      String sql = "select PARA_NAME,AIG_NAME,PARA_ID,PARA_VALE,(SELECT PARA_NAME FROM sap_rfctables b WHERE b.PARA_ID=a.PARENT_ID) PARENT_PARA_NAME,(SELECT AIG_NAME FROM sap_rfctables b WHERE b.PARA_ID=a.PARENT_ID) PARENT_AIG_NAME ,PARA_VALEPER, PARA_REMARK from sap_rfctables a where RFC_ID=? and  PARA_VALEPER IS NOT NULL AND PARA_VALEPER <> ''";
      PreparedStatement pstmt = conn.prepareStatement(sql);
      pstmt.setString(1, rfc_id);
      ResultSet rs = pstmt.executeQuery();
      while (rs.next())
      {
        tableMap.put("aig_tablename", rs.getString("PARENT_AIG_NAME"));
        tableMap.put("para_value", rs.getString("PARA_VALE"));
        
        tableMap.put("aig_fieldname", rs.getString("AIG_NAME"));
        tableMap.put("sap_tablename", rs.getString("PARENT_PARA_NAME"));
        tableMap.put("sap_fieldname", rs.getString("PARA_NAME"));
        tableMap.put("para_valeper", rs.getString("PARA_VALEPER"));
        tableMap.put("para_remark", rs.getString("PARA_REMARK"));
      }
      rs.close();
      pstmt.close();
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new RuntimeException("getRFfcAIGTablePara_valeper：" + ex.getMessage());
    } finally {
      conn.close();
    }
    return tableMap;
  }

  public HashMap<?, ?> getRFfcAIGTableAddedColumn(String rfc_id)
    throws Exception
  {
    IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
    Connection conn = reader.getConnection();
    HashMap tableMap = new HashMap();
    try {
      String sql = "select PARA_NAME,AIG_NAME,PARA_ID,PARA_VALE,(SELECT PARA_NAME FROM sap_rfctables b WHERE b.PARA_ID=a.PARENT_ID) PARENT_PARA_NAME,(SELECT AIG_NAME FROM sap_rfctables b WHERE b.PARA_ID=a.PARENT_ID) PARENT_AIG_NAME ,PARA_VALEPER, PARA_REMARK from sap_rfctables a where RFC_ID=? and ADDEDCOLUMN = 1";
      PreparedStatement pstmt = conn.prepareStatement(sql);
      pstmt.setString(1, rfc_id);
      ResultSet rs = pstmt.executeQuery();
      while (rs.next())
      {
        tableMap.put("aig_tablename", rs.getString("PARENT_AIG_NAME"));
        tableMap.put("para_value", rs.getString("PARA_VALE"));
        tableMap.put("aig_fieldname", rs.getString("AIG_NAME"));
        tableMap.put("sap_tablename", rs.getString("PARENT_PARA_NAME"));
        tableMap.put("sap_fieldname", rs.getString("PARA_NAME"));
      }
      rs.close();
      pstmt.close();
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new RuntimeException("getRFfcAIGTableAddedColumn：" + ex.getMessage());
    } finally {
      conn.close();
    }
    return tableMap;
  }
}