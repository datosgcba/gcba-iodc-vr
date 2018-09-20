 window.currentMove= "";
 window.moves = [];
//setglobal Nunjuncls env
var env = new nunjucks.Environment();
  	
	
//Load info from datasets.
window.metadata = {
	datasets:[],
	categories:[],
};
//Group Datasets
var categories =[];
var colores = [];
colores["administracion"] = "#34485E";
colores["ambiente"] = "#99C25F";
colores["cultura"] = "#F563A2";
colores["actividad_economica"] = "#FCDA59";
colores["educacion"] = "#17C3E3";
colores["movilidad"] = "#E76056";
colores["obra"] = "#F3A22C";
colores["salud"] = "#2DBC98";
colores["seguridad"] = "#0289D1";
colores["urbanismo"] = "#9D6DB6";

window.game = {
	init:function(){
		if (window.metadata.datasets.length ==0){
			window.game.loadData(window.game.renderLobby);	
		}else {
			window.game.renderLobby();
		}
	},
	loadData:function(cb){
		d3.csv('data/meta-data-gcba.csv', function(csv){

		var total = 0; 

		csv.map(function(d){
			d.titulo = d.titulo.toUpperCase();
			d.isDestacado = d.destacado != '';
			if (d.source){
				d.code =d.source.replace('.csv','');
			}
			d.tamanio = parseInt(d.tamanio);
			if (isNaN(d.tamanio)){
				d.tamanio = 0;
			}

			total += d.tamanio;
		});
		var max = d3.max(csv,function(d){ return d.tamanio});
		var min = d3.min(csv,function(d){ return d.tamanio});
		var chartScale = d3.scaleLinear().domain([min,max]).range([1,100]);

		csv.map(function(d){
			d.barLength = d.tamanio/100000 + 1;
			if (d.barLength > 200){
				d.barLength = 200;
			}
		})


		window.metadata.datasets = csv;

			categories = window.metadata.categories = d3.nest()
	            .key(function(d) {
	              return d.categoria;
	            })
	            .entries(csv);
	        

		    categories.map(function(d){
		    	d.color = colores[d.key];
		    	console.log(d.color, d.key);
		    	d.rows = 0;
		    	d.title = d.key.toUpperCase();
		    	d.values.map(function(v){
		    		d.rows += parseInt(v.tamanio);
		    	});
		    	d.percentage = Math.round(d.rows * 100 /total,2);
		    	d.rowsLabel = Math.round(d.rows/100000) + " millones"
		    });
	   		 env.addGlobal('categories',categories);
	  		 nunjucks.categories = categories;
	  	
		
	    	cb();
		});
	},
	renderLobby : function(){

	  	
		var lobbyEl = document.getElementById('lobby-circle');
		var entityEl = document.createElement('a-entity');
		entityEl.setAttribute('do-circle-once-loaded', '');
		entityEl.setAttribute('id', 'lobby-inner');

		lobbyEl.appendChild(entityEl);
		


	},
	renderTrip: function(){

	
      d3.csv('data/' +window.game.currentDetail.source, function(c){
			
			c.map(function(d,i){
				d.index = i
			});
			
			
			env.addGlobal('currentTrip',c);
			window.game.currentTrips = c; 
			document.getElementById('lobby-inner').setAttribute('visible',false);
			      document.getElementById('category-circle').setAttribute('visible',false);
			      document.getElementById('category-circle').innerHTML ='';
			      var detailInner = document.getElementById('trip-detail');
			      
			      var entityInnerEl = document.createElement('a-entity');
			      
			      entityInnerEl.setAttribute('id', 'matrix-inner');
			      entityInnerEl.setAttribute('do-trip-once-loaded', '');
			      
			      detailInner.appendChild(entityInnerEl);
		  });
	},
	renderMatrix:function(){


		d3.csv('data/' +window.game.currentDetail.source, function(c){
			
			c.map(function(d,i){
				d.index = i
			});
			
			var cArray = [];
			for (var i = 0; i < 5; i++) {
				cArray.push(c.slice(i*20,(i+1)*20));
			}
			

			env.addGlobal('matrixArray',cArray);
			window.game.currentItemDataSet = c; 

			document.getElementById('lobby-inner').setAttribute('visible',false);
		      document.getElementById('category-circle').setAttribute('visible',false);
		      document.getElementById('category-circle').innerHTML ='';
		      var detailInner = document.getElementById('detail-circle');
		      
		      var entityInnerEl = document.createElement('a-entity');
		      
		      entityInnerEl.setAttribute('id', 'matrix-inner');
		      entityInnerEl.setAttribute('do-matrix-once-loaded', '');
		      
		      detailInner.appendChild(entityInnerEl);
		  });
      
  	},
	datasetRowDetail:function(datasetKey,element){

		var currentDetail = window.game.currentItemDataSet.filter(function(c){
			return c.index == parseInt(datasetKey);
		})[0];
		var result = [];
		    for( var property in currentDetail) {
		        var obj = {
		        	key:property,
		        	value: currentDetail[property]
		        }
		        result.push( obj ); 
		    }
    
		

		env.addGlobal('currentDetailRowDetail',result);
	  	nunjucks.currentDetailRowDetail = result;

	  	var detailEl = document.querySelector('a-entity.item.active .detail');
	  	detailEl.innerHTML = '';
		var detailInnerEl = document.createElement('a-entity');
		
		detailInnerEl.setAttribute('id', 'detail-inner');
		detailInnerEl.setAttribute('do-row-detail-once-loaded', '');
		
		detailEl.append(detailInnerEl);
		//Setup Lobby
	  	

	},
	renderDetail:function(datasetKey,element){

		var currentDetail = window.metadata.datasets.filter(function(c){
			return c.id == datasetKey;
		})[0];

		env.addGlobal('currentDetail',currentDetail);
		window.game.currentDetail = currentDetail;
		

	  	nunjucks.currentDetail = currentDetail;

	  	var detailEl = document.querySelector('a-entity.item.active .detail');
	  	detailEl.innerHTML = '';
		var detailInnerEl = document.createElement('a-entity');
		
		detailInnerEl.setAttribute('id', 'detail-inner');
		detailInnerEl.setAttribute('do-popup-once-loaded', '');
		
		detailEl.append(detailInnerEl);
		//Setup Lobby
	  	

	},
	reRenderLobby:function(){
		document.getElementById('category-circle').innerHTML = "";
		if (document.getElementById('trip-detail')){
			document.getElementById('trip-detail').innerHTML = "";	
		}
		if (document.getElementById('detail-circle')){
			document.getElementById('detail-circle').innerHTML = "";	
		}
		document.getElementById('detail-circle').innerHTML = "";
		document.getElementById('lobby-inner').setAttribute('visible',true);

	},	
	renderCategory: function(categoryKey){
		
		var currentCategory = categories.filter(function(c){
			return c.key == categoryKey;
		})[0];

		currentCategory.firstGroup = currentCategory.values;
		if (currentCategory.values.length > 24){
			var l = currentCategory.values.length ;
			var middle = Math.round(l/2);
			currentCategory.firstGroup = currentCategory.values.slice(0,middle)
			currentCategory.secondGroup = currentCategory.values.slice(middle +1,l-1);
		}


		env.addGlobal('currentCategory',currentCategory);
	  	nunjucks.currentCategory = currentCategory;


		document.getElementById('lobby-inner').setAttribute('visible',false);
		var categoryEl = document.getElementById('category-circle');
		var entityInnerEl = document.createElement('a-entity');
		
		entityInnerEl.setAttribute('id', 'category-inner');
		entityInnerEl.setAttribute('do-rectangle-once-loaded', '');
		
		categoryEl.appendChild(entityInnerEl);
		//Setup Lobby
	  	document.getElementById('category-inner').setAttribute('visible',true);
	  	document.getElementById('category-circle').setAttribute('visible',true);
	  	document.getElementById('circle-floor').setAttribute('material', 'src', '#' + currentCategory.key +  '-base');
	}


};


