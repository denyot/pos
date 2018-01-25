package org.eredlab.g4.demo.service.impl;

import com.ibatis.sqlmap.client.SqlMapExecutor;
import java.math.BigDecimal;
import java.sql.SQLException;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.demo.service.DemoService;
import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.SqlMapClientTemplate;

public class DemoServiceImpl extends BaseServiceImpl implements DemoService {
	public Dto saveSfxmDomain(Dto pDto) {
		Dto outDto = new BaseDto();
		String xmid = IDHelper.getXmID();
		pDto.put("xmid", xmid);
		this.g4Dao.insert("Demo.insertEz_sfxmDomain", pDto);
		outDto.put("xmid", xmid);
		return outDto;
	}

	public Dto batchSaveSfxmDomains(final Dto pDto) {
		Dto outDto = new BaseDto();
		this.g4Dao.getSqlMapClientTpl().execute(new SqlMapClientCallback() {
			public Object doInSqlMapClient(SqlMapExecutor executor)
					throws SQLException {
				executor.startBatch();
				for (int i = 0; i < pDto.getAsInteger("count").intValue(); i++) {
					Dto dto = new BaseDto();
					String xmid = IDHelper.getXmID();
					dto.put("xmid", xmid);
					dto.put("sfdlbm", "99");
					executor.insert("Demo.insertEz_sfxmDomain", dto);
				}
				executor.executeBatch();
				return null;
			}
		});
		return outDto;
	}

	public Dto updateSfxmDomain(Dto pDto) {
		Dto outDto = new BaseDto();
		this.g4Dao.update("Demo.updatesfxm", pDto);
		return outDto;
	}

	public Dto deleteSfxm(Dto pDto) {
		Dto outDto = new BaseDto();
		this.g4Dao.delete("Demo.deleteSfxm", pDto);
		return outDto;
	}

	public Dto callPrc(Dto inDto) {
		Dto prcDto = new BaseDto();
		prcDto.put("myname", inDto.getAsString("myname"));
		prcDto.put("number1", inDto.getAsBigDecimal("number1"));
		prcDto.put("number2", inDto.getAsBigDecimal("number2"));
		if (G4Utils.defaultJdbcTypeMysql())
			this.g4Dao.callPrc("Demo.g4_prc_demo_mysql", prcDto);
		else if (G4Utils.defaultJdbcTypeOracle()) {
			this.g4Dao.callPrc("Demo.g4_prc_demo", prcDto);
		}
		return prcDto;
	}

	public Dto doTransactionTest() {
		Dto dto = new BaseDto();
		dto.put("sxh", "BJLK1000000000935");
		dto.put("fyze", new BigDecimal(300));
		this.g4Dao.update("Demo.updateByjsb", dto);

		dto.put("fyze", new BigDecimal(300));
		this.g4Dao.update("Demo.updateByjsb1", dto);
		Dto outDto = (Dto) this.g4Dao.queryForObject("Demo.queryBalanceInfo",
				dto);
		return outDto;
	}

	public Dto doError() {
		Dto dto = new BaseDto();
		dto.put("sxh", "BJLK1000000000935");
		Dto outDto = (Dto) this.g4Dao.queryForObject("Demo.queryBalanceInfo1",
				dto);
		return outDto;
	}

	public Dto doUpload(Dto pDto) {
		pDto.put("fileid", IDHelper.getFileID());
		pDto.put("uploaddate", G4Utils.getCurrentTimestamp());
		this.g4Dao.insert("Demo.insertEa_demo_uploadPo", pDto);
		return null;
	}

	public Dto doUploadApp(Dto pDto) {
		pDto.put("fileid", IDHelper.getFileID());
		pDto.put("uploaddate", G4Utils.getCurrentTimestamp());
		this.g4Dao.insert("Demo.insertEa_app_uploadPo", pDto);
		return null;
	}

	public Dto delFileApp(String pFileId) {
		this.g4Dao.delete("Demo.delFileByFileAppID", pFileId);
		return null;
	}

	public Dto delFile(String pFileId) {
		this.g4Dao.delete("Demo.delFileByFileID", pFileId);
		return null;
	}

	public Dto saveAppConfig(Dto pDto) {
		this.g4Dao.insert("Demo.insertEa_app_configPo", pDto);
		return null;
	}

	public Dto delAppConfig(String fileid) {
		this.g4Dao.delete("Demo.delAppConfigByID", fileid);
		return null;
	}
}