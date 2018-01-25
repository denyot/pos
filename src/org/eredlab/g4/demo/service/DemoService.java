package org.eredlab.g4.demo.service;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface DemoService extends BaseService {
	public abstract Dto saveSfxmDomain(Dto paramDto);

	public abstract Dto batchSaveSfxmDomains(Dto paramDto);

	public abstract Dto updateSfxmDomain(Dto paramDto);

	public abstract Dto deleteSfxm(Dto paramDto);

	public abstract Dto callPrc(Dto paramDto);

	public abstract Dto doTransactionTest();

	public abstract Dto doError();

	public abstract Dto doUpload(Dto paramDto);

	public abstract Dto doUploadApp(Dto paramDto);

	public abstract Dto saveAppConfig(Dto paramDto);

	public abstract Dto delFile(String paramString);

	public abstract Dto delFileApp(String paramString);

	public abstract Dto delAppConfig(String paramString);
}