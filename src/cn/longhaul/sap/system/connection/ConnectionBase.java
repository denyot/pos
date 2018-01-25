package cn.longhaul.sap.system.connection;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import cn.longhaul.exception.LonghaulException;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.info.TransferInfo;
import cn.longhaul.sap.system.info.TransferParameter;
import cn.longhaul.sap.system.info.TransferStructure;
import cn.longhaul.sap.system.info.TransferTable;

import com.sap.conn.jco.AbapException;
import com.sap.conn.jco.JCoField;
import com.sap.conn.jco.JCoFieldIterator;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoMetaData;
import com.sap.conn.jco.JCoParameterFieldIterator;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoStructure;
import com.sap.conn.jco.JCoTable;

public class ConnectionBase {
	public ArrayList<HashMap<String, String>> getTableList(
			JCoParameterList paralist, String rfc_id) throws LonghaulException {
		ArrayList rfcImportParameterList = new ArrayList();
		JCoParameterFieldIterator itor = paralist.getParameterFieldIterator();
		HashMap paraList = null;
		int i = 0;
		JCoFieldIterator it;
		for (; itor.hasNextField(); it.hasNextField()) {
			JCoField tableName = itor.nextField();
			JCoTable returnuTable = paralist.getTable(tableName.getName());
			it = returnuTable.getFieldIterator();
			paraList = new HashMap();
			paraList.put("rfc_id", rfc_id);
			paraList.put("para_name", tableName.getName());
			paraList.put("aig_name", tableName.getName());
			paraList.put("para_type", tableName.getClassNameOfValue());
			paraList.put("aig_type", tableName.getClassNameOfValue());
			paraList.put("para_desc", tableName.getDescription());
			paraList.put("aig_desc", tableName.getDescription());
			paraList.put("para_length", String.valueOf(tableName.getLength()));
			paraList.put("aig_length", String.valueOf(tableName.getLength()));
			paraList.put("leaf", "0");
			String pattern = "000";
			DecimalFormat df = new DecimalFormat(pattern);
			String para_id = rfc_id + df.format(i + 1);
			paraList.put("sortno", df.format(i + 1));
			paraList.put("para_id", para_id);
			paraList.put("parent_id", "0");
			rfcImportParameterList.add(paraList);
			i++;
			int j = 0;
			// continue;

			// JCoField field = it.nextField();
			// paraList = new HashMap();
			// paraList.put("rfc_id", rfc_id);
			// paraList.put("para_name", field.getName());
			// paraList.put("aig_name", field.getName());
			// paraList.put("para_type", field.getClassNameOfValue());
			// paraList.put("aig_type", field.getClassNameOfValue());
			// paraList.put("para_desc", field.getDescription());
			// paraList.put("aig_desc", field.getDescription());
			// int para_length = field.getLength();
			// String ftype = field.getTypeAsString();
			// if (ftype.equals("BCD"))
			// para_length = para_length * 2 - 1;
			// if ((ftype.equals("INT")) || (ftype.equals("INT1")) ||
			// (ftype.equals("INT2")))
			// para_length *= 2;
			// if ((ftype.equals("DECF16")) || (ftype.equals("DECF34")))
			// para_length = para_length * 2 - 1;
			// if (ftype.equals("FLOAT"))
			// para_length = para_length * 2 - 1;
			// if (Integer.valueOf(para_length).intValue() >=
			// Integer.valueOf(field.getDecimals()).intValue()) {
			// paraList.put("para_length", String.valueOf(para_length));
			// paraList.put("aig_length", String.valueOf(para_length));
			// } else {
			// paraList.put("para_length", String.valueOf(field.getDecimals()));
			// paraList.put("aig_length", String.valueOf(field.getDecimals()));
			// }
			// String nextpara_id = para_id + df.format(j + 1);
			// paraList.put("sortno", df.format(j + 1));
			// paraList.put("para_id", nextpara_id);
			// paraList.put("parent_id", para_id);
			// paraList.put("leaf", "1");
			// paraList.put("para_decimals",
			// String.valueOf(field.getDecimals()));
			// paraList.put("aig_decimals",
			// String.valueOf(field.getDecimals()));
			// rfcImportParameterList.add(paraList);
			// j++;
		}

		return rfcImportParameterList;
	}

	public ArrayList<HashMap<String, String>> getParaExceptions(
			AbapException[] AbapExceptionArray, String rfc_id) {
		ArrayList rfcExceptionsrList = new ArrayList();
		HashMap exceptionList = null;
		if (AbapExceptionArray != null)
			for (int i = 0; i < AbapExceptionArray.length; i++) {
				AbapException exception = AbapExceptionArray[i];
				exceptionList = new HashMap();
				String pattern = "000";
				DecimalFormat df = new DecimalFormat(pattern);
				String para_id = rfc_id + df.format(i + 1);
				exceptionList.put("para_id", para_id);
				exceptionList.put("para_name", exception.getKey());
				exceptionList.put("para_desc", exception.getMessage());
				exceptionList.put("sortno", String.valueOf(i));
				exceptionList.put("para_optional", "0");
				rfcExceptionsrList.add(exceptionList);
			}
		return rfcExceptionsrList;
	}

