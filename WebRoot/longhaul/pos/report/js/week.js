var daterecord = [['1', '第一周'], ['2', '第二周'], ['3', '第三周'], ['4', '第四周']];
// 当月的天数
function solarDays(y, m) {
	var solarMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	if (m == 2)
		return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28)
	else
		return (solarMonth[m - 1])
}
// 日期设置
function setDay(y, m, d) {
	var index = 0;
	for (var i = 1; i <= d; i++) {
		var temp_btime = new Date(y + "/" + m + "/" + i);// 获取选择年月的1号
		var tempnum = temp_btime.getDay();// 获取选择日期的星期几0表示日

		if (tempnum == 0) {
			tempnum = 7
		}

		// alert(tempnum);
		if (tempnum == 1) {

			// begin_temp2=(new
			// Date(begin_temp2.setDate(begin_temp2.getDate()+7)));
			var endweek = (new Date(temp_btime
					.setDate((temp_btime.getDate() + 6))))
			var t_year = endweek.getYear();
			var t_month = endweek.getMonth();
			var t_date = endweek.getDate();

			daterecord[index++] = [index,
					(m + "月" + i + "日-" + (t_month + 1) + "月" + t_date + "日")];
		}
	}
	return index;
}
function getDayUtil(y, m, d) {
	var index = 0;
	for (var i = 1; i <= d; i++) {
		var temp_btime = new Date(y + "/" + m + "/" + i);// 获取选择年月的1号
		var tempnum = temp_btime.getDay();// 获取选择日期的星期几0表示日
		if (tempnum == 0) {
			tempnum = 7
		}
		if (tempnum == 1) {
			index++;
		}
	}
	return index;
}
// setDay('2012', '11', solarDays('2012', '11'));
