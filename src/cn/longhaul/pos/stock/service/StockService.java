package cn.longhaul.pos.stock.service;

import java.util.List;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface StockService {
	public abstract boolean insertOutStockInfo(Dto paramDto, List<Dto> paramList)
			throws Exception;

	public abstract boolean insertRecieveGoodInfo(Dto paramDto,
			List<Dto> paramList) throws Exception;

	public abstract boolean insertOutStockInfoForYHP(Dto paramDto,
			List<Dto> paramList) throws Exception;

	public abstract boolean updateRecieveManage(List<Dto> paramList)
			throws Exception;

	public abstract Dto instock(Dto paramDto, List<Dto> paramList)
			throws Exception;

	public abstract boolean updateOutStockInfo(Dto paramDto, List<Dto> paramList);

	public abstract Dto submitItemsManageResult(Dto paramDto,
			List<Dto> paramList) throws Exception;

	public abstract void submitOutStockItemManage(Dto paramDto,
			List<Dto> paramList);

	public abstract void submitInStockItemManageResult(Dto paramDto,
			List<Dto> paramList) throws Exception;

	public abstract void submitMoveLgort(List<Dto> paramList);

	public abstract void submitNoPriceOutStock(Dto paramDto, List<Dto> paramList)
			throws Exception;

	public abstract void submitNoPriceMoveLgort(Dto paramDto,
			List<Dto> paramList);

	public abstract void rejTo1000(Dto paramDto, List<Dto> paramList)
			throws Exception;

	public abstract void updateNoPriceOutStock(Dto paramDto, List<Dto> paramList);

	public abstract void submitTransfer(Dto paramDto, List<Dto> paramList);

	public abstract void updatePriceStatus(List<Dto> paramList)
			throws Exception;

	public abstract void fillStockToStockTaking(String paramString1,
			String paramString2);

	public abstract void moveLgortForHeadResult(List<Dto> paramList);

	public abstract Dto submitInStockHeadManageResult(List<Dto> paramList)
			throws Exception;

	public abstract void saveJoinnerReturnOrder(Dto paramDto, List<Dto> paramList);
	
	public abstract void submitJoinnerReturnOrder(Dto paramDto);
	
	public abstract void sendJoinnerReturnOrder(Dto paramDto);
	
	public abstract void deleteJoinnerReturnStore(Dto paramDto);
	
	public abstract void returnJoinnerReturnOrder(Dto paramDto);
	
	public abstract void deleteJoinnerReturnOrder(Dto paramDto);
	
	public abstract void deleteStockTransferOrder(Dto paramDto);
	
	public abstract void deleteStockTransferOrderItem(Dto paramDto);

	public abstract void updateOutStockInfoFro1000(Dto paramDto, List<Dto> paramList);
}