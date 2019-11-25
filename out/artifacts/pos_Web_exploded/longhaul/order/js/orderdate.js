function getTodyay(splitstr){
		 var d = new Date(),datestr = '';
		 datestr += d.getFullYear()+splitstr;
		 var month=d.getMonth() + 1;
		 month= month<10?"0"+month:month;
		 datestr  += month +splitstr;
		 var _date = d.getDate();
		 _date = _date<10?"0"+_date:_date;
		 datestr  +=  _date;
		 return datestr
}

function getMothFday(splitstr){
	 var d = new Date(),datestr = '';
	 datestr += d.getFullYear()+splitstr;
	 var month=d.getMonth() + 1;
	 month= month<10?"0"+month:month;
	 datestr  += month +splitstr;
	 var _date ="01";
	 datestr  +=  _date;
	 return datestr
}