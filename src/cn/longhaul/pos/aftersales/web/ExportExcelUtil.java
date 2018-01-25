package cn.longhaul.pos.aftersales.web;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.security.CodeSource;
import java.security.ProtectionDomain;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFComment;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.mortbay.log.Log;

public class ExportExcelUtil {
//	public static void export2FactoryOrPurchase(String title, String[] headers, String[] fieldProperties, Collection<Dto> dataset, OutputStream out, HttpServletResponse response, String pattern, String exporttype, String service_type)
//    throws IOException, IllegalAccessException
//  {
//    HSSFWorkbook workbook = new HSSFWorkbook();
//    HSSFSheet sheet = workbook.createSheet(title);
//
//    sheet.setDefaultColumnWidth((short)12);
//    HSSFCellStyle style1 = getStyle1(workbook);
//    HSSFCellStyle style3 = getStyle3(workbook);
//
//    HSSFRow row0 = sheet.createRow(0);
//    sheet.addMergedRegion(new CellRangeAddress(0, 2, 0, 3));
//    HSSFCell cell_0_0 = row0.createCell(0);
//    cell_0_0.setCellValue("顾客资料");
//    sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, 19));
//    HSSFCell cell_0_4 = row0.createCell(4);
//    if ("3".equals(service_type)) {
//      cell_0_4.setCellValue("顾客配对下单表");
//      headers[0] = "配对单号";
//    } else {
//      cell_0_4.setCellValue("顾客改款下单表");
//    }
//
//    cell_0_0.setCellStyle(style1);
//    cell_0_4.setCellStyle(style1);
//    row0.createCell(1).setCellStyle(style1);
//    row0.createCell(2).setCellStyle(style1);
//    row0.createCell(3).setCellStyle(style1);
//    row0.createCell(5).setCellStyle(style1);
//    row0.createCell(6).setCellStyle(style1);
//    row0.createCell(7).setCellStyle(style1);
//    row0.createCell(8).setCellStyle(style1);
//    row0.createCell(9).setCellStyle(style1);
//    row0.createCell(10).setCellStyle(style1);
//    row0.createCell(11).setCellStyle(style1);
//    row0.createCell(12).setCellStyle(style1);
//    row0.createCell(13).setCellStyle(style1);
//    row0.createCell(14).setCellStyle(style1);
//    row0.createCell(15).setCellStyle(style1);
//    row0.createCell(16).setCellStyle(style1);
//    row0.createCell(17).setCellStyle(style1);
//    row0.createCell(18).setCellStyle(style1);
//    row0.createCell(19).setCellStyle(style1);
//
//    HSSFRow row1 = sheet.createRow(1);
//    sheet.addMergedRegion(new CellRangeAddress(1, 1, 4, 8));
//    HSSFCell cell_1_4 = row1.createCell(4);
//    cell_1_4.setCellValue("改款前信息");
//
//    sheet.addMergedRegion(new CellRangeAddress(1, 1, 9, 19));
//    HSSFCell cell_1_9 = row1.createCell(9);
//    cell_1_9.setCellValue("改款后信息");
//
//    cell_1_4.setCellStyle(style1);
//    cell_1_9.setCellStyle(style1);
//    row1.createCell(0).setCellStyle(style1);
//    row1.createCell(1).setCellStyle(style1);
//    row1.createCell(2).setCellStyle(style1);
//    row1.createCell(3).setCellStyle(style1);
//
//    row1.createCell(5).setCellStyle(style1);
//    row1.createCell(6).setCellStyle(style1);
//    row1.createCell(7).setCellStyle(style1);
//    row1.createCell(8).setCellStyle(style1);
//    row1.createCell(10).setCellStyle(style1);
//    row1.createCell(11).setCellStyle(style1);
//    row1.createCell(12).setCellStyle(style1);
//    row1.createCell(13).setCellStyle(style1);
//    row1.createCell(14).setCellStyle(style1);
//    row1.createCell(15).setCellStyle(style1);
//    row1.createCell(16).setCellStyle(style1);
//    row1.createCell(17).setCellStyle(style1);
//    row1.createCell(18).setCellStyle(style1);
//    row1.createCell(19).setCellStyle(style1);
//
//    HSSFRow row2 = sheet.createRow(2);
//    sheet.addMergedRegion(new CellRangeAddress(2, 2, 4, 5));
//
//    HSSFCell cell_2_6 = row2.createCell(6);
//    sheet.addMergedRegion(new CellRangeAddress(2, 2, 6, 8));
//
//    sheet.addMergedRegion(new CellRangeAddress(2, 2, 9, 11));
//    HSSFCell cell_2_9 = row2.createCell(9);
//    cell_2_9.setCellValue("制单日期:");
//
//    cell_2_6.setCellStyle(style1);
//    cell_2_9.setCellStyle(style1);
//    row2.createCell(0).setCellStyle(style1);
//    row2.createCell(1).setCellStyle(style1);
//    row2.createCell(2).setCellStyle(style1);
//    row2.createCell(3).setCellStyle(style1);
//    row2.createCell(5).setCellStyle(style1);
//    row2.createCell(7).setCellStyle(style1);
//    row2.createCell(8).setCellStyle(style1);
//    row2.createCell(10).setCellStyle(style1);
//    row2.createCell(11).setCellStyle(style1);
//    row2.createCell(12).setCellStyle(style1);
//    row2.createCell(13).setCellStyle(style1);
//    row2.createCell(14).setCellStyle(style1);
//    row2.createCell(15).setCellStyle(style1);
//    row2.createCell(16).setCellStyle(style1);
//    row2.createCell(17).setCellStyle(style1);
//    row2.createCell(18).setCellStyle(style1);
//    row2.createCell(19).setCellStyle(style1);
//    int startRow = 3;
//
//    HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
//
//    HSSFRow row = sheet.createRow(startRow);
//    for (int i = 0; i < headers.length; i++) {
//      HSSFCell cell = row.createCell(i);
//      cell.setCellStyle(style1);
//      HSSFRichTextString text = new HSSFRichTextString(headers[i]);
//      cell.setCellValue(text);
//    }
//
//    Iterator it = dataset.iterator();
//    short i;
//    for (; it.hasNext(); i < (short) fieldProperties.length)
//    {
//      startRow++;
//      row = sheet.createRow(startRow);
//      row.setHeight((short)1200);
//      Dto t = (Dto)it.next();
//      i = 0; continue;
//      if (i == 7) {
//        HSSFCell cell = row.createCell(i);
//        cell.setCellStyle(style3);
//        cell.setCellValue(1.0D);
//      } else if (i == 19) {
//        try {
//          String path = new ExportExcelUtil().getWebRoot() + "sappic/";
//          String picName = t.getAsString(fieldProperties[i]);
//          if (picName != "") {
//            File file = new File(path + picName);
//            ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();
//            BufferedImage bufferImg = ImageIO.read(file);
//            String ss = picName.substring(picName.lastIndexOf(".") + 1);
//            if ("JPG".equalsIgnoreCase(ss)) {
//              ImageIO.write(bufferImg, "JPG", byteArrayOut);
//              HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 1020, 250, i, startRow, 
//                i, startRow);
//
//              patriarch.createPicture(anchor, workbook.addPicture(byteArrayOut.toByteArray(), 
//                5));
//            }
//            else if ("PNG".equalsIgnoreCase(ss)) {
//              ImageIO.write(bufferImg, "PNG", byteArrayOut);
//              HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 1020, 250, i, startRow, 
//                i, startRow);
//              patriarch.createPicture(anchor, workbook.addPicture(byteArrayOut.toByteArray(), 
//                6));
//            }
//          } else {
//            row.createCell(i).setCellValue("无");
//          }
//        } catch (Exception e) {
//          Log.debug("导出图片时候出现错误：" + e.getMessage());
//          e.printStackTrace();
//        }
//      } else {
//        HSSFCell cell = row.createCell(i);
//        cell.setCellStyle(style3);
//        cell.setCellValue(t.getAsString(fieldProperties[i]));
//      }
//      i = (short)(i + 1);
//    }
//
//    if ("factory".equals(exporttype)) {
//      int signRowIndex = startRow + 2;
//      HSSFRow signRow1 = sheet.createRow(signRowIndex);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex, signRowIndex, 0, 5));
//      HSSFCell signCell1 = signRow1.createCell(0);
//      signCell1.setCellValue("工厂收货人________________________");
//      HSSFRow signRow2 = sheet.createRow(signRowIndex + 2);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex + 2, signRowIndex + 2, 0, 5));
//      HSSFCell signCell2 = signRow2.createCell(0);
//      signCell2.setCellValue("工厂日期________________________");
//      HSSFRow signRow3 = sheet.createRow(signRowIndex + 4);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex + 4, signRowIndex + 4, 0, 5));
//      HSSFCell signCell3 = signRow3.createCell(0);
//      signCell3.setCellValue("工厂预计出货日期________________________");
//    } else {
//      int signRowIndex = startRow + 2;
//      HSSFRow signRow1 = sheet.createRow(signRowIndex);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex, signRowIndex, 0, 5));
//      HSSFCell signCell1 = signRow1.createCell(0);
//      signCell1.setCellValue("采购部接收人________________________");
//      HSSFRow signRow2 = sheet.createRow(signRowIndex + 2);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex + 2, signRowIndex + 2, 0, 5));
//      HSSFCell signCell2 = signRow2.createCell(0);
//      signCell2.setCellValue("采购部接收日期________________________");
//    }
//    try {
//      workbook.write(out);
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
//  }

//	public static void export2FactoryOrPurchaseRepair(String title, String[] headers, String[] fieldProperties, Collection<Dto> dataset, OutputStream out, HttpServletResponse response, String pattern, String exporttype, String service_type)
//    throws IOException, IllegalAccessException
//  {
//    HSSFWorkbook workbook = new HSSFWorkbook();
//    HSSFSheet sheet = workbook.createSheet(title);
//
//    sheet.setDefaultColumnWidth((short)12);
//    HSSFCellStyle style1 = getStyle1(workbook);
//    HSSFCellStyle style3 = getStyle3(workbook);
//    int startRow = 0;
//    HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
//    HSSFRow row = sheet.createRow(startRow);
//    for (short i = 0; i < headers.length; i = (short)(i + 1)) {
//      HSSFCell cell = row.createCell(i);
//      cell.setCellStyle(style1);
//      HSSFRichTextString text = new HSSFRichTextString(headers[i]);
//      cell.setCellValue(text);
//    }
//
//    Iterator it = dataset.iterator();
//    SimpleDateFormat formater = new SimpleDateFormat("yyyy-MM-dd");
//    short i;
//    for (; it.hasNext(); 
//      i < fieldProperties.length)
//    {
//      startRow++;
//      row = sheet.createRow(startRow);
//      row.setHeight((short)1200);
//      Dto t = (Dto)it.next();
//      i = 0; continue;
//
//      if (i == 11) {
//        HSSFCell cell = row.createCell(i);
//        cell.setCellStyle(style3);
//        cell.setCellValue(formater.format(new Date()));
//      } else if (i == 13) {
//        String path = new ExportExcelUtil().getWebRoot() + "sappic/";
//        String picName = t.getAsString(fieldProperties[i]);
//        try {
//          if (picName == "") break label551;
//          File file = new File(path + picName);
//          ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();
//          BufferedImage bufferImg = ImageIO.read(file);
//          String ss = picName.substring(picName.lastIndexOf(".") + 1);
//          if ("JPG".equalsIgnoreCase(ss)) {
//            ImageIO.write(bufferImg, "JPG", byteArrayOut);
//            HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 1020, 250, i, startRow, 
//              i, startRow);
//            patriarch.createPicture(anchor, workbook.addPicture(byteArrayOut.toByteArray(), 
//              5));
//          } else if ("PNG".equalsIgnoreCase(ss)) {
//            ImageIO.write(bufferImg, "PNG", byteArrayOut);
//            HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 1020, 250, i, startRow, 
//              i, startRow);
//            patriarch.createPicture(anchor, workbook.addPicture(byteArrayOut.toByteArray(), 
//              6));
//          } else {
//            row.createCell(i).setCellValue("无");
//          }
//        }
//        catch (Exception e) {
//          Log.debug("处理图片出现错误：" + e.getMessage());
//          e.printStackTrace();
//        }
//      } else {
//        HSSFCell cell = row.createCell(i);
//        cell.setCellStyle(style3);
//        cell.setCellValue(t.getAsString(fieldProperties[i]));
//      }
//      label551: i = (short)(i + 1);
//    }
//
//    if ("factory".equals(exporttype)) {
//      int signRowIndex = startRow + 2;
//      HSSFRow signRow1 = sheet.createRow(signRowIndex);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex, signRowIndex, 0, 5));
//      HSSFCell signCell1 = signRow1.createCell(0);
//      signCell1.setCellValue("工厂收货人________________________");
//      HSSFRow signRow2 = sheet.createRow(signRowIndex + 2);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex + 2, signRowIndex + 2, 0, 5));
//      HSSFCell signCell2 = signRow2.createCell(0);
//      signCell2.setCellValue("工厂日期________________________");
//      HSSFRow signRow3 = sheet.createRow(signRowIndex + 4);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex + 4, signRowIndex + 4, 0, 5));
//      HSSFCell signCell3 = signRow3.createCell(0);
//      signCell3.setCellValue("工厂预计出货日期________________________");
//    } else {
//      int signRowIndex = startRow + 2;
//      HSSFRow signRow1 = sheet.createRow(signRowIndex);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex, signRowIndex, 0, 5));
//      HSSFCell signCell1 = signRow1.createCell(0);
//      signCell1.setCellValue("采购部接收人________________________");
//      HSSFRow signRow2 = sheet.createRow(signRowIndex + 2);
//      sheet.addMergedRegion(new CellRangeAddress(signRowIndex + 2, signRowIndex + 2, 0, 5));
//      HSSFCell signCell2 = signRow2.createCell(0);
//      signCell2.setCellValue("采购部接收日期________________________");
//    }
//    try {
//      workbook.write(out);
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
//  }

//	public static void export2QualityDept(String title, String[] headers,
//			String[] fieldProperties, Collection<Dto> dataset,
//			OutputStream out, HttpServletResponse response, String pattern)
//			throws IOException, IllegalAccessException {
//		HSSFWorkbook workbook = new HSSFWorkbook();
//		HSSFSheet sheet = workbook.createSheet(title);
//		int startRow = 0;
//		exportExcel(title, headers, fieldProperties, dataset, out, response,
//				pattern, workbook, sheet, startRow);
//	}

//	public static void exportExcel(String title, String[] headers, String[] fieldProperties, Collection<Dto> dataset, OutputStream out, HttpServletResponse response, String pattern, HSSFWorkbook workbook, HSSFSheet sheet, int startRow)
//  {
//    sheet.setDefaultColumnWidth((short)15);
//
//    HSSFCellStyle style1 = getStyle1(workbook);
//
//    HSSFCellStyle style2 = getStyle2(workbook);
//
//    HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
//
//    HSSFComment comment = patriarch.createComment(new HSSFClientAnchor(0, 0, 0, 0, (short)4, 2, (short)6, 5));
//
//    comment.setAuthor("leno");
//
//    HSSFRow row = sheet.createRow(startRow);
//    for (short i = 0; i < headers.length; i = (short)(i + 1)) {
//      HSSFCell cell = row.createCell(i);
//      cell.setCellStyle(style1);
//      HSSFRichTextString text = new HSSFRichTextString(headers[i]);
//      cell.setCellValue(text);
//    }
//
//    Iterator it = dataset.iterator();
//    short i;
//    for (; it.hasNext(); 
//      i < fieldProperties.length)
//    {
//      startRow++;
//      row = sheet.createRow(startRow);
//      Dto t = (Dto)it.next();
//      i = 0; continue;
//      HSSFCell cell = row.createCell(i);
//      cell.setCellStyle(style2);
//      cell.setCellValue(t.getAsString(fieldProperties[i]));
//
//      i = (short)(i + 1);
//    }
//
//    try
//    {
//      workbook.write(out);
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
//  }

