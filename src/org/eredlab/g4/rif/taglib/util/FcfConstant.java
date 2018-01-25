package org.eredlab.g4.rif.taglib.util;

import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class FcfConstant {
	private static final String COLUMN_2D = "2DC";
	private static final String COLUMN_3D = "3DC";
	private static final String COLUMN_2D_MS = "2DC_MS";
	private static final String COLUMN_3D_MS = "3DC_MS";
	private static final String LINE_COLUMN_2D_MS = "2DLC_MS";
	private static final String LINE_COLUMN_3D_MS = "3DLC_MS";
	private static final String LINE = "L";
	private static final String LINE_MS = "L_MS";
	private static final String PIE_2D = "2DP";
	private static final String PIE_3D = "3DP";
	private static final String AREA = "A";
	private static final String AREA_MS = "A_MS";
	private static final String CIRCULARITY = "C";
	private static final String FUNNEL = "F";
	private static final String BAR_2D = "2DB";
	private static final String BAR_2D_MS = "2DB_MS";
	private static Dto typeDto = new BaseDto();

	static {
		typeDto.put("2DC", "Column2D.swf");
		typeDto.put("3DC", "Column3D.swf");
		typeDto.put("L", "Line.swf");
		typeDto.put("A", "Area2D.swf");
		typeDto.put("2DP", "Pie2D.swf");
		typeDto.put("3DP", "Pie3D.swf");
		typeDto.put("C", "Doughnut2D.swf");
		typeDto.put("2DC_MS", "MSColumn2D.swf");
		typeDto.put("3DC_MS", "MSColumn3D.swf");
		typeDto.put("A_MS", "MSArea.swf");
		typeDto.put("L_MS", "MSLine.swf");
		typeDto.put("3DLC_MS", "MSColumn3DLineDY.swf");
		typeDto.put("2DB", "Bar2D.swf");
		typeDto.put("2DB_MS", "MSBar2D.swf");
	}

	public static String getReportModel(String pType) {
		return typeDto.getAsString(pType);
	}
}