window.game.init();
AFRAME.registerComponent('do-rectangle-once-loaded', {
		  init: function () {
		  	this.el.setAttribute('template',{
		  		src:'#rectangle-menu'
		  	});

		  }
		});
AFRAME.registerComponent('do-popup-once-loaded', {
		  init: function () {
		  	this.el.setAttribute('template',{
		  		src:'#dataset-detail-menu'
		  	});

		  }
		});

AFRAME.registerComponent('do-matrix-once-loaded', {
		  init: function () {
		  	this.el.setAttribute('template',{
		  		src:'#dataset-menu'
		  	});

		  }
		});

AFRAME.registerComponent('do-trip-once-loaded', {
		  init: function () {
		  	this.el.setAttribute('template',{
		  		src:'#trip-menu'
		  	});

		  }
		});
AFRAME.registerComponent('do-row-detail-once-loaded', {
		  init: function () {
		  	this.el.setAttribute('template',{
		  		src:'#row-detail'
		  	});

		  }
		});
//Get Detail.
//Setup Lobby
	  	AFRAME.registerComponent('do-circle-once-loaded', {
		  init: function () {

		  	this.el.setAttribute('template',{
		  		src:'#circle-menu'
		  	});
		  	document.getElementById('circle-floor').setAttribute('material', 'src', '');

		  }
		});
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}