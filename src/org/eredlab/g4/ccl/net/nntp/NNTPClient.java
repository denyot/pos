package org.eredlab.g4.ccl.net.nntp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.StringTokenizer;
import java.util.Vector;
import org.eredlab.g4.ccl.net.MalformedServerReplyException;
import org.eredlab.g4.ccl.net.io.DotTerminatedMessageReader;
import org.eredlab.g4.ccl.net.io.DotTerminatedMessageWriter;
import org.eredlab.g4.ccl.net.io.Util;

public class NNTPClient extends NNTP {
	private void __parseArticlePointer(String reply, ArticlePointer pointer)
			throws MalformedServerReplyException {
		StringTokenizer tokenizer = new StringTokenizer(reply);

		if (tokenizer.countTokens() >= 3) {
			tokenizer.nextToken();
			try {
				pointer.articleNumber = Integer.parseInt(tokenizer.nextToken());
			} catch (NumberFormatException e) {
				//break label53;
			}

			pointer.articleId = tokenizer.nextToken();
			return;
		}

		label53: throw new MalformedServerReplyException(
				"Could not parse article pointer.\nServer reply: " + reply);
	}

	private void __parseGroupReply(String reply, NewsgroupInfo info)
			throws MalformedServerReplyException {
		StringTokenizer tokenizer = new StringTokenizer(reply);

		if (tokenizer.countTokens() >= 5) {
			tokenizer.nextToken();

			String count = tokenizer.nextToken();

			String first = tokenizer.nextToken();

			String last = tokenizer.nextToken();

			info._setNewsgroup(tokenizer.nextToken());
			try {
				info._setArticleCount(Integer.parseInt(count));
				info._setFirstArticle(Integer.parseInt(first));
				info._setLastArticle(Integer.parseInt(last));
			} catch (NumberFormatException e) {
				//break label97;
			}

			info._setPostingPermission(0);
			return;
		}

		label97: throw new MalformedServerReplyException(
				"Could not parse newsgroup info.\nServer reply: " + reply);
	}

	private NewsgroupInfo __parseNewsgroupListEntry(String entry) {
		NewsgroupInfo result = new NewsgroupInfo();
		StringTokenizer tokenizer = new StringTokenizer(entry);

		if (tokenizer.countTokens() < 4) {
			return null;
		}
		result._setNewsgroup(tokenizer.nextToken());
		String last = tokenizer.nextToken();
		String first = tokenizer.nextToken();
		String permission = tokenizer.nextToken();
		try {
			int lastNum = Integer.parseInt(last);
			int firstNum = Integer.parseInt(first);
			result._setFirstArticle(firstNum);
			result._setLastArticle(lastNum);

			if ((firstNum == 0) && (lastNum == 0))
				result._setArticleCount(0);
			else
				result._setArticleCount(lastNum - firstNum + 1);
		} catch (NumberFormatException e) {
			return null;
		}
		int firstNum;
		int lastNum;
		switch (permission.charAt(0)) {
		case 'Y':
		case 'y':
			result._setPostingPermission(2);
			break;
		case 'N':
		case 'n':
			result._setPostingPermission(3);
			break;
		case 'M':
		case 'm':
			result._setPostingPermission(1);
			break;
		default:
			result._setPostingPermission(0);
		}

		return result;
	}

	private NewsgroupInfo[] __readNewsgroupListing() throws IOException {
		BufferedReader reader = new BufferedReader(
				new DotTerminatedMessageReader(this._reader_));

		Vector list = new Vector(2048);
		String line;
		while ((line = reader.readLine()) != null) {
			NewsgroupInfo tmp = __parseNewsgroupListEntry(line);
			if (tmp != null)
				list.addElement(tmp);
			else
				throw new MalformedServerReplyException(line);
		}
		int size;
		if ((size = list.size()) < 1) {
			return new NewsgroupInfo[0];
		}
		NewsgroupInfo[] info = new NewsgroupInfo[size];
		list.copyInto(info);

		return info;
	}

	private Reader __retrieve(int command, String articleId,
			ArticlePointer pointer) throws IOException {
		if (articleId != null) {
			if (!NNTPReply
					.isPositiveCompletion(sendCommand(command, articleId))) {
				return null;
			}

		} else if (!NNTPReply.isPositiveCompletion(sendCommand(command))) {
			return null;
		}

		if (pointer != null) {
			__parseArticlePointer(getReplyString(), pointer);
		}
		Reader reader = new DotTerminatedMessageReader(this._reader_);
		return reader;
	}

