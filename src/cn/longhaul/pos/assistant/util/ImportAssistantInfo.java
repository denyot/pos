package cn.longhaul.pos.assistant.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
//測試git
public class ImportAssistantInfo {




    public static List<Map<String, Object>> read(InputStream is)
            throws BiffException, IOException {
        List list = new ArrayList();
        Workbook wb = Workbook.getWorkbook(is);
        Sheet sheet = wb.getSheet(0);
        String metaData = "store_name,assistant_name,telephone,idno,position,rzsj";
        int rows = sheet.getRows();
        for (int k = 1; k < rows; k++) {
            Dto rowDto = new BaseDto();
            Cell[] cells = sheet.getRow(k);
            for (int j = 0; j < cells.length; j++) {
                String key = metaData.trim().split(",")[j];
                if (G4Utils.isNotEmpty(key)) {
                    rowDto.put(key, cells[j].getContents());
                }
            }

            list.add(rowDto);
        }

        return list;
    }
}