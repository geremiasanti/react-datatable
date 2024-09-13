function ProductCategoryRow({category}) {
	return (
		<tr>
			<th colspan="2">
				{category}
			</th>
		</tr>
	)
}

function ProductRow({product}) {
	return (
		<tr>
			<td>
				{product.name}
			</td>
			<td>
				{product.price}
			</td>
		</tr>
	)
}

function ProductTable({products}) {
	const rows = []
	let lastCategory = null;

	products.forEach((product) => {
		if(product.category !== lastCategory) {
			rows.push(
				<ProductCategoryRow 
					category={product.category} 
					key={product.category}
				/>
			);
			lastCategory = product.category;
		}
		rows.push(
			<ProductRow 
				product={product}
				key={product.name}
			/>
		);
	})

	return (
		<table>
			<thead>
				<tr>
					<th>Product</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}

function SearchBar() {
	return (
		<form>
			<input type="text" placeholder="Search.." />
			<div>
				<label>
					<input type="checkbox" />
					Only show products in stock
				</label>
			</div>
		</form>
	);
}

function FilterableProductTable({products}) {
	return (
		<>
			<SearchBar />
			<ProductTable products={products}/>
		</>
	);
}

const PRODUCTS = [
	{category: "Fruits", price: "$1", stocked: true, name: "Apple"},
	{category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
	{category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
	{category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
	{category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
	{category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
	return <FilterableProductTable products={PRODUCTS} />;
}