	public ArrayList<HashMap<String, String>> getParaList(
			JCoParameterList paralist, String rfc_id) throws LonghaulException {
		if (paralist == null) {
			return null;
		}
		ArrayList rfcParameterList = new ArrayList();
		HashMap importparaList = null;
		for (int i = 0; i < paralist.getFieldCount(); i++) {
			importparaList = new HashMap();
			importparaList.put("rfc_id", rfc_id);
			importparaList.put("para_name", paralist.getMetaData().getName(i));
			importparaList.put("aig_name", paralist.getMetaData().getName(i));
			importparaList.put("para_type", paralist.getMetaData()
					.getClassNameOfField(i));
			importparaList.put("aig_type", paralist.getMetaData()
					.getClassNameOfField(i));
			importparaList.put("para_desc", paralist.getMetaData()
					.getDescription(i));
			importparaList.put("aig_desc", paralist.getMetaData()
					.getDescription(i));
			importparaList.put("para_optional", paralist.getListMetaData()
					.isOptional(i) ? "1" : "0");
			importparaList.put("leaf",
					paralist.getMetaData().isStructure(i) ? "0" : "1");
			int para_length = paralist.getMetaData().getLength(i);
			String ftype = paralist.getMetaData().getTypeAsString(i);
			if (ftype.equals("BCD"))
				para_length = para_length * 2 - 1;
			if ((ftype.equals("INT")) || (ftype.equals("INT1"))
					|| (ftype.equals("INT2")))
				para_length *= 2;
			if ((ftype.equals("DECF16")) || (ftype.equals("DECF34")))
				para_length = para_length * 2 - 1;
			if (ftype.equals("FLOAT"))
				para_length = para_length * 2 - 1;
			if (Integer.valueOf(para_length).intValue() >= Integer.valueOf(
					paralist.getMetaData().getDecimals(i)).intValue()) {
				importparaList.put("para_length", String.valueOf(para_length));
				importparaList.put("aig_length", String.valueOf(para_length));
			} else {
				importparaList.put("para_length", String.valueOf(paralist
						.getMetaData().getDecimals(i)));
				importparaList.put("aig_length", String.valueOf(paralist
						.getMetaData().getDecimals(i)));
			}
			importparaList.put("para_decimals", String.valueOf(paralist
					.getMetaData().getDecimals(i)));
			importparaList.put("aig_decimals", String.valueOf(paralist
					.getMetaData().getDecimals(i)));
			importparaList.put("parent_id", "0");
			String pattern = "000";
			DecimalFormat df = new DecimalFormat(pattern);
			String para_id = rfc_id + df.format(i + 1);
			importparaList.put("sortno", df.format(i + 1));
			importparaList.put("para_id", para_id);
			rfcParameterList.add(importparaList);
			if (paralist.getMetaData().isStructure(i)) {
				JCoMetaData jcometadata = paralist.getMetaData()
						.getRecordMetaData(i);
				for (int j = 0; j < jcometadata.getFieldCount(); j++) {
					importparaList = new HashMap();
					importparaList.put("rfc_id", rfc_id);
					importparaList.put("para_name", jcometadata.getName(j));
					importparaList.put("aig_name", jcometadata.getName(j));
					importparaList.put("para_type", jcometadata
							.getClassNameOfField(j));
					importparaList.put("aig_type", jcometadata
							.getClassNameOfField(j));
					importparaList.put("para_desc", jcometadata
							.getDescription(j));
					importparaList.put("aig_desc", jcometadata
							.getDescription(j));

					para_length = jcometadata.getLength(j);
					ftype = jcometadata.getTypeAsString(j);
					if (ftype.equals("BCD"))
						para_length = para_length * 2 - 1;
					if ((ftype.equals("INT")) || (ftype.equals("INT1"))
							|| (ftype.equals("INT2")))
						para_length *= 2;
					if ((ftype.equals("DECF16")) || (ftype.equals("DECF34")))
						para_length = para_length * 2 - 1;
					if (ftype.equals("FLOAT"))
						para_length = para_length * 2 - 1;
					if (Integer.valueOf(para_length).intValue() >= Integer
							.valueOf(jcometadata.getDecimals(j)).intValue()) {
						importparaList.put("para_length", String
								.valueOf(para_length));
						importparaList.put("aig_length", String
								.valueOf(para_length));
					} else {
						importparaList.put("para_length", String
								.valueOf(jcometadata.getDecimals(j)));
						importparaList.put("aig_length", String
								.valueOf(jcometadata.getDecimals(j)));
					}
					importparaList.put("para_decimals", String
							.valueOf(jcometadata.getDecimals(j)));
					importparaList.put("aig_decimals", String
							.valueOf(jcometadata.getDecimals(j)));
					importparaList.put("para_optional", paralist
							.getListMetaData().isOptional(i) ? "1" : "0");
					importparaList.put("parent_id", para_id);
					String nextpara_id = para_id + df.format(j + 1);
					importparaList.put("sortno", df.format(j + 1));
					importparaList.put("para_id", nextpara_id);
					importparaList.put("sortno", String.valueOf(jcometadata
							.indexOf(jcometadata.getName(j))));
					importparaList.put("leaf", "1");
					rfcParameterList.add(importparaList);
				}
			}
		}
		return rfcParameterList;
	}

