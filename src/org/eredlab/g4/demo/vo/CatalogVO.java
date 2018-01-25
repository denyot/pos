package org.eredlab.g4.demo.vo;

import java.math.BigDecimal;
import java.sql.Timestamp;
import org.eredlab.g4.ccl.datastructure.impl.BaseVo;

public class CatalogVO extends BaseVo {
	private String xmid;
	private String xmmc;
	private String xmrj;
	private String gg;
	private String dw;
	private BigDecimal zfbl;
	private String jx;
	private String cd;
	private String qybz;
	private String yybm;
	private String sfdlbm;
	private Timestamp ggsj;

	public String getXmid() {
		return this.xmid;
	}

	public void setXmid(String xmid) {
		this.xmid = xmid;
	}

	public String getXmmc() {
		return this.xmmc;
	}

	public void setXmmc(String xmmc) {
		this.xmmc = xmmc;
	}

	public String getXmrj() {
		return this.xmrj;
	}

	public void setXmrj(String xmrj) {
		this.xmrj = xmrj;
	}

	public String getGg() {
		return this.gg;
	}

	public void setGg(String gg) {
		this.gg = gg;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public BigDecimal getZfbl() {
		return this.zfbl;
	}

	public void setZfbl(BigDecimal zfbl) {
		this.zfbl = zfbl;
	}

	public String getJx() {
		return this.jx;
	}

	public void setJx(String jx) {
		this.jx = jx;
	}

	public String getCd() {
		return this.cd;
	}

	public void setCd(String cd) {
		this.cd = cd;
	}

	public String getQybz() {
		return this.qybz;
	}

	public void setQybz(String qybz) {
		this.qybz = qybz;
	}

	public String getYybm() {
		return this.yybm;
	}

	public void setYybm(String yybm) {
		this.yybm = yybm;
	}

	public String getSfdlbm() {
		return this.sfdlbm;
	}

	public void setSfdlbm(String sfdlbm) {
		this.sfdlbm = sfdlbm;
	}

	public Timestamp getGgsj() {
		return this.ggsj;
	}

	public void setGgsj(Timestamp ggsj) {
		this.ggsj = ggsj;
	}
}