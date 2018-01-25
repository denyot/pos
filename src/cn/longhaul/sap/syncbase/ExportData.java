package cn.longhaul.sap.syncbase;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

public class ExportData
{
  public static List<Object> writeExcel(String filePath, String fileName, ArrayList<?> dataresult, RFCInfo rfcinfo)
    throws Exception
  {
    List result = new ArrayList();
    WritableWorkbook wwb = null;
    try {
      ArrayList rfcTableList = rfcinfo.getRfcTableList();
      if (rfcTableList != null)
      {
        wwb = Workbook.createWorkbook(new File(filePath + "/" + 
          fileName));
        for (int k = 0; k < rfcTableList.size(); k++) {
          RfcTable rfctable = (RfcTable)rfcTableList.get(k);
          WritableSheet ws = wwb.createSheet(rfctable.getTablename(), k);
          int rowhead = 0;
          ArrayList rfctableinfo = rfctable.getRfcTableinfo();

          for (int i = 0; i < rfctableinfo.size(); i++) {
            RFCFieldInfo rfcfieldinfo = 
              (RFCFieldInfo)rfctableinfo
              .get(i);
            HashMap m = new HashMap();
            m.put(Integer.valueOf(rowhead + 1), 
              rfcfieldinfo.getMapfiledDescription());
            Label label = new Label(rowhead, 0, 
              rfcfieldinfo.getMapfiledDescription());
            ws.addCell(label);
            rowhead++;
          }

          int rowNumber = 1;
          int cellNumber = 1;
          for (int i = 0; i < dataresult.size(); i++) {
            Label label = null;
            HashMap hd = (HashMap)dataresult.get(i);
            cellNumber = 0;
            for (int j = 0; j < rfctableinfo.size(); j++) {
              RFCFieldInfo rfcfieldinfo = 
                (RFCFieldInfo)rfctableinfo
                .get(j);
              String value = hd.get(rfcfieldinfo.getFieldName())
                .toString();
              label = new Label(cellNumber++, rowNumber, value);
              ws.addCell(label);
            }
            rowNumber++;
          }
          wwb.write();
        }
      }
    } catch (Exception e) {
      result = null;
      e.printStackTrace();
    } finally {
      wwb.close();
    }

    return result;
  }
}