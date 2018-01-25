package cn.longhaul.sap.system.datasyn;

import cn.longhaul.job.expression.ExpressionExecute;
import cn.longhaul.sap.db.RFCDataSaveServiceImpl;
import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class DataSynToAIGServiceImpl implements DataSynToAIGService
{
  private static Log log = LogFactory.getLog(DataSynToAIGServiceImpl.class);
  private String parameterName;
  private HashMap<?, ?> tableAddedColumn;

  public boolean dataSyncToAigService(String rfc_name)
    throws Exception
  {
    try
    {
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
      int pagesize = 1000;
      RFCDataSaveServiceImpl dataservice = new RFCDataSaveServiceImpl();
      Map param = new HashMap();
      String rfc_id = dataservice.getRfcID(rfc_name);
      AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
      AigTransferParameter pagerfcimport = rfctransferinfo.getTransParameter();
      AigTransferStructure importstructure = null;
      ArrayList rootList = dataservice.getRFfcAIGImport(rfc_id, "0");

      HashMap tableParaValeper = dataservice.getRFfcAIGTablePara_valeper(rfc_id);

      this.tableAddedColumn = dataservice.getRFfcAIGTableAddedColumn(rfc_id);

      if ((tableParaValeper != null) && (tableParaValeper.size() > 0))
      {
        String para_value = (tableParaValeper.get("para_value") == null) || ("".equals(tableParaValeper.get("para_value"))) ? "3500" : tableParaValeper.get("para_value").toString().trim();

        String sap_tablename = tableParaValeper.get("sap_tablename").toString().trim();
        String sap_fieldname = tableParaValeper.get("sap_fieldname").toString().trim();
        String para_valeper = tableParaValeper.get("para_valeper").toString().trim();

        Dto dto = new BaseDto();
        Integer dataCount = (Integer)ExpressionExecute.execute("pageCount" + para_valeper);
        Integer pageCount = Integer.valueOf(dataCount.intValue() % Integer.parseInt(para_value) == 0 ? dataCount.intValue() / Integer.parseInt(para_value) : dataCount.intValue() / Integer.parseInt(para_value) + 1);

        for (int i = 0; i < pageCount.intValue(); i++)
        {
          int start = Integer.parseInt(para_value) * i;
          String limit = para_value;

          dto.put("start", Integer.valueOf(start));
          dto.put("limit", limit);

          List list = (List)ExpressionExecute.execute(para_valeper, dto);

          AigTransferTable table = rfctransferinfo.getTable(sap_tablename);

          ArrayList tableValueList = new ArrayList();
          for (int j = 0; j < list.size(); j++) {
            HashMap map = new HashMap();
            map.put(sap_fieldname, list.get(j));
            tableValueList.add(map);
          }
          table.setMetaData(tableValueList);
          rfctransferinfo.appendTable(table);
          dataSave(rfc_name, rfc_id, rfctransferinfo);
        }
      }
      else
      {
        boolean isPages = false;
        for (int i = 0; i < rootList.size(); i++) {
          HashMap tableMap = (HashMap)rootList.get(i);
          if (tableMap != null) {
            String para_name = tableMap.get("para_name").toString();
            String para_value = tableMap.get("para_vale").toString();
            String para_valeper = tableMap.get("para_valeper").toString();

            String para_id = tableMap.get("para_id").toString();

            if (tableMap.get("leaf").toString().equals("1")) {
              if (!tableMap.get("para_type").toString().equals("com.sap.conn.jco.JCoStructure")) {
                if (!para_value.equals("")) {
                  rfcimport.setParameter(para_name, para_value);
                  pagerfcimport.setParameter(para_name, para_value);
                }
                System.out.println(para_valeper);
                if (!"".equals(para_valeper)) {
                  param.put(para_name, ExpressionExecute.execute(para_valeper));
                  this.parameterName = para_name;
                }
              }
            } else {
              if (tableMap.get("para_type").toString().equals("com.sap.conn.jco.JCoStructure")) {
                importstructure = rfcimport.getTransStructure(para_name);
                ArrayList treeList = dataservice.getRFfcAIGImport(rfc_id, para_id);
                for (int j = 0; j < treeList.size(); j++) {
                  HashMap treeMap = (HashMap)treeList.get(j);
                  String treepara_name = treeMap.get("para_name").toString();
                  String treepara_value = treeMap.get("para_vale").toString();
                  importstructure.setValue(treepara_name, treepara_value);
                  if ((para_name.equals("I_PAGES")) && 
                    (treepara_name.equals("PAGESIZE"))) {
                    pagesize = Integer.parseInt(treepara_value.equals("") ? "1000" : treepara_value);
                  }
                }
              }

              if (para_name.equals("I_PAGES")) {
                pagerfcimport.appendStructure(importstructure);
                isPages = true;
              }
              rfcimport.appendStructure(importstructure);
              rfctransferinfo.setImportPara(rfcimport);
            }
          }
        }

        if (param.size() != 0)
        {
          List value;
          int i;
          for (Iterator it = param.keySet().iterator(); it.hasNext();)
          {
            Object key = it.next();
            value = (List)param.get(key);

            i = 0; 
            continue;

//            rfctransferinfo.getImportPara().getParameters().put(key.toString(), value.get(i));
//            if (isPages) {
//              log.info("分页");
//
//              for (int j = 0; j < pagerfcimport.getStructureList().size(); j++)
//                if ("I_PAGES".equals(((AigTransferStructure)pagerfcimport.getStructureList().get(j)).getStructureName()))
//                  ((AigTransferStructure)pagerfcimport.getStructureList().get(j)).getStructureMap().put("KEY1", "");
//              pageDataSave(rfc_name, rfc_id, rfctransferinfo, importstructure, rfcimport, pagerfcimport, pagesize);
//            } else {
//              log.info("不分页");
//
//              dataSave(rfc_name, rfc_id, rfctransferinfo);
//            }
//            i++;
          }

        }
        else if (isPages) {
          log.info("分页");

          pageDataSave(rfc_name, rfc_id, rfctransferinfo, importstructure, rfcimport, pagerfcimport, pagesize);
        } else {
          log.info("不分页");

          dataSave(rfc_name, rfc_id, rfctransferinfo);
        }
      }

    }
    catch (RuntimeException e)
    {
      e.printStackTrace();
      throw new RuntimeException("DataSynToAIGServiceImpl(class)->dataSyncToAigService方法:" + e.getMessage());
    }
    return true;
  }

  public boolean dataSave(String rfc_name, String rfc_id, AigTransferInfo rfctransferinfo)
    throws Exception
  {
    AigTransferInfo outinfo = null;
    SapTransferImpl transferservice = new SapTransferImpl();
    outinfo = transferservice.transferInfoAig(rfc_name, rfctransferinfo);
    ArrayList tableList = outinfo.getTableList();
    log.info("得到输出完成" + tableList.size());
    RFCDataSaveServiceImpl dataservice = new RFCDataSaveServiceImpl();
    HashMap tablmap = dataservice.getRFfcAIGTable(rfc_id);
    for (int i = 0; i < tableList.size(); i++) {
      ArrayList onesTable = ((AigTransferTable)tableList.get(i)).getMetaData();
      String rfc_table_name = ((AigTransferTable)tableList.get(i)).getName();
      String aig_table = tablmap.get(rfc_table_name) == null ? "" : tablmap.get(rfc_table_name).toString();
      RFCDataSaveServiceImpl service = new RFCDataSaveServiceImpl();

      if (!aig_table.equals(""))
        service.rfcDataSave(onesTable, rfc_id, aig_table);
    }
    return true;
  }

  public boolean pageDataSave(String rfc_name, String rfc_id, AigTransferInfo rfctransferinfo, AigTransferStructure importstructure, AigTransferParameter rfcimport, AigTransferParameter pagerfcimport, int pagesize)
    throws Exception
  {
    AigTransferInfo outinfo = null;
    int lines = 0;
    int pages = 1;
    SapTransferImpl transferservice = new SapTransferImpl();
    outinfo = transferservice.transferInfoAig(rfc_name, rfctransferinfo);
    RFCDataSaveServiceImpl dataservice = new RFCDataSaveServiceImpl();
    HashMap tablmap = dataservice.getRFfcAIGTable(rfc_id);
    tablmap = dataservice.getRFfcAIGTable(rfc_id);
    ArrayList tableList = outinfo.getTableList();

    dataservice = new RFCDataSaveServiceImpl();
    tablmap = dataservice.getRFfcAIGTable(rfc_id);
    System.out.println("分页信息：" + outinfo.getAigStructure("U_PAGES"));

    Connection con = null;
    try {
      IReader reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
      con = reader.getConnection();
      con.setAutoCommit(false);
      Statement statement = con.createStatement();
      for (int i = 0; i < tableList.size(); i++) {
        ArrayList onesTable = ((AigTransferTable)tableList.get(i)).getMetaData();

        if ((this.tableAddedColumn != null) && (this.tableAddedColumn.size() > 0)) {
          String aig_fieldname = this.tableAddedColumn.get("aig_fieldname").toString().trim();
          String sap_tablename = this.tableAddedColumn.get("sap_tablename").toString().trim();

          for (int j = 0; j < onesTable.size(); j++) {
            if (sap_tablename.equals(((AigTransferTable)tableList.get(i)).getName())) {
              HashMap column = (HashMap)onesTable.get(j);
              column.put(aig_fieldname, rfctransferinfo.getImportPara().getParameters().get(this.parameterName));
            }
          }
        }

        String rfc_table_name = ((AigTransferTable)tableList.get(i)).getName();
        String aig_table = tablmap.get(rfc_table_name) == null ? "" : tablmap.get(rfc_table_name).toString();
        RFCDataSaveServiceImpl service = new RFCDataSaveServiceImpl();

        if ((!aig_table.equals("")) && (
          ("z_rfc_store_20_gt_stock".equalsIgnoreCase(aig_table)) || ("z_rfc_store_46_it_stock".equalsIgnoreCase(aig_table)) || 
          ("z_rfc_store_48_it_stock".equalsIgnoreCase(aig_table)) || ("z_rfc_store_04_gt_zpcjg".equalsIgnoreCase(aig_table)) || 
          ("z_rfc_store_23_gt_zcsmx".equalsIgnoreCase(aig_table)) || ("z_rfc_store_54_it_z087".equalsIgnoreCase(aig_table)))) {
          String deletesql = "DELETE FROM " + aig_table;
          statement.addBatch(deletesql);
        }

      }

      statement.executeBatch();
      statement.close();
      con.commit();
    } catch (Exception e) {
      log.error("获取删除整个表连接时出现错误！" + e.getMessage());
      e.printStackTrace();
    }
    finally {
      if ((G4Utils.isNotEmpty(con)) && (!con.isClosed())) con.close();
    }

    do
    {
      transferservice = new SapTransferImpl();
      outinfo = transferservice.transferInfoAig(rfc_name, rfctransferinfo);
      tableList = outinfo.getTableList();
      dataservice = new RFCDataSaveServiceImpl();
      tablmap = dataservice.getRFfcAIGTable(rfc_id);
      System.out.println("分页信息：" + outinfo.getAigStructure("U_PAGES"));
      for (int i = 0; i < tableList.size(); i++) {
        ArrayList onesTable = ((AigTransferTable)tableList.get(i)).getMetaData();

        if ((this.tableAddedColumn != null) && (this.tableAddedColumn.size() > 0)) {
          String aig_fieldname = this.tableAddedColumn.get("aig_fieldname").toString().trim();
          String sap_tablename = this.tableAddedColumn.get("sap_tablename").toString().trim();

          for (int j = 0; j < onesTable.size(); j++) {
            if (sap_tablename.equals(((AigTransferTable)tableList.get(i)).getName())) {
              HashMap column = (HashMap)onesTable.get(j);
              column.put(aig_fieldname, rfctransferinfo.getImportPara().getParameters().get(this.parameterName));
            }
          }
        }

        String rfc_table_name = ((AigTransferTable)tableList.get(i)).getName();
        String aig_table = tablmap.get(rfc_table_name) == null ? "" : tablmap.get(rfc_table_name).toString();
        RFCDataSaveServiceImpl service = new RFCDataSaveServiceImpl();

        if (!aig_table.equals(""))
          service.rfcDataSave(onesTable, rfc_id, aig_table);
      }
      log.info("分页信息：" + outinfo.getAigStructure("U_PAGES"));
      HashMap outPageMap = (HashMap)outinfo.getAigStructure("U_PAGES");
      lines = Integer.valueOf(outPageMap.get("LINES").toString()).intValue();
      importstructure = rfcimport.getTransStructure("I_PAGES");
      importstructure.setStructureMap(outPageMap);

      ArrayList structureList = pagerfcimport.getStructureList();
      structureList.set(0, importstructure);
      pagerfcimport.setStructureList(structureList);
      rfctransferinfo.setImportPara(pagerfcimport);
      System.out.println("第(" + pages + ")页当前页" + lines + "条每次:" + pagesize + "条");
      log.info("第(" + pages + ")页当前页" + lines + "条每次:" + pagesize + "条");
      pages++;
    }while (lines >= pagesize);
    return true;
  }
}