	private Reader __retrieve(int command, int articleNumber,
			ArticlePointer pointer) throws IOException {
		if (!NNTPReply.isPositiveCompletion(sendCommand(command, Integer
				.toString(articleNumber)))) {
			return null;
		}
		if (pointer != null) {
			__parseArticlePointer(getReplyString(), pointer);
		}
		Reader reader = new DotTerminatedMessageReader(this._reader_);
		return reader;
	}

	public Reader retrieveArticle(String articleId, ArticlePointer pointer)
			throws IOException {
		return __retrieve(0, articleId, pointer);
	}

	public Reader retrieveArticle(String articleId) throws IOException {
		return retrieveArticle(articleId, null);
	}

	public Reader retrieveArticle() throws IOException {
		return retrieveArticle(null);
	}

	public Reader retrieveArticle(int articleNumber, ArticlePointer pointer)
			throws IOException {
		return __retrieve(0, articleNumber, pointer);
	}

	public Reader retrieveArticle(int articleNumber) throws IOException {
		return retrieveArticle(articleNumber, null);
	}

	public Reader retrieveArticleHeader(String articleId, ArticlePointer pointer)
			throws IOException {
		return __retrieve(3, articleId, pointer);
	}

	public Reader retrieveArticleHeader(String articleId) throws IOException {
		return retrieveArticleHeader(articleId, null);
	}

	public Reader retrieveArticleHeader() throws IOException {
		return retrieveArticleHeader(null);
	}

	public Reader retrieveArticleHeader(int articleNumber,
			ArticlePointer pointer) throws IOException {
		return __retrieve(3, articleNumber, pointer);
	}

	public Reader retrieveArticleHeader(int articleNumber) throws IOException {
		return retrieveArticleHeader(articleNumber, null);
	}

	public Reader retrieveArticleBody(String articleId, ArticlePointer pointer)
			throws IOException {
		return __retrieve(1, articleId, pointer);
	}

	public Reader retrieveArticleBody(String articleId) throws IOException {
		return retrieveArticleBody(articleId, null);
	}

	public Reader retrieveArticleBody() throws IOException {
		return retrieveArticleBody(null);
	}

	public Reader retrieveArticleBody(int articleNumber, ArticlePointer pointer)
			throws IOException {
		return __retrieve(1, articleNumber, pointer);
	}

	public Reader retrieveArticleBody(int articleNumber) throws IOException {
		return retrieveArticleBody(articleNumber, null);
	}

	public boolean selectNewsgroup(String newsgroup, NewsgroupInfo info)
			throws IOException {
		if (!NNTPReply.isPositiveCompletion(group(newsgroup))) {
			return false;
		}
		if (info != null) {
			__parseGroupReply(getReplyString(), info);
		}
		return true;
	}

	public boolean selectNewsgroup(String newsgroup) throws IOException {
		return selectNewsgroup(newsgroup, null);
	}

	public String listHelp() throws IOException {
		if (!NNTPReply.isInformational(help())) {
			return null;
		}
		StringWriter help = new StringWriter();
		Reader reader = new DotTerminatedMessageReader(this._reader_);
		Util.copyReader(reader, help);
		reader.close();
		help.close();
		return help.toString();
	}

	public boolean selectArticle(String articleId, ArticlePointer pointer)
			throws IOException {
		if (articleId != null) {
			if (!NNTPReply.isPositiveCompletion(stat(articleId))) {
				return false;
			}

		} else if (!NNTPReply.isPositiveCompletion(stat())) {
			return false;
		}

		if (pointer != null) {
			__parseArticlePointer(getReplyString(), pointer);
		}
		return true;
	}

	public boolean selectArticle(String articleId) throws IOException {
		return selectArticle(articleId, null);
	}

	public boolean selectArticle(ArticlePointer pointer) throws IOException {
		return selectArticle(null, pointer);
	}

	public boolean selectArticle(int articleNumber, ArticlePointer pointer)
			throws IOException {
		if (!NNTPReply.isPositiveCompletion(stat(articleNumber))) {
			return false;
		}
		if (pointer != null) {
			__parseArticlePointer(getReplyString(), pointer);
		}
		return true;
	}

	public boolean selectArticle(int articleNumber) throws IOException {
		return selectArticle(articleNumber, null);
	}

