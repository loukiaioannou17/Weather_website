function onClick_Clear() {
	let address = document.querySelector('#address');
	address.value="";
  
  	let region = document.querySelector('#region');
	region.value="";
	
	let degree = document.querySelector('#celcius');
	degree.checked = true;
	
	let dropdown = document.querySelector('#city');
	dropdown.selectedIndex=0;

	document.querySelector("#invalid-feedback-address").classList.add("hidden");
	document.querySelector("#invalid-feedback-region").classList.add("hidden");
	document.querySelector("#invalid-feedback-city").classList.add("hidden");
	
	document.querySelector("#right_now").classList.add("hidden");
	document.querySelector("#day").classList.add("hidden");

	document.querySelector("#whole").classList.add("hidden");

}

var cord = [1000,0];
let address_value,region_value,city,degree_value;
var flag_map=false;

function GetValues(){
	let flag_return=true;

	let address = document.querySelector('#address');
	address_value = address.value;
	if(address_value=="" || address_value==" "){
		document.querySelector("#invalid-feedback-address").classList.remove("hidden");
		flag_return = false;	
	}
  
  	let region = document.querySelector('#region');
	region_value = region.value;
	if(region_value=="" || region_value==" "){
		document.querySelector("#invalid-feedback-region").classList.remove("hidden");
		flag_return = false;	
	}
	
	let dropdown = document.querySelector('#city');
	city = dropdown.options[dropdown.selectedIndex].text;
	if (dropdown.selectedIndex==0){
		document.querySelector("#invalid-feedback-city").classList.remove("hidden");
		flag_return = false;
	}
	
    let degree = document.querySelector('#celcius');
	if (degree.checked == true)
		degree_value = 'metric';
	else
		degree_value = 'imperial'

	return flag_return;
	
}

var from="";

function getCoordinates(){

	
	if( GetValues() == false ) return;

	var xhr_post = new XMLHttpRequest();
	// Setup our listener to process completed requests
	xhr_post.onreadystatechange = function () {
		// Only run if the request is complete
		if (xhr_post.readyState !== 4) return;
		// Process our return data
		if (xhr_post.status >= 200 && xhr_post.status < 300) {
			console.log(xhr_post.responseText);
		} else {
			console.log('error', xhr_post);
		}
	};

	xhr_post.open('POST', 'action_page_post.php');
	xhr_post.setRequestHeader("Content-Type", "application/json");
            let data = {
                "username": "lioann02",
                "address": address_value,
                "region": region_value,
                "city": city
            }
            xhr_post.send(JSON.stringify(data));
	


	let xhr = new XMLHttpRequest();
	var response;
	xhr.onreadystatechange = function(){
		if (xhr.readyState!=4) return;
		if (xhr.status >= 200 && xhr.status < 300){
			response = JSON.parse(xhr.responseText);
			if(!Object.keys(response).length){
				alert("No result for that location");
				return;
			} 
		
			cord[0]=parseFloat(response[0].lat);
			cord[1]=parseFloat(response[0].lon);
            continue_with_coordinates(from);
	
		}
		else
			console.log('error',xhr);
		
	};
	
	xhr.open('GET','https://nominatim.openstreetmap.org/search?q='+address_value+','+region_value+', '+city +'&format=json');
	
	
	xhr.send();
}



