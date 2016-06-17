//console.log('window.dataLayer');
//console.log(window.dataLayer);

var exclusionesDeTitulo = ['',',','o','y','de', 'para','otros','otro','otra','otras','marca','marcas','modelo','modelos'];
var siteId = $('#feedback_site').val();

if($('#title')){
	
	AlertTitleHasNoCategory($('#title').val());
	
	$('#title').on('change', function(event) {
		AlertTitleHasNoCategory(event.currentTarget.value);
		
	});
	
	$('#title').on('keyup paste', function(event) {
		var titulo = event.currentTarget.value;
		
		$('#title-shortlen').remove();
		if(titulo.split(' ').length < 3){
			$(event.currentTarget).after('<p id="title-shortlen">Por favor complete con por lo menos 3 palabras el titulo del producto</p>');
		}
	});
}

function AlertTitleHasNoCategory(titulo) {
	var category = $('#feedback-category').val();
	console.log('category');
	console.log(category);
	if(!category){
		return;
	}
	
	$.ajax({
	  method: 'GET',
	  url: 'https://api.mercadolibre.com/categories/' + category
	}).done(function(data, textStatus, jqXHR) {
		var detallesCategoria = data;
		var categoriaL1Array = detallesCategoria.name.toLowerCase().split(' ');
		var cleanCategoriaL1Array = _(categoriaL1Array).difference(exclusionesDeTitulo);
		var tituloArrray = titulo.toLowerCase().split(' ');
		var palabrasFaltantes = _(cleanCategoriaL1Array).difference(tituloArrray);
		if(palabrasFaltantes.length > 0){
			alert('Deberias agregar al titulo las palabras: "' + palabrasFaltantes.join('","') + '" pertenecientes a tu categoria para aumentar la exposicion');
		}
	});	
};


$('#plain-description').on('keyup paste', function(event) {
	console.log('plain-description');
	var titulo = event.currentTarget.value;
	console.log(titulo);
	console.log(event.curren.value);
	$('#plain-description-shortlen').remove();
	if(titulo.length < 150){
		$(event.currentTarget).after('<p id="plain-description-shortlen">Por favor complete con mas de 150 caracteres la descripcion del producto'
		+ '<br /> - Agregue una descripcion detallada del mismo, especialmente cosas como color, estado general, caracteristicas tecnicas'
		+ '<br /> - Indica si hay stock y en que talles y colores, manten esto actualizado!!!'
		+ '<br /> - Aclare si el producto es nuevo o si es usado cuando lo compro y el uso que tuvo'
		+ '<br /> - De una referencia por donde se puede retirar el producto, puede ser un barrio, o un punto de referncia, por ejemplo: a 5 cuadras del obelisco'
		+ '<br /> - Añade los dias y horarios en que pueden contactarte o retirar el producto'
		+ '</p>');
	}
});

function OnCategoryChange(event) {
	var selectedCategory = event.currentTarget.value;
	$.ajax({
	  method: 'GET',
	  url: 'https://api.mercadolibre.com/sites/' + siteId + '/trends/search?category=' + selectedCategory,
	  cache: false
	})
	.done(function(data, textStatus, jqXHR) {
		var trendingCategorys = _(data).map( function(category){ return category.keyword; }).join();
		$('#trending-categorys').remove();
		$('.ch-form-hint.hub-bottomText').before('<p id="trending-categorys">Trending topics para tu categria <br />' + trendingCategorys + '</p>');
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		alert('status: ' + textStatus + ' error ' + errorThrown );
	});
};

$('.category-column select').on('change', OnCategoryChange);

$(".category-container").bind("DOMSubtreeModified", function(event) {
	var selects = $(event.currentTarget.children).find('select');
	_.each(selects, function(select, index){
		$(select).off('change', OnCategoryChange);
		$(select).on('change', OnCategoryChange);
	});	
});