	public boolean selectPreviousArticle(ArticlePointer pointer)
			throws IOException {
		if (!NNTPReply.isPositiveCompletion(last())) {
			return false;
		}
		if (pointer != null) {
			__parseArticlePointer(getReplyString(), pointer);
		}
		return true;
	}

	public boolean selectPreviousArticle() throws IOException {
		return selectPreviousArticle(null);
	}

	public boolean selectNextArticle(ArticlePointer pointer) throws IOException {
		if (!NNTPReply.isPositiveCompletion(next())) {
			return false;
		}
		if (pointer != null) {
			__parseArticlePointer(getReplyString(), pointer);
		}
		return true;
	}

	public boolean selectNextArticle() throws IOException {
		return selectNextArticle(null);
	}

	public NewsgroupInfo[] listNewsgroups() throws IOException {
		if (!NNTPReply.isPositiveCompletion(list())) {
			return null;
		}
		return __readNewsgroupListing();
	}

	public NewsgroupInfo[] listNewsgroups(String wildmat) throws IOException {
		if (!NNTPReply.isPositiveCompletion(listActive(wildmat)))
			return null;
		return __readNewsgroupListing();
	}

	public NewsgroupInfo[] listNewNewsgroups(NewGroupsOrNewsQuery query)
			throws IOException {
		if (!NNTPReply.isPositiveCompletion(newgroups(query.getDate(), query
				.getTime(), query.isGMT(), query.getDistributions()))) {
			return null;
		}
		return __readNewsgroupListing();
	}

	public String[] listNewNews(NewGroupsOrNewsQuery query) throws IOException {
		if (!NNTPReply.isPositiveCompletion(newnews(query.getNewsgroups(),
				query.getDate(), query.getTime(), query.isGMT(), query
						.getDistributions()))) {
			return null;
		}
		Vector list = new Vector();
		BufferedReader reader = new BufferedReader(
				new DotTerminatedMessageReader(this._reader_));
		String line;
		while ((line = reader.readLine()) != null) {
			list.addElement(line);
		}
		int size = list.size();

		if (size < 1) {
			return new String[0];
		}
		String[] result = new String[size];
		list.copyInto(result);

		return result;
	}

	public boolean completePendingCommand() throws IOException {
		return NNTPReply.isPositiveCompletion(getReply());
	}

	public Writer postArticle() throws IOException {
		if (!NNTPReply.isPositiveIntermediate(post())) {
			return null;
		}
		return new DotTerminatedMessageWriter(this._writer_);
	}

	public Writer forwardArticle(String articleId) throws IOException {
		if (!NNTPReply.isPositiveIntermediate(ihave(articleId))) {
			return null;
		}
		return new DotTerminatedMessageWriter(this._writer_);
	}

	public boolean logout() throws IOException {
		return NNTPReply.isPositiveCompletion(quit());
	}

	public boolean authenticate(String username, String password)
			throws IOException {
		int replyCode = authinfoUser(username);

		if (replyCode == 381) {
			replyCode = authinfoPass(password);

			if (replyCode == 281) {
				this._isAllowedToPost = true;
				return true;
			}
		}
		return false;
	}

	private Reader __retrieveArticleInfo(String articleRange)
			throws IOException {
		if (!NNTPReply.isPositiveCompletion(xover(articleRange))) {
			return null;
		}
		return new DotTerminatedMessageReader(this._reader_);
	}

	public Reader retrieveArticleInfo(int articleNumber) throws IOException {
		return __retrieveArticleInfo(Integer.toString(articleNumber));
	}

	public Reader retrieveArticleInfo(int lowArticleNumber,
			int highArticleNumber) throws IOException {
		return __retrieveArticleInfo(new String(lowArticleNumber + "-"
				+ highArticleNumber));
	}

	private Reader __retrieveHeader(String header, String articleRange)
			throws IOException {
		if (!NNTPReply.isPositiveCompletion(xhdr(header, articleRange))) {
			return null;
		}
		return new DotTerminatedMessageReader(this._reader_);
	}

	public Reader retrieveHeader(String header, int articleNumber)
			throws IOException {
		return __retrieveHeader(header, Integer.toString(articleNumber));
	}

	public Reader retrieveHeader(String header, int lowArticleNumber,
			int highArticleNumber) throws IOException {
		return __retrieveHeader(header, new String(lowArticleNumber + "-"
				+ highArticleNumber));
	}
}