function continue_with_coordinates(){


			
	document.querySelector("#now").classList.add("active");
	document.querySelector("#hours").classList.remove("active");

	document.querySelector("#right_now").classList.remove("hidden");
	document.querySelector("#day").classList.add("hidden");

	document.querySelector("#whole").classList.remove("hidden");

	let xhr_current = new XMLHttpRequest();
	var response_current;
	xhr_current.onreadystatechange = function(){
		if (xhr_current.readyState!=4) return;
		if (xhr_current.status >= 200 && xhr_current.status < 300){
			response_current = JSON.parse(xhr_current.responseText);
		
			document.querySelector("#description").innerHTML = response_current.weather[0].description + " in " + response_current.name;
			
			document.querySelector("#icon").src = "https://openweathermap.org/img/w/"+response_current.weather[0].icon+".png";
			
			if (degree_value=='metric'){
				document.querySelector("#current_weather").innerHTML = response_current.main.temp + "&#176C";
				document.querySelector("#temp_min").innerHTML = "L:" + response_current.main.temp_min +" &#176C";
				document.querySelector("#temp_max").innerHTML = "H:" + response_current.main.temp_max + " &#176C";
				document.querySelector("#pressure").innerHTML = response_current.main.pressure + " hPa";
				document.querySelector("#wind").innerHTML = response_current.wind.speed + " meters/sec";}
			else{
				document.querySelector("#current_weather").innerHTML = response_current.main.temp + "&#176F";
				document.querySelector("#temp_min").innerHTML = "L:" + response_current.main.temp_min +" &#176F";
				document.querySelector("#temp_max").innerHTML = "H:" + response_current.main.temp_max + " &#176F";
				document.querySelector("#wind").innerHTML = response_current.wind.speed + " miles/hour";
				document.querySelector("#pressure").innerHTML = response_current.main.pressure + " Mb";
			}
			
			document.querySelector("#humidity").innerHTML = response_current.main.humidity + "%"
			document.querySelector("#clouds").innerHTML = response_current.clouds.all + "%";
		
			let dt = response_current.sys.sunrise;
			var date = new Date(dt*1000);
			var hours = date.getHours();
			var minutes = "0" + date.getMinutes();
			var formattedTime_sunrise = hours+":"+minutes.substr(-2);
			document.querySelector('#sunrise').innerHTML = formattedTime_sunrise;

			dt = response_current.sys.sunset;
			date = new Date(dt*1000);
			hours = date.getHours();
			minutes = "0" + date.getMinutes();
			formattedTime_sunset = hours+":"+minutes.substr(-2);
			document.querySelector('#sunset').innerHTML = formattedTime_sunset;
			
		}
		else
			console.log('error',xhr_current);
		
	};
	
	xhr_current.open('GET','https://api.openweathermap.org/data/2.5/weather?lat='+cord[0]+'&lon='+cord[1]+'&units='+degree_value+'&APPID=d95ead19d1630158392aaa453c86fcb0');
	xhr_current.send();
	if(flag_map==false){
		var map = new ol.Map({ // a map object is created
		 	target: 'map', // the id of the div in html to contain the map
 			layers: [ // list of layers available in the map
 				new ol.layer.Tile({ // first and only layer is the OpenStreetMap tiled layer
 					source: new ol.source.OSM()
 				})
 			],
 			view: new ol.View({ // view allows to specify center, resolution, rotation of the map
				center: ol.proj.fromLonLat(cord), // center of the map
 				zoom: 5 // zoom level (0 = zoomed out)
 			})
		});

   		     layer_temp = new ol.layer.Tile({
  	 	     source: new ol.source.XYZ({
      	      url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=d95ead19d1630158392aaa453c86fcb0'
        })

   		 });
  	  map.addLayer(layer_temp);
		flag_map=true;


    
   	 layer_perception = new ol.layer.Tile({
   	     source: new ol.source.XYZ({
    	        url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=d95ead19d1630158392aaa453c86fcb0'
   	     })

 	   });
   	 	map.addLayer(layer_perception);}

	}

function Day_GetCoordinates(){

	GetValues();
	let xhr = new XMLHttpRequest();
	var response;
	xhr.onreadystatechange = function(){
		if (xhr.readyState!=4) return;
		if (xhr.status >= 200 && xhr.status < 300){
			response = JSON.parse(xhr.responseText);
			cord[0]=parseFloat(response[0].lat);
			cord[1]=parseFloat(response[0].lon);
            		Day_Continue();
			
		}
		else
			console.log('error',xhr);
		
	};
	
	xhr.open('GET','https://nominatim.openstreetmap.org/search?q='+address_value+','+region_value+', '+city +'&format=json');
	
	xhr.send();

}