	public void setFunctionParas(AigTransferInfo rfctransferinfo,
			JCoFunction function) throws LonghaulException {
		JCoParameterList paras = function.getImportParameterList();
		AigTransferParameter rfcimport = rfctransferinfo.getImportPara();

		for (int i = 0; i < rfcimport.getStructureList().size(); i++) {
			AigTransferStructure rfcStructure = (AigTransferStructure) rfcimport
					.getStructureList().get(i);
			String structureName = rfcStructure.getStructureName();
			JCoStructure structure = paras.getStructure(structureName);
			HashMap map = rfcStructure.getStructureMap();
			for (Iterator j = map.entrySet().iterator(); j.hasNext();) {
				Map.Entry mapValue = (Map.Entry) j.next();
				structure.setValue(mapValue.getKey().toString(), mapValue
						.getValue());
			}
		}

		HashMap inputs = rfcimport.getParameters();
		for (Iterator j = inputs.entrySet().iterator(); j.hasNext();) {
			Map.Entry mapValue = (Map.Entry) j.next();
			paras.setValue(mapValue.getKey().toString(), mapValue.getValue());
		}

		for (int t = 0; t < rfctransferinfo.getTableList().size(); t++) {
			String tablename = ((AigTransferTable) rfctransferinfo
					.getTableList().get(t)).getName();
			JCoTable table = function.getTableParameterList().getTable(
					tablename);
			table.deleteAllRows();
			AigTransferTable transRfctable = (AigTransferTable) rfctransferinfo
					.getTableList().get(t);
			for (int i = 0; i < transRfctable.getMetaData().size(); i++) {
				table.appendRow();
				HashMap map = (HashMap) transRfctable.getMetaData().get(i);
				for (Iterator j = map.entrySet().iterator(); j.hasNext();) {
					Map.Entry mapValue = (Map.Entry) j.next();
					table.setValue(mapValue.getKey().toString(), mapValue
							.getValue());
				}
			}
		}
	}

	public TransferInfo functionExectue(JCoFunction function,
			AigTransferInfo inTransferInfo) throws LonghaulException {
		JCoParameterList export = function.getExportParameterList();
		TransferParameter rfcExport = new TransferParameter();
		TransferInfo outFunctionInfo = new TransferInfo();
		if (export != null)
			for (int i = 0; i < export.getFieldCount(); i++) {
				String exportName = export.getMetaData().getName(i);
				if (!export.getMetaData().isStructure(i)) {
					rfcExport.setParameter(exportName, export
							.getString(exportName));
				} else {
					TransferStructure rfcstructure = new TransferStructure();
					JCoMetaData jcometadata = export.getMetaData()
							.getRecordMetaData(i);
					rfcstructure.setStructureName(exportName);
					JCoStructure returnStructure = (JCoStructure) export
							.getValue(exportName);
					for (int j = 0; j < jcometadata.getFieldCount(); j++) {
						rfcstructure.setValue(jcometadata.getName(j),
								returnStructure.getString(jcometadata
										.getName(j)));
					}
					rfcExport.appendStructure(rfcstructure);
				}
			}
		outFunctionInfo.setExportPara(rfcExport);
		if ((function.getTableParameterList() != null)
				&& (function.getTableParameterList().getFieldCount() > 0)) {
			for (int k = 0; k < function.getTableParameterList()
					.getFieldCount(); k++) {
				TransferTable outRfctable = new TransferTable();
				String tablename = function.getTableParameterList()
						.getMetaData().getName(k);
				JCoTable returnuTable = function.getTableParameterList()
						.getTable(tablename);
				outRfctable.setName(tablename);
				if (returnuTable.getNumRows() > 0) {
					do {
						for (JCoFieldIterator e = returnuTable
								.getFieldIterator(); e.hasNextField();) {
							JCoField field = e.nextField();
							String fieldValue = field.getString();
							outRfctable.setValue(field.getName(), fieldValue);
							isCheckSelect(inTransferInfo, outRfctable, field
									.getName());
						}
						outRfctable.appendRow();
					} while (returnuTable.nextRow());
				}
				outFunctionInfo.appendTable(outRfctable);
			}
		}
		return outFunctionInfo;
	}

	public void isCheckSelect(AigTransferInfo inTransferInfo,
			TransferTable outRfctable, String tableFiledName)
			throws LonghaulException {
		if (inTransferInfo != null) {
			AigTransferParameter rfcimport = inTransferInfo.getImportPara();
			HashMap inputs = rfcimport.getParameters();
			Set<String> set = inputs.keySet();
			for (String keyName : set) {
				Object value = inputs.get(keyName);
				if (keyName.equals("I_" + tableFiledName))
					outRfctable.setValue(tableFiledName, value);
			}
		}
	}
}