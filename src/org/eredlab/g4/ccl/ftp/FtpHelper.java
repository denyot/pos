package org.eredlab.g4.ccl.ftp;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.exception.NullAbleException;
import org.eredlab.g4.ccl.net.ftp.FTPClient;
import org.eredlab.g4.ccl.net.ftp.FTPFile;
import org.eredlab.g4.ccl.net.ftp.FTPReply;
import org.eredlab.g4.ccl.util.G4Utils;

public class FtpHelper {
	private static Log log = LogFactory.getLog(FtpHelper.class);
	private String host;
	private String username;
	private String password;
	private int portno = 21;
	private FTPClient ftpClient = null;

	public boolean createConnection(String host, String username,
			String password, int portno) {
		setHost(host);
		setPassword(password);
		setUsername(username);
		setPassword(password);
		this.ftpClient = new FTPClient();
		try {
			this.ftpClient.connect(host, portno);

			if ((FTPReply.isPositiveCompletion(this.ftpClient.getReplyCode()))
					&& (this.ftpClient.login(username, password))) {
				if (log.isInfoEnabled()) {
					this.ftpClient.enterLocalPassiveMode();
					log.info("和远程FTP主机[" + host + "]连接成功.\n"
							+ this.ftpClient.getReplyString());
				}
				return true;
			}
		} catch (SocketException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		if (log.isErrorEnabled()) {
			log.error("和远程FTP主机[" + host + "]连接失败.\n"
					+ this.ftpClient.getReplyString());
		}
		disconnect();
		return false;
	}

	public void disconnect() {
		if (this.ftpClient != null) {
			try {
				this.ftpClient.logout();
			} catch (IOException e) {
				e.printStackTrace();
			}
			if (log.isInfoEnabled()) {
				log.info("退出FTP远程主机![" + this.host + "]"
						+ this.ftpClient.getReplyString());
			}
		}
		if (this.ftpClient.isConnected())
			try {
				this.ftpClient.disconnect();
			} catch (IOException e) {
				e.printStackTrace();
			}
	}

	public boolean useWorkingDir(String dir) {
		if (G4Utils.isEmpty(dir)) {
			throw new NullAbleException();
		}
		if (G4Utils.isEmpty(this.ftpClient)) {
			throw new NullAbleException();
		}
		if (dir.equals("/")) {
			try {
				boolean status = this.ftpClient.changeWorkingDirectory(dir);
				if (log.isDebugEnabled()) {
					log.debug(this.ftpClient.getReplyString());
				}
				if (log.isInfoEnabled()) {
					log.info("远程FTP工作目录切换到:" + dir);
				}
				return status;
			} catch (IOException e) {
				if (log.isErrorEnabled()) {
					log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n远程FTP工作目录切换发生异常");
				}
				e.printStackTrace();
			}
		}

		String[] dirs = dir.substring(1).split("/");
		for (int i = 0; i < dirs.length; i++) {
			dirs[i] = ("/" + dirs[i]);
		}
		String path = "";
		try {
			for (int i = 0; i < dirs.length; i++) {
				path = path + dirs[i];
				if (!this.ftpClient.changeWorkingDirectory(path)) {
					if (this.ftpClient.makeDirectory(path)) {
						this.ftpClient.changeWorkingDirectory(path);
					} else if (log.isErrorEnabled())
						log
								.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n创建远程FTP工作目录发生异常");
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		if (log.isDebugEnabled()) {
			log.debug("远程FTP目录切换到:" + path);
		}
		return true;
	}

	public boolean storeFile(InputStream fis, String filename) {
		boolean status = true;
		if (G4Utils.isEmpty(this.ftpClient)) {
			if (log.isErrorEnabled()) {
				log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n");
			}
			return false;
		}
		try {
			this.ftpClient.setFileType(2);
			status = this.ftpClient.storeFile(filename, fis);
			if (log.isInfoEnabled())
				log.info("文件上传成功." + this.ftpClient.getReplyString());
		} catch (IOException e) {
			if (log.isErrorEnabled()) {
				log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n文件上传失败");
			}
			e.printStackTrace();
			try {
				fis.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		} finally {
			try {
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return status;
	}

	public boolean storeFile(String localFilePath, String filename) {
		boolean status = true;
		if (G4Utils.isEmpty(this.ftpClient)) {
			if (log.isErrorEnabled()) {
				log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n");
			}
			return false;
		}
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(localFilePath);
			this.ftpClient.setFileType(2);
			status = this.ftpClient.storeFile(filename, fis);
			if (log.isInfoEnabled())
				log.info("文件上传成功." + this.ftpClient.getReplyString());
		} catch (IOException e) {
			if (log.isErrorEnabled()) {
				log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n文件上传失败");
			}
			e.printStackTrace();
			try {
				fis.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		} finally {
			try {
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return status;
	}

	public boolean removeFile(String fullPathFileName) {
		boolean success = false;
		String workingPath = fullPathFileName.substring(0, fullPathFileName
				.lastIndexOf("/"));
		String filename = fullPathFileName.substring(fullPathFileName
				.lastIndexOf("/") + 1, fullPathFileName.length());
		try {
			if (this.ftpClient.changeWorkingDirectory(workingPath)) {
				success = this.ftpClient.deleteFile(filename);
				if (success) {
					if (log.isInfoEnabled()) {
						log.info("删除文件[" + fullPathFileName + "]成功 "
								+ this.ftpClient.getReplyString());
					}
				} else if (log.isErrorEnabled()) {
					log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n删除文件["
							+ fullPathFileName + "]失败");
				}

			} else if (log.isErrorEnabled()) {
				log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n切换工作目录[" + workingPath
						+ "]失败");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return success;
	}

	public boolean removeDir(String dirName) {
		boolean success = false;
		try {
			FTPFile[] files = this.ftpClient.listFiles(dirName);
			for (int i = 0; i < files.length; i++) {
				if ((!files[i].getName().equals("."))
						&& (!files[i].getName().equals(".."))
						&& (files[i].isDirectory())) {
					log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n删除目录[" + dirName
							+ "]失败,此路径下嵌套有子目录.");
					return false;
				}

			}

			for (int i = 0; i < files.length; i++) {
				if (files[i].isFile()) {
					this.ftpClient.deleteFile(dirName + "/"
							+ files[i].getName());
				}
			}
			success = this.ftpClient.removeDirectory(dirName);

			if ((success) && (log.isInfoEnabled())) {
				log.info("目录删除成功" + this.ftpClient.getReplyString());
			} else if (log.isErrorEnabled())
				log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n删除目录[" + dirName
						+ "]失败");
		} catch (IOException e) {
			e.printStackTrace();
		}
		return success;
	}

	public boolean getFile(String localFile, String remoteFile) {
		boolean success = false;
		OutputStream output = null;
		try {
			output = new FileOutputStream(localFile);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		try {
			success = this.ftpClient.retrieveFile(remoteFile, output);
			if (success)
				log.info("下载文件[" + remoteFile + "]成功, 被存储到[" + localFile + "]");
			else
				log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n下载文件[" + remoteFile
						+ "]失败");
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			output.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return success;
	}

	public String getHost() {
		return this.host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getPortno() {
		return this.portno;
	}

	public void setPortno(int portno) {
		this.portno = portno;
	}

	public FTPClient getFtpClient() {
		return this.ftpClient;
	}

	public void setFtpClient(FTPClient ftpClient) {
		this.ftpClient = ftpClient;
	}
}