function Day_Continue(){
	
	document.querySelector("#now").classList.remove("active");
	document.querySelector("#hours").classList.add("active");

	document.querySelector("#right_now").classList.add("hidden");
	document.querySelector("#day").classList.remove("hidden");

	let xhr_day = new XMLHttpRequest();
	var response_day;
	xhr_day.onreadystatechange = function(){
		if (xhr_day.readyState!=4) return;
		if (xhr_day.status >= 200 && xhr_day.status < 300){
			response_day = JSON.parse(xhr_day.responseText);
		
		
			//document.querySelector("#icon").src = "https://openweathermap.org/img/w/"+response_current.weather[0].icon+".png";
			var i;
			for(i=0;i<8;i++){
				var elemnentID= i+1;
				let dt = response_day.list[i].dt;
				var date = new Date(dt*1000);
				var hours = date.getHours();
				var minutes = "0" + date.getMinutes();
				var formattedTime = hours+":"+minutes.substr(-2);
				
				document.querySelector("#time"+elemnentID).innerHTML=formattedTime
				document.querySelector("#icon"+elemnentID).src = "https://openweathermap.org/img/w/"+response_day.list[i].weather[0].icon+".png";
				if (degree_value=='metric')
					document.querySelector("#temp"+elemnentID).innerHTML=response_day.list[i].main.temp + " &#176C";
				else
					document.querySelector("#temp"+elemnentID).innerHTML=response_day.list[i].main.temp + " &#176F";

				document.querySelector("#cloud"+elemnentID).innerHTML=response_day.list[i].clouds.all + " %";

			}
			
		}
		else
			console.log('error',xhr_current);
		
	};
	
	xhr_day.open('GET','https://api.openweathermap.org/data/2.5/forecast?lat='+cord[0]+'&lon='+cord[1]+'&units='+degree_value+'&APPID=d95ead19d1630158392aaa453c86fcb0');
	xhr_day.send();

	
}

function openModal_getCoordinates(elementID){


	GetValues();
	let xhr = new XMLHttpRequest();
	var response;
	xhr.onreadystatechange = function(){
		if (xhr.readyState!=4) return;
		if (xhr.status >= 200 && xhr.status < 300){
			response = JSON.parse(xhr.responseText);
			cord[0]=parseFloat(response[0].lat);
			cord[1]=parseFloat(response[0].lon);
            openActuallModal(elementID);
		
		}
		else
			console.log('error',xhr);
		
	};
	
	xhr.open('GET','https://nominatim.openstreetmap.org/search?q='+address_value+','+region_value+', '+city +'&format=json');
	
	xhr.send();

}

function openActuallModal(elementID){

	document.querySelector("#view-modal").classList.add("is-visible");

	let xhr_day = new XMLHttpRequest();
	var response_day;
	xhr_day.onreadystatechange = function(){
		if (xhr_day.readyState!=4) return;
		if (xhr_day.status >= 200 && xhr_day.status < 300){
			
			response_day = JSON.parse(xhr_day.responseText);
			var date = response_day.list[elementID].dt_txt;
			
			var d = new Date(date);	
			var full_date = "Weather in " + response_day.city.name + " on "
			
			if (d.getDate() < 10){ full_date = full_date + "0" +d.getDate() + " "; }
			else{ full_date = full_date + d.getDate()  + " "; }
			
			var months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
			full_date=full_date+months[d.getMonth()]+ " ";
			full_date = full_date + d.getFullYear() + " ";

			if(d.getHours() < 10){ full_date = full_date + "0" + d.getHours() + ":"; }
			else { full_date = full_date + d.getHours() + ":"; }

			if(d.getMinutes() < 10){ full_date = full_date + "0" + d.getMinutes(); }
			else { full_date = full_date + d.getMinutes(); }

			document.querySelector("#modal-title").innerHTML= full_date;
			document.querySelector("#modal-image").src="https://openweathermap.org/img/w/"+response_day.list[elementID-1].weather[0].icon+".png";
			document.querySelector("#modal-description").innerHTML= response_day.list[elementID-1].weather[0].description;
			document.querySelector("#hum").innerHTML= response_day.list[elementID-1].main.humidity + " %";
			if (degree_value=="metric"){
				document.querySelector("#press").innerHTML= response_day.list[elementID-1].main.pressure + " hPa";
				document.querySelector("#wind-modal").innerHTML= response_day.list[elementID-1].wind.speed + " meters/sec";}
			else{
				document.querySelector("#press").innerHTML= response_day.list[elementID-1].main.pressure + " Mb";
				document.querySelector("#wind-modal").innerHTML= response_day.list[elementID-1].wind.speed + " miles/hour";

			}
			
		}
		else
			console.log('error',xhr_current);
		
	};
	
	xhr_day.open('GET','https://api.openweathermap.org/data/2.5/forecast?lat='+cord[0]+'&lon='+cord[1]+'&units='+degree_value+'&APPID=d95ead19d1630158392aaa453c86fcb0');
	xhr_day.send();

}

