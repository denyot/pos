package org.eredlab.g4.ccl.id.storer;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.id.SequenceStorer;
import org.eredlab.g4.ccl.id.StoreSequenceException;
import org.eredlab.g4.ccl.id.test.Hello;

public class FileSequenceStorer implements SequenceStorer {
	private static final Log logger = LogFactory
			.getLog(FileSequenceStorer.class);
	public static final String DEFAULT_FILE_PATH = "g4-id-sequence-store.properties";
	private String filePath = "g4-id-sequence-store.properties";

	protected String getRealFilePath() throws StoreSequenceException {
		File tmp = new File(this.filePath);
		if (tmp.exists()) {
			return this.filePath;
		}
		URL url = Hello.class.getClassLoader().getResource(this.filePath);
		if (url == null) {
			String msg = "存储sequence失败!没有发现文件：" + this.filePath;
			logger.error(msg);
			throw new StoreSequenceException(msg);
		}
		return url.getFile();
	}

	public long load(String sequenceID) throws StoreSequenceException {
		Properties props = new Properties();
		String realFilePath = getRealFilePath();
		if (logger.isDebugEnabled()) {
			logger.debug("序号ID:[" + sequenceID + "]");
			logger.debug("资源路径:[" + this.filePath + "]");
			logger.debug("实际文件路径:[" + realFilePath + "]");
		}
		FileInputStream is = null;
		try {
			is = new FileInputStream(realFilePath);
			props.load(is);
			String result = props.getProperty(sequenceID);
			if (result == null) {
				String msg;
				return -1L;
			}
			String msg;
			return Long.parseLong(result);
		} catch (FileNotFoundException e) {
			String msg = "存储sequence失败!没有发现文件：" + realFilePath;
			logger.error(msg, e);
			throw new StoreSequenceException(msg, e);
		} catch (IOException e) {
			String msg = "存储sequence失败!" + e.getMessage();
			logger.error(msg, e);
			throw new StoreSequenceException(msg, e);
		} finally {
			if (is != null)
				try {
					is.close();
				} catch (IOException e) {
					String msg = "关闭文件:" + realFilePath + "失败!"
							+ e.getMessage();
					logger.debug(msg, e);
				}
		}
	}

	public void updateMaxValueByFieldName(long sequence, String sequenceID)
			throws StoreSequenceException {
		Properties props = new Properties();
		String realFilePath = getRealFilePath();
		if (logger.isDebugEnabled()) {
			logger.debug("序号ID:[" + sequenceID + "]");
			logger.debug("资源路径:[" + this.filePath + "]");
			logger.debug("实际文件路径:[" + realFilePath + "]");
		}
		FileInputStream is = null;
		String msg;
		try {
			is = new FileInputStream(realFilePath);
			props.load(is);
			props.setProperty(sequenceID, sequence + "");
		} catch (FileNotFoundException e) {
			msg = "存储sequence失败!没有发现文件：" + realFilePath;
			logger.error(msg, e);
			throw new StoreSequenceException(msg, e);
		} catch (IOException e) {
			msg = "存储sequence失败!" + e.getMessage();
			logger.error(msg, e);
			throw new StoreSequenceException(msg, e);
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					msg = "关闭文件:" + realFilePath + "失败!"
							+ e.getMessage();
					logger.debug(msg, e);
				}
			}
		}

		FileOutputStream out = null;
		try {
			out = new FileOutputStream(realFilePath);
			props.store(out, "e3 id sequence storer, don't edit");
		} catch (FileNotFoundException e) {
			msg = "存储sequence失败!没有发现文件：" + realFilePath;
			logger.error(msg, e);
			throw new StoreSequenceException(msg, e);
		} catch (IOException e) {
			msg = "存储sequence失败!" + e.getMessage();
			logger.error(msg, e);
			throw new StoreSequenceException(msg, e);
		} finally {
			if (out != null)
				try {
					out.close();
				} catch (IOException e) {
					msg = "关闭文件:" + realFilePath + "失败!"
							+ e.getMessage();
					logger.debug(msg, e);
				}
		}
	}

	public String getFilePath() {
		return this.filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
}