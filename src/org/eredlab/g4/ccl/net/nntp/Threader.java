package org.eredlab.g4.ccl.net.nntp;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

public class Threader {
	private ThreadContainer root;
	private HashMap idTable;
	private int bogusIdCount = 0;

	public Threadable thread(Threadable[] messages) {
		if (messages == null) {
			return null;
		}
		this.idTable = new HashMap();

		for (int i = 0; i < messages.length; i++) {
			if (!messages[i].isDummy()) {
				buildContainer(messages[i]);
			}
		}
		this.root = findRootSet();
		this.idTable.clear();
		this.idTable = null;

		pruneEmptyContainers(this.root);

		this.root.reverseChildren();
		gatherSubjects();

		if (this.root.next != null) {
			throw new RuntimeException("root node has a next:" + this.root);
		}
		for (ThreadContainer r = this.root.child; r != null; r = r.next) {
			if (r.threadable == null) {
				r.threadable = r.child.threadable.makeDummy();
			}
		}
		Threadable result = this.root.child == null ? null
				: this.root.child.threadable;
		this.root.flush();
		this.root = null;

		return result;
	}

	private void buildContainer(Threadable threadable) {
		String id = threadable.messageThreadId();
		ThreadContainer container = (ThreadContainer) this.idTable.get(id);

		if (container != null) {
			if (container.threadable != null) {
				id = "<Bogus-id:" + this.bogusIdCount++ + ">";
				container = null;
			} else {
				container.threadable = threadable;
			}
		}

		if (container == null) {
			container = new ThreadContainer();
			container.threadable = threadable;
			this.idTable.put(id, container);
		}

		ThreadContainer parentRef = null;

		String[] references = threadable.messageThreadReferences();
		for (int i = 0; i < references.length; i++) {
			String refString = references[i];
			ThreadContainer ref = (ThreadContainer) this.idTable.get(refString);

			if (ref == null) {
				ref = new ThreadContainer();
				this.idTable.put(refString, ref);
			}

			if ((parentRef != null) && (ref.parent == null)
					&& (parentRef != ref) && (!parentRef.findChild(ref))) {
				ref.parent = parentRef;
				ref.next = parentRef.child;
				parentRef.child = ref;
			}
			parentRef = ref;
		}

		if ((parentRef != null)
				&& ((parentRef == container) || (container.findChild(parentRef)))) {
			parentRef = null;
		}

		if (container.parent != null) {
			ThreadContainer prev = null;
			for (ThreadContainer rest = container.parent.child; rest != null; rest = rest.next) {
				if (rest == container)
					break;
				prev = rest;
			}

			if (prev == null) {
				throw new RuntimeException("Didnt find " + container
						+ " in parent" + container.parent);
			}

			if (prev == null)
				container.parent.child = container.next;
			else {
				prev.next = container.next;
			}
			container.next = null;
			container.parent = null;
		}

		if (parentRef != null) {
			container.parent = parentRef;
			container.next = parentRef.child;
			parentRef.child = container;
		}
	}

	private ThreadContainer findRootSet() {
		ThreadContainer root = new ThreadContainer();
		Iterator iter = this.idTable.keySet().iterator();

		while (iter.hasNext()) {
			Object key = iter.next();
			ThreadContainer c = (ThreadContainer) this.idTable.get(key);
			if (c.parent == null) {
				if (c.next != null)
					throw new RuntimeException("c.next is " + c.next.toString());
				c.next = root.child;
				root.child = c;
			}
		}
		return root;
	}

	private void pruneEmptyContainers(ThreadContainer parent) {
		ThreadContainer prev = null;
		ThreadContainer container = parent.child;
		ThreadContainer next = container.next;
		while (container != null) {
			if ((container.threadable == null) && (container.child == null)) {
				if (prev == null)
					parent.child = container.next;
				else {
					prev.next = container.next;
				}

				container = prev;
			} else if ((container.threadable == null)
					&& (container.child != null)
					&& ((container.parent != null) || (container.child.next == null))) {
				ThreadContainer kids = container.child;

				if (prev == null)
					parent.child = kids;
				else {
					prev.next = kids;
				}
				ThreadContainer tail = null;
				for (tail = kids; tail.next != null; tail = tail.next) {
					tail.parent = container.parent;
				}
				tail.parent = container.parent;
				tail.next = container.next;

				next = kids;

				container = prev;
			} else if (container.child != null) {
				pruneEmptyContainers(container);
			}
			prev = container;
			container = next;
			next = container == null ? null : container.next;
		}
	}

	private void gatherSubjects() {
		int count = 0;

		for (ThreadContainer c = this.root.child; c != null; c = c.next) {
			count++;
		}

		HashMap subjectTable = new HashMap((int) (count * 1.2D), 0.9F);
		count = 0;

		for (ThreadContainer c = this.root.child; c != null; c = c.next) {
			Threadable threadable = c.threadable;

			if (threadable == null) {
				threadable = c.child.threadable;
			}
			String subj = threadable.simplifiedSubject();

			if ((subj != null) && (subj != "")) {
				ThreadContainer old = (ThreadContainer) subjectTable.get(subj);

				if ((old == null)
						|| ((c.threadable == null) && (old.threadable != null))
						|| ((old.threadable != null)
								&& (old.threadable.subjectIsReply())
								&& (c.threadable != null) && (!c.threadable
								.subjectIsReply()))) {
					subjectTable.put(subj, c);
					count++;
				}
			}
		}

		if (count == 0) {
			return;
		}

		ThreadContainer prev = null;
		ThreadContainer c = this.root.child;
		for (ThreadContainer rest = c.next; c != null; rest = rest == null ? null
				: rest.next) {
			Threadable threadable = c.threadable;

			if (threadable == null) {
				threadable = c.child.threadable;
			}
			String subj = threadable.simplifiedSubject();

			if ((subj != null) && (subj != "")) {
				ThreadContainer old = (ThreadContainer) subjectTable.get(subj);

				if (old != c) {
					if (prev == null)
						this.root.child = c.next;
					else
						prev.next = c.next;
					c.next = null;

					if ((old.threadable == null) && (c.threadable == null)) {
						ThreadContainer tail = old.child;
						while ((tail != null) && (tail.next != null)) {
							tail = tail.next;
						}
						tail.next = c.child;

						for (tail = c.child; tail != null; tail = tail.next) {
							tail.parent = old;
						}
						c.child = null;
					} else if ((old.threadable == null)
							|| ((c.threadable != null)
									&& (c.threadable.subjectIsReply()) && (!old.threadable
									.subjectIsReply()))) {
						c.parent = old;
						c.next = old.child;
						old.child = c;
					} else {
						ThreadContainer newc = new ThreadContainer();
						newc.threadable = old.threadable;
						newc.child = old.child;

						for (ThreadContainer tail = newc.child; tail != null; tail = tail.next) {
							tail.parent = newc;
						}
						old.threadable = null;
						old.child = null;

						c.parent = old;
						newc.parent = old;

						old.child = c;
						c.next = newc;
					}

					c = prev;
				}
			}
			prev = c;
			c = rest;
		}

		subjectTable.clear();
		subjectTable = null;
	}
}