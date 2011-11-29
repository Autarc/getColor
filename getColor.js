////////-- general functions --////////

// extension to remove an Object (DOM)
Object.prototype.remove = function(){
	this.parentNode.removeChild(this);
};


// recognize the position of the pointer
function pos(e) {
	var posX, posY;
	if (!e) e = window.event;	
	if (e.pageX === null){  // IE check
		var d = (document.documentElement && document.documentElement.scrollLeft !== null) ? document.documentElement : document.body;
		posX = e.clientX + d.scrollLeft;
		posY = e.clientY + d.scrollTop;			
	} else {  // all other browsers
		posX = e.pageX;
		posY = e.pageY;
	}
	return ([posX,posY]);
}				


////////-- trigger & events --////////


// Pressing => shows the value
window.onmousedown = function(e){

	clearTimeout(this.downTimer);
	this.downTimer = setTimeout(function(){
		
		var el = document.elementFromPoint(pos(e)[0],pos(e)[1]);
		var c = getColor(el);

		if(document.getElementById('colorPicker')) document.getElementById('colorPicker').remove();

		var show = document.createElement('div');
		show.id = 'colorPicker';
		show.style.position = 'absolute';
		show.style.border = '1px dashed #fff';
		show.style.backgroundColor = 'rgba(0,0,0,0.5)';
		show.style.left = pos(e)[0] + 'px';
		show.style.top = pos(e)[1] + 'px';
		show.style.padding = '5px 5px 5px 5px';
		show.style.cursor = 'pointer';
		show.style.zindex = '101';
		show.innerHTML =	'<font color="#f00">  R:  <font color="#fff">'+c[0]+'<font color="#0f0">  G:  <font color="#fff">'+c[1]+
							'<font color="#00f">  B:  <font color="#fff">'+c[2]+'<font color="rgba(255,255,255,0.8)">  A:  <font color="#fff">'+c[3];
 
		document.body.appendChild(show);

	}, 1000);

};


// Leaving the pressed button => reset the bounded timer
window.onmouseup = function(){
	clearTimeout(this.downTimer);
};


// Click on the Label to remove it
window.onclick = function(e){

	var el = document.elementFromPoint(pos(e)[0],pos(e)[1]);
	var cp = document.getElementById('colorPicker');
	if(el == cp) cp.remove();	
};



////////-- logic --////////


// gets the real value of a color | @el => the element you like to check
function getColor(el,v,h){

		if(el != document.body){		
				
			h = getColor(el.parentNode);

			v = (getStyle(el))?getStyle(el):'rgba(255,255,255,1.0)';
			v = v.match(/\d+(\.\d+)?/g);

			if(!v[3]) v[3] = '1';	
			if(!h[3]) h[3] = '1';
								
			return(mix(v,h));
		} 

		v = (getStyle(el))?getStyle(el):'rgba(255,255,255,1.0)';
		return v.match(/\d+(\.\d+)?/g);
	}   


// el = element, value = placeholder
function getStyle(el,value){
	if(document.defaultView && document.defaultView.getComputedStyle){
		value = document.defaultView.getComputedStyle(el,'').getPropertyValue('background-color');
	} else if (el.currentStyle){		
		value = el.currentStyle['background-color'];		
	}
	return value;
}


// A-RGB	|| v => vorder grund // h => hintegrund
function mix(v,h){
	a = (+h[3])+(+v[3])-(+h[3]*(+v[3]));		
	r = 0|(v[0]*v[3]+h[0]*(1-v[3])*h[3])/a;
	g = 0|(v[1]*v[3]+h[1]*(1-v[3])*h[3])/a;
	b = 0|(v[2]*v[3]+h[2]*(1-v[3])*h[3])/a;
	return [r,g,b,+a.toFixed(2)];								
}