	public static HSSFCellStyle getStyle1(HSSFWorkbook workbook) {
		HSSFCellStyle style1 = workbook.createCellStyle();

		style1.setFillForegroundColor((short) 9);
		style1.setFillPattern((short) 1);
		style1.setBorderBottom((short) 1);
		style1.setBorderLeft((short) 1);
		style1.setBorderRight((short) 1);
		style1.setBorderTop((short) 1);
		style1.setAlignment((short) 2);

		HSSFFont font1 = workbook.createFont();
		font1.setColor((short) 20);
		font1.setFontHeightInPoints((short) 12);
		font1.setBoldweight((short) 700);

		style1.setFont(font1);
		return style1;
	}

	public static HSSFCellStyle getStyle2(HSSFWorkbook workbook) {
		HSSFCellStyle style2 = workbook.createCellStyle();
		style2.setFillForegroundColor((short) 9);
		style2.setFillPattern((short) 1);
		style2.setBorderBottom((short) 1);
		style2.setBorderLeft((short) 1);
		style2.setBorderRight((short) 1);
		style2.setBorderTop((short) 1);
		style2.setAlignment((short) 2);
		style2.setVerticalAlignment((short) 1);

		HSSFFont font2 = workbook.createFont();
		font2.setBoldweight((short) 400);

		style2.setFont(font2);
		return style2;
	}

	public static HSSFCellStyle getStyle3(HSSFWorkbook workbook) {
		HSSFCellStyle style3 = workbook.createCellStyle();
		style3.setFillForegroundColor((short) 9);
		style3.setFillPattern((short) 1);
		style3.setBorderBottom((short) 1);
		style3.setBorderLeft((short) 1);
		style3.setBorderRight((short) 1);
		style3.setBorderTop((short) 1);
		style3.setAlignment((short) 2);
		style3.setVerticalAlignment((short) 1);

		HSSFFont font3 = workbook.createFont();
		font3.setBoldweight((short) 400);

		style3.setFont(font3);
		return style3;
	}

	public String getWebRoot() throws IllegalAccessException {
		String path = getClass().getProtectionDomain().getCodeSource()
				.getLocation().getPath();
		if (path.indexOf("WEB-INF") > 0)
			path = path.substring(0, path.indexOf("WEB-INF/classes"));
		else {
			throw new IllegalAccessException("路径获取错误");
		}
		return path;
	}
}