function onClick_Last(){

var xhr_get = new XMLHttpRequest();
	// Setup our listener to process completed requests
	xhr_get.onreadystatechange = function () {
		// Only run if the request is complete
		if (xhr_get.readyState !== 4) return;
		// Process our return data
		if (xhr_get.status >= 200 && xhr_get.status < 300) {
			parse_get_information(xhr_get.responseText);

		} else {
			console.log('error', xhr_get);
		}
	};

	xhr_get.open('GET', 'action_page_get.php');
	
	
        xhr_get.send();
}

function parse_get_information(data){

	document.querySelector("#myModal").classList.add("is-visible");
	
	var i=2;
	var chars=0;
	var count=1;
	var temp;
var elementID=0;

var lines=Number(data[0]+data[1]);

var response_array = new Array(lines);
for(var j=0;j<lines;j++)
	response_array[j]= new Array(4);
	while(true){
		var character=data[i];
		
		if (character=="\n"){
	
			
			response_array[elementID]["city"]=temp;
			temp="";
			chars++;			
			count++;
			
			chars=0;
			elementID++;
			
			
		}
		if (character==" "){
			if(chars==0){
			
				var d = new Date(parseInt(temp)*1000);	
				var full_date="";
				if (d.getDate() < 10){ full_date = full_date + "0" +d.getDate() + " "; }
				else{ full_date = full_date + d.getDate()  + " "; }
			
				var months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
				full_date=full_date+months[d.getMonth()] + " ";
				full_date = full_date + d.getFullYear() + " ";

				if(d.getHours() < 10){ full_date = full_date + "0" + d.getHours() + ":"; }
				else { full_date = full_date + d.getHours() + ":"; }

				if(d.getMinutes() < 10){ full_date = full_date + "0" + d.getMinutes(); }
				else { full_date = full_date + d.getMinutes(); }
				response_array[elementID]["date"]=full_date;
				temp="";
				chars++;
			}
			else if(chars==1){
			
				response_array[elementID]["address"]=temp;
				temp="";
				chars++;
			}

			else if(chars==2){
				response_array[elementID]["region"]=temp;
				temp="";
				chars++;
			}
		}
		if(count==lines+1)
			break;	
		temp=temp+character;	
	i++;
		
	}

var first = lines-5;

var elementID=5;
for(var k=first;k<lines;k++){
	
	
	document.querySelector("#date"+elementID).innerHTML=response_array[k]["date"];
	document.querySelector("#address"+elementID).innerHTML=response_array[k]["address"];
	document.querySelector("#region"+elementID).innerHTML=response_array[k]["region"];
	document.querySelector("#city"+elementID).innerHTML=response_array[k]["city"];

elementID--;
}


}


const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', onClick_Clear);

const lastButton = document.querySelector('#last');
lastButton.addEventListener('click', onClick_Last)

const searchButton = document.querySelector('#search');
searchButton.addEventListener('click',getCoordinates);

const NowButton = document.querySelector('#now');
NowButton.addEventListener('click',getCoordinates);

const hoursButton = document.querySelector('#hours');
hoursButton.addEventListener('click',Day_GetCoordinates);

const button1 = document.querySelector('#button1');
button1.addEventListener('click', function(){
		openModal_getCoordinates(1); 
	},false);

const button2 = document.querySelector('#button2');
button2.addEventListener('click', function(){
		openModal_getCoordinates(2); 
	},false);

	const button3 = document.querySelector('#button3');
	button3.addEventListener('click', function(){
			openModal_getCoordinates(3); 
		},false);

		const button4 = document.querySelector('#button4');
button4.addEventListener('click', function(){
		openModal_getCoordinates(4); 
	},false);

	const button5 = document.querySelector('#button5');
button5.addEventListener('click', function(){
		openModal_getCoordinates(5); 
	},false);

	const button6 = document.querySelector('#button6');
button6.addEventListener('click', function(){
		openModal_getCoordinates(6); 
	},false);

	const button7 = document.querySelector('#button7');
button7.addEventListener('click', function(){
		openModal_getCoordinates(7); 
	},false);

	const button8 = document.querySelector('#button8');
button8.addEventListener('click', function(){
		openModal_getCoordinates(8); 
	},false);
