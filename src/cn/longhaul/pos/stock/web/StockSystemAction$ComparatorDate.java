package cn.longhaul.pos.stock.web;

import java.util.Comparator;
import org.eredlab.g4.ccl.datastructure.Dto;

class StockSystemAction$ComparatorDate implements Comparator {
	StockSystemAction$ComparatorDate(StockSystemAction paramStockSystemAction) {
	}

	public int compare(Object o1, Object o2) {
		Dto dto1 = (Dto) o1;
		Dto dto2 = (Dto) o2;
		return dto1.getAsString("charg").compareTo(dto2.getAsString("charg"));
	}
}