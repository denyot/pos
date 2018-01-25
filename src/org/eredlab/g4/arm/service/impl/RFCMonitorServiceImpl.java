package org.eredlab.g4.arm.service.impl;

import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.aig.AigTransferTable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import javax.servlet.ServletRequest;
import org.eredlab.g4.arm.service.RFCMonitorService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class RFCMonitorServiceImpl extends BaseServiceImpl
  implements RFCMonitorService
{
  public void saveRfcInvokeInfo(Dto infoDto)
  {
    this.g4Dao.insert("RFCMonitor.insertRFCInfo", infoDto);
  }

  public int saveStartParam(String functionName, AigTransferInfo inTransferInfo, Date startTime, ServletRequest request)
  {
    StringBuffer inparam = new StringBuffer();
    Integer id = (Integer)this.g4Dao.queryForObject("RFCMonitor.getMaxId");
    String remoteAddr = request != null ? "调用端IP：" + request.getRemoteAddr() + ",字符编码:" + request.getCharacterEncoding() + ",端口：" + request.getRemotePort() : 
      "请求为空，没有获取到远程地址";
    if (id == null) {
      id = Integer.valueOf(100001);
    }

    if (inTransferInfo != null) {
      inparam.append("InParam:{");

      if (inTransferInfo.getImportPara().getParameters().size() != 0) {
        inparam.append("parameters:{");
        for (Iterator it = inTransferInfo.getImportPara().getParameters().keySet().iterator(); it.hasNext(); ) {
          String name = (String)it.next();
          Object value = inTransferInfo.getImportPara().getParameters().get(name);
          inparam.append(name + ":'" + value.toString() + "' ,");
        }

        String t = inparam.substring(0, inparam.length() - 1);
        inparam = new StringBuffer(t);
        inparam.append("},");
      }
      if (inTransferInfo.getImportPara().getStructureList().size() != 0) {
        inparam.append("structures:{");
        for (int i = 0; i < inTransferInfo.getImportPara().getStructureList().size(); i++) {
          AigTransferStructure para = (AigTransferStructure)inTransferInfo.getImportPara().getStructureList().get(i);
          String structName = para.getStructureName();
          if (para.getStructureMap().size() != 0) {
            inparam.append(structName + ":{");
            for (Iterator it = para.getStructureMap().keySet().iterator(); it.hasNext(); ) {
              String name = (String)it.next();
              Object value = para.getStructureMap().get(name);
              inparam.append(name + ":'" + value + "' ,");
            }

            String t = inparam.substring(0, inparam.length() - 1);
            inparam = new StringBuffer(t);
            inparam.append("},");
          }
        }
        String t = inparam.substring(0, inparam.length() - 1);
        inparam = new StringBuffer(t);
        inparam.append("},");
      }

      if (inTransferInfo.getTransParameter().getParameters().size() != 0) {
        inparam.append("transparameters:{");
        for (Iterator it = inTransferInfo.getTransParameter().getParameters().keySet().iterator(); it.hasNext(); ) {
          String name = (String)it.next();
          Object value = inTransferInfo.getTransParameter().getParameters().get(name);
          inparam.append(name + ":'" + value + "' ,");
        }

        String t = inparam.substring(0, inparam.length() - 1);
        inparam = new StringBuffer(t);
        inparam.append("},");
      }

      if (inTransferInfo.getTableList().size() != 0) {
        inparam.append("tables:{");
        for (int i = 0; i < inTransferInfo.getTableList().size(); i++) {
          AigTransferTable table = (AigTransferTable)inTransferInfo.getTableList().get(i);
          int row = table.getMetaData().size();
          String tableName = table.getName();
          inparam.append(tableName);
          inparam.append(":'");
          inparam.append(row);
          inparam.append("',");
        }

        String t = inparam.substring(0, inparam.length() - 1);
        inparam = new StringBuffer(t);
        inparam.append("},");
      }

      String t = inparam.substring(0, inparam.length() - 1);
      inparam = new StringBuffer(t);
      inparam.append("}");
    }

    Dto dto = new BaseDto();
    dto.put("funcname", functionName);
    dto.put("starttime", startTime);

    dto.put("inparam", inparam.toString());

    dto.put("id", id);

    dto.put("remoteaddr", remoteAddr);
    try
    {
      this.g4Dao.insert("RFCMonitor.insertStartRFCInfo", dto);
    } catch (Exception e) {
      e.printStackTrace();
    }

    return id.intValue();
  }

  public void clearAll()
  {
    this.g4Dao.delete("RFCMonitor.clearAllMsg");
  }

  public void saveEndParam(int id, AigTransferInfo outTransferInfo, Date startTime, Date endTime, String exceptionStr)
  {
    StringBuffer outparam = new StringBuffer();

    if (outTransferInfo != null) {
      outparam.append("OutParam:{");
      if (outTransferInfo.getExportPara().getParameters().size() != 0) {
        outparam.append("parameters:{");
        for (Iterator it = outTransferInfo.getExportPara().getParameters().keySet().iterator(); it.hasNext(); ) {
          String name = (String)it.next();
          Object value = outTransferInfo.getExportPara().getParameters().get(name);
          outparam.append(name + ":'" + value + "' ,");
        }

        String t = outparam.substring(0, outparam.length() - 1);
        outparam = new StringBuffer(t);
        outparam.append("},");
      }

      if (outTransferInfo.getExportPara().getStructureList().size() != 0) {
        outparam.append("structures:{");
        for (int i = 0; i < outTransferInfo.getExportPara().getStructureList().size(); i++) {
          AigTransferStructure para = (AigTransferStructure)outTransferInfo.getExportPara().getStructureList().get(i);
          String structName = para.getStructureName();
          if (para.getStructureMap().size() != 0) {
            outparam.append(structName + ":{");
            for (Iterator it = para.getStructureMap().keySet().iterator(); it.hasNext(); ) {
              String name = (String)it.next();
              Object value = para.getStructureMap().get(name);
              outparam.append(name + ":'" + value.toString() + "' ,");
            }

            String t = outparam.substring(0, outparam.length() - 1);
            outparam = new StringBuffer(t);
            outparam.append("},");
          }
        }
        String t = outparam.substring(0, outparam.length() - 1);
        outparam = new StringBuffer(t);
        outparam.append("},");
      }

      if (outTransferInfo.getTransParameter().getParameters().size() != 0) {
        outparam.append("transparameters:{");
        for (Iterator it = outTransferInfo.getTransParameter().getParameters().keySet().iterator(); it.hasNext(); ) {
          String name = (String)it.next();
          Object value = outTransferInfo.getTransParameter().getParameters().get(name);
          outparam.append(name + ":'" + value + "' ,");
        }

        String t = outparam.substring(0, outparam.length() - 1);
        outparam = new StringBuffer(t);
        outparam.append("},");
      }

      if (outTransferInfo.getTableList().size() != 0) {
        outparam.append("tables:{");
        for (int i = 0; i < outTransferInfo.getTableList().size(); i++) {
          AigTransferTable table = (AigTransferTable)outTransferInfo.getTableList().get(i);
          int row = table.getMetaData().size();
          String tableName = table.getName();
          outparam.append(tableName);
          outparam.append(":'");
          outparam.append(row);
          outparam.append("',");
        }
        String t = outparam.substring(0, outparam.length() - 1);
        outparam = new StringBuffer(t);
        outparam.append("},");
      }

      String t = outparam.substring(0, outparam.length() - 1);
      outparam = new StringBuffer(t);
      outparam.append("}");
    }

    double lastTime = (endTime.getTime() - startTime.getTime()) / 1000.0D;

    Dto dto = new BaseDto();

    dto.put("starttime", startTime);
    dto.put("endtime", endTime);
    dto.put("costtime", Double.valueOf(lastTime));

    dto.put("outparam", outparam.toString());
    dto.put("exceptionmsg", exceptionStr.toString());
    dto.put("id", Integer.valueOf(id));
    try {
      this.g4Dao.update("RFCMonitor.saveEndRFCInfo", dto);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}