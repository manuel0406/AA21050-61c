// Modificación de la variable `fila` para incluir el botón de eliminar
var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td><button class='btn btn-danger btn-sm' onclick='return eliminarProducto(this);'>Eliminar</button></td></tr>";

var productos = null;
function codigoCat(catstr) {
	var code = "null";
	switch (catstr) {
		case "electronicos": code = "c1"; break;
		case "joyeria": code = "c2"; break;
		case "caballeros": code = "c3"; break;
		case "damas": code = "c4"; break;
	}
	return code;
}
var orden = 0;

//Eliminar un producto
function eliminarProducto(boton) {
	var confirmacion = confirm('¿Está seguro de eliminar este producto?');
	if (!confirmacion) return false;

	var fila = boton.parentNode.parentNode;
	var celdas = fila.getElementsByTagName('td');
	var informacionFila = celdas[0].textContent;
	fetch("https://api-generator.retool.com/7MrtGO/productos/" + informacionFila, { method: "delete" })
		.then(res => res.json())
		.then(data => productos = data);
	obtenerProductos();
	return false;
}


function listarProductos(productos) {
	var precio = document.getElementById("price");
	precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
	var num = productos.length;
	var listado = document.getElementById("listado");
	var ids, titles, prices, descriptions, categories, fotos;
	var tbody = document.getElementById("tbody"), nfila = 0;
	tbody.innerHTML = "";
	var catcode;
	for (i = 0; i < num; i++) tbody.innerHTML += fila;
	var tr;
	ids = document.getElementsByClassName("id");
	titles = document.getElementsByClassName("title");
	descriptions = document.getElementsByClassName("description");
	categories = document.getElementsByClassName("category");
	fotos = document.getElementsByClassName("foto");
	prices = document.getElementsByClassName("price");
	if (orden === 0) { orden = -1; precio.innerHTML = "Precio" }
	else
		if (orden == 1) { ordenarAsc(productos, "price"); precio.innerHTML = "Precio A"; precio.style.color = "darkgreen" }
		else
			if (orden == -1) { ordenarDesc(productos, "price"); precio.innerHTML = "Precio D"; precio.style.color = "blue" }


	listado.style.display = "block";
	for (nfila = 0; nfila < num; nfila++) {
		ids[nfila].innerHTML = productos[nfila].id;
		titles[nfila].innerHTML = productos[nfila].title;
		descriptions[nfila].innerHTML = productos[nfila].description;
		categories[nfila].innerHTML = productos[nfila].category;
		catcode = codigoCat(productos[nfila].category);
		tr = categories[nfila].parentElement;
		tr.setAttribute("class", catcode);
		prices[nfila].innerHTML = "$" + productos[nfila].price;
		fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
		fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");
	}
}

function obtenerProductos() {
	fetch('https://retoolapi.dev/7MrtGO/productos')
		.then(res => res.json())
		.then(data => { productos = data; listarProductos(data) })
}

function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return -1;
		if (a[p_key] < b[p_key]) return 1;
		return 0;
	});
}

function ordenarAsc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return 1;
		if (a[p_key] < b[p_key]) return -1;
		return 0;
	});
}

document.getElementById('formProd').addEventListener('submit', function (event) {
	event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

	// Obtener los valores de los campos de entrada
	const titulo = document.getElementById('titulo').value;
	const precio = document.getElementById('precio').value;
	const descripcion = document.getElementById('descripcion').value;
	const imagen = document.getElementById('imagen').value;
	const categoria = document.getElementById('inputGroupSelect01').value;

	// Crear el objeto de datos a enviar
	const data = {
		title: titulo,
		price: precio,
		description: descripcion,
		image: imagen,
		category: categoria
	};

	// Enviar la solicitud POST a la API
	fetch('https://api-generator.retool.com/7MrtGO/productos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error('Error al enviar los datos');
		})
		.then(result => {
			console.log('Producto agregado:', result);
			obtenerProductos();
			alert('Producto agregado exitosamente');
		})
		.catch(error => {
			console.error('Error:', error);
			alert('Hubo un error al agregar el producto');
		});
});