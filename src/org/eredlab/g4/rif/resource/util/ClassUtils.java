package org.eredlab.g4.rif.resource.util;

import java.io.InputStream;

public class ClassUtils {
	public static Class getClass(String clazz) throws ClassNotFoundException {
		ClassLoader loader = Thread.currentThread().getContextClassLoader();
		if (loader != null) {
			try {
				return Class.forName(clazz, true, loader);
			} catch (ClassNotFoundException localClassNotFoundException) {
			}

		}

		return Class.forName(clazz);
	}

	public static Object getNewInstance(String clazz)
			throws ClassNotFoundException, IllegalAccessException,
			InstantiationException {
		return getClass(clazz).newInstance();
	}

	public static InputStream getResourceAsStream(Class claz, String name) {
		InputStream result = null;

		while (name.startsWith("/")) {
			name = name.substring(1);
		}

		ClassLoader classLoader = Thread.currentThread()
				.getContextClassLoader();

		if (classLoader == null) {
			classLoader = claz.getClassLoader();
			result = classLoader.getResourceAsStream(name);
		} else {
			result = classLoader.getResourceAsStream(name);

			if (result == null) {
				classLoader = claz.getClassLoader();
				if (classLoader != null) {
					result = classLoader.getResourceAsStream(name);
				}
			}
		}
		return result;
	}
}