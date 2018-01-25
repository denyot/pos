$(function() {
			var date = new Date();

			var weekday = date.getDay();

			function getYearWeek(date) {
				var date2 = new Date(date.getFullYear(), 0, 1);
				var day1 = date.getDay();
				if (day1 == 0)
					day1 = 7;
				var day2 = date2.getDay();
				if (day2 == 0)
					day2 = 7;
				d = Math
						.round((date.getTime() - date2.getTime() + (day2 - day1)
								* (24 * 60 * 60 * 1000))
								/ 86400000);
				return Math.ceil(d / 7);
			}

			var weeksindex = getYearWeek(date);

			// alert(weekday);
			// alert(weeksindex);

			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();

			// alert(date);
			// alert(year);
			// alert(month);
			// alert(day);
			
			$("#type").change(function(e){
				if($(this).val() == "1"){
					$("#weeksSpan").show();
					$("#monthsSpan").hide();
					getWeeksInfo();
				}else if($(this).val() == "2"){
					$("#weeksSpan").hide();
					$("#monthsSpan").show();
					getMonthInfo();
				}
			});
			
			function getWeeksInfo() {
				$("#weeks").empty();
				var option = $("<option value=''>请选择...</option>");
				$("#weeks").append(option);
				for (var i = -2; i < 2; i++) {
					var firstDay = showdate(new Date(), (1 - weekday) + 7 * i);
					var lastDay = showdate(firstDay, 6);
					var myweeksindex = weeksindex + i;
					var option = $("<option value='" + myweeksindex + "'>第"
							+ myweeksindex + "周（从" + firstDay.getFullYear()
							+ "-" + (firstDay.getMonth() + 1) + "-"
							+ firstDay.getDate() + "到" + lastDay.getFullYear()
							+ "-" + (lastDay.getMonth() + 1) + "-"
							+ lastDay.getDate() + "）</option>");
					$("#weeks").append(option);
				}
			}
			
			function getMonthInfo() {
				$("#months").empty();
				var option = $("<option value=''>请选择...</option>");
				$("#months").append(option);
				for (var i = -2; i < 2; i++) {
					var currentMonth = date.getMonth() + 1;
					currentMonth = currentMonth + i;
					var option = $("<option value='" + currentMonth + "'>"+currentMonth+"月</option>");
					$("#months").append(option);
				}
			}

			function showdate(date, n) {
				var uom = new Date(date - 0 + n * 86400000);
				return uom;
			